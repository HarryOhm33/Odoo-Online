// src/pages/app/assets/Assets.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import usePermissions from "../../../hooks/usePermissions";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import AssetTable from "../../../components/features/assets/AssetTable";
import AssetCard from "../../../components/features/assets/AssetCard";
import Modal from "../../../components/common/Modal";
import api from "../../../services/api";
import { FiGrid, FiList, FiPlus, FiBox, FiTag, FiCalendar, FiUser, FiActivity } from "react-icons/fi";
import { toast } from "react-toastify";

const Assets = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [assets, setAssets]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees]   = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [view, setView]             = useState("table");

  // Create Asset Form Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory]   = useState(null);

  // Allocate Asset Modal
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset]             = useState(null);

  // Return Asset Modal
  const [isReturnModalOpen, setIsReturnModalOpen]     = useState(false);

  // Form State - Register Asset
  const [name, setName]                         = useState("");
  const [categoryId, setCategoryId]             = useState("");
  const [serialNumber, setSerialNumber]         = useState("");
  const [acquisitionDate, setAcquisitionDate]   = useState("");
  const [acquisitionCost, setAcquisitionCost]   = useState("");
  const [condition, setCondition]               = useState("Good");
  const [location, setLocation]                 = useState("");
  const [photo, setPhoto]                       = useState("");
  const [sharedBookable, setSharedBookable]     = useState(false);
  const [customFieldsValues, setCustomFieldsValues] = useState({});

  // Form State - Allocate Asset
  const [allocateType, setAllocateType]         = useState("user"); // user | department
  const [allocateUser, setAllocateUser]         = useState("");
  const [allocateDept, setAllocateDept]         = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");

  // Form State - Return Asset
  const [conditionAtCheckIn, setConditionAtCheckIn] = useState("Good");

  const canRegister = can("asset:register");
  const canAllocate = can("allocation:create");

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const reqs = [
        api.get("/api/assets"),
        api.get("/api/categories"),
      ];
      
      if (canAllocate) {
        reqs.push(api.get("/api/employees"));
        reqs.push(api.get("/api/departments"));
      }

      const results = await Promise.allSettled(reqs);
      
      let allAssets = [];
      if (results[0].status === "fulfilled") {
        allAssets = results[0].value.data.assets || [];
      } else {
        toast.error("Failed to load assets.");
      }
      
      // Filter assets based on permissions
      if (!can("asset:view_all")) {
        if (can("asset:view_dept")) {
          allAssets = allAssets.filter(a => a.department === user.department || a.assignedTo?._id === user._id);
        } else if (can("asset:view_own")) {
          allAssets = allAssets.filter(a => a.assignedTo?._id === user._id);
        }
      }

      setAssets(allAssets);

      if (results[1]?.status === "fulfilled") {
        setCategories(results[1].value.data.categories || []);
      }

      if (canAllocate) {
        if (results[2]?.status === "fulfilled") {
          setEmployees(results[2].value.data.employees || []);
        }
        if (results[3]?.status === "fulfilled") {
          setDepartments(results[3].value.data.departments || []);
        }
      }
      
    } catch (err) {
      toast.error("An error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCategoryChange = (catId) => {
    setCategoryId(catId);
    const cat = categories.find((c) => c._id === catId);
    setSelectedCategory(cat);
    // Initialize dynamic values
    const vals = {};
    if (cat?.customFields) {
      cat.customFields.forEach((field) => {
        vals[field.name] = "";
      });
    }
    setCustomFieldsValues(vals);
  };

  const handleOpenRegister = () => {
    setName("");
    setCategoryId("");
    setSelectedCategory(null);
    setSerialNumber("");
    setAcquisitionDate("");
    setAcquisitionCost("");
    setCondition("Good");
    setLocation("");
    setPhoto("");
    setSharedBookable(false);
    setCustomFieldsValues({});
    setIsCreateModalOpen(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        category: categoryId,
        serialNumber,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        acquisitionCost: acquisitionCost ? Number(acquisitionCost) : null,
        condition,
        location,
        photo,
        sharedBookable,
        customAttributes: customFieldsValues,
      };

      await api.post("/api/assets", payload);
      toast.success("Asset registered successfully!");
      setIsCreateModalOpen(false);
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  const handleOpenAllocate = (asset) => {
    setSelectedAsset(asset);
    setAllocateType("user");
    setAllocateUser("");
    setAllocateDept("");
    setExpectedReturnDate("");
    setIsAllocateModalOpen(true);
  };

  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        assignedTo: allocateType === "user" ? allocateUser : null,
        department: allocateType === "department" ? allocateDept : null,
        expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate) : null,
      };

      await api.post(`/api/assets/${selectedAsset._id}/allocate`, payload);
      toast.success("Asset allocated successfully!");
      setIsAllocateModalOpen(false);
      fetchAllData();
    } catch (err) {
      if (err.response?.status === 409) {
        // Double allocation conflict
        toast.warning(
          <div>
            <p className="font-semibold">{err.response.data.message}</p>
            <p className="text-xs">Held by: {err.response.data.currentlyHeldBy}</p>
          </div>
        );
      } else {
        toast.error(err.response?.data?.message || "Allocation failed.");
      }
    }
  };

  const handleOpenReturn = (asset) => {
    setSelectedAsset(asset);
    setConditionAtCheckIn(asset.condition || "Good");
    setIsReturnModalOpen(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/assets/${selectedAsset._id}/return`, {
        conditionAtCheckIn,
      });
      toast.success("Asset successfully returned to inventory.");
      setIsReturnModalOpen(false);
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Return action failed.");
    }
  };

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.assetTag?.toLowerCase().includes(search.toLowerCase()) ||
    a.serialNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title={can("asset:view_all") ? "Asset Directory" : can("asset:view_dept") ? "Department Assets" : "My Assets"}
        subtitle="Manage and track physical assets"
        actions={
          canRegister && (
            <button
              onClick={handleOpenRegister}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <FiPlus className="h-4 w-4" />
              Register Asset
            </button>
          )
        }
      />

      <div className="flex items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search assets by tag, name, or serial number..."
          className="flex-1 max-w-sm"
        />
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setView("table")}
            className={`p-2 transition-colors cursor-pointer ${view === "table" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <FiList className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`p-2 transition-colors cursor-pointer ${view === "grid" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <FiGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "table" ? (
        <AssetTable
          assets={filteredAssets}
          loading={loading}
          onRowClick={(asset) => {
            if (canAllocate) {
              if (asset.status === "Available") {
                handleOpenAllocate(asset);
              } else if (asset.status === "Allocated") {
                handleOpenReturn(asset);
              }
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset._id}
              asset={asset}
              onClick={(a) => {
                if (canAllocate) {
                  if (a.status === "Available") {
                    handleOpenAllocate(a);
                  } else if (a.status === "Allocated") {
                    handleOpenReturn(a);
                  }
                }
              }}
            />
          ))}
          {filteredAssets.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              No assets found.
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Register Asset */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Asset"
        footer={
          <>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleRegisterSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Register
            </button>
          </>
        }
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name *</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MacBook Pro 16"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select
                value={categoryId} required onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
              <input
                type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Cost</label>
              <input
                type="number" value={acquisitionCost} onChange={(e) => setAcquisitionCost(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Date</label>
              <input
                type="date" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Initial Condition</label>
              <select
                value={condition} onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="HQ Room 204"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox" checked={sharedBookable} onChange={(e) => setSharedBookable(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                Is Shared Bookable Resource? (For calendar time-slot booking)
              </label>
            </div>
          </div>

          {/* Dynamic category-specific custom attributes */}
          {selectedCategory?.customFields && selectedCategory.customFields.length > 0 && (
            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                {selectedCategory.name} Custom Attributes
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedCategory.customFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-medium text-slate-500 mb-0.5">{field.name}</label>
                    <input
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      value={customFieldsValues[field.name] || ""}
                      onChange={(e) =>
                        setCustomFieldsValues((prev) => ({
                          ...prev,
                          [field.name]: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* MODAL 2: Allocate Asset */}
      <Modal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        title={`Allocate Asset: ${selectedAsset?.name}`}
        footer={
          <>
            <button
              onClick={() => setIsAllocateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAllocateSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Allocate
            </button>
          </>
        }
      >
        <form onSubmit={handleAllocateSubmit} className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 text-sm">
              <input
                type="radio" name="allocType" checked={allocateType === "user"} onChange={() => setAllocateType("user")}
              />
              Allocate to Employee
            </label>
            <label className="flex items-center gap-1.5 text-sm">
              <input
                type="radio" name="allocType" checked={allocateType === "department"} onChange={() => setAllocateType("department")}
              />
              Allocate to Department
            </label>
          </div>

          {allocateType === "user" ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee *</label>
              <select
                value={allocateUser} required onChange={(e) => setAllocateUser(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose employee...</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Department *</label>
              <select
                value={allocateDept} required onChange={(e) => setAllocateDept(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose department...</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} {dept.code ? `(${dept.code})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expected Return Date</label>
            <input
              type="date" value={expectedReturnDate} onChange={(e) => setExpectedReturnDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Return Asset Check-In */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title={`Return Asset / Check-in: ${selectedAsset?.name}`}
        footer={
          <>
            <button
              onClick={() => setIsReturnModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReturnSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Confirm Return
            </button>
          </>
        }
      >
        <form onSubmit={handleReturnSubmit} className="space-y-4">
          <p className="text-sm text-slate-500 leading-relaxed">
            Record checking-in notes and review the current condition of the asset. This will revert the asset state back to <span className="font-semibold text-slate-700">Available</span>.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Condition on Return</label>
            <select
              value={conditionAtCheckIn} onChange={(e) => setConditionAtCheckIn(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Assets;
