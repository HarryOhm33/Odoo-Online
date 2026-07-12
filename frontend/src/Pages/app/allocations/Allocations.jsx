import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import usePermissions from "../../../hooks/usePermissions";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import Table from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";
import Modal from "../../../components/common/Modal";
import api from "../../../services/api";
import { FiRefreshCw, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

const columns = (onReturn, isAssetManager) => [
  { key: "name",        label: "Asset Name" },
  { key: "assetTag",    label: "Asset Tag" },
  { key: "assignedTo",  label: "Assigned User",  render: (v) => v?.name || "—" },
  { key: "department",  label: "Department",     render: (v) => v?.name || "—" },
  { key: "expectedReturnDate", label: "Expected Return", render: (v) => v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "No Limit" },
  {
    key: "actions",
    label: "Action",
    render: (_, row) => isAssetManager ? (
      <button
        onClick={() => onReturn(row)}
        className="text-blue-600 hover:text-blue-800 font-semibold text-xs cursor-pointer"
      >
        Check-in Return
      </button>
    ) : "—",
  },
];

const Allocations = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [allocatedAssets, setAllocatedAssets] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [employees, setEmployees]             = useState([]);
  const [departments, setDepartments]         = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");

  // Check-in / Return Modal
  const [isReturnOpen, setIsReturnOpen]   = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [conditionAtCheckIn, setCondition] = useState("Good");

  // Allocate Asset Modal
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [allocateAssetId, setAllocateAssetId] = useState("");
  const [allocateType, setAllocateType]       = useState("user");
  const [allocateUser, setAllocateUser]       = useState("");
  const [allocateDept, setAllocateDept]       = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");

  const canAllocate = can("allocation:create");

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const reqs = [api.get("/api/assets")];
      
      if (canAllocate) {
        reqs.push(api.get("/api/employees"));
        reqs.push(api.get("/api/departments"));
      }

      const results = await Promise.allSettled(reqs);

      if (results[0].status === "fulfilled") {
        const allAssets = results[0].value.data.assets || [];
        setAllocatedAssets(allAssets.filter((a) => a.status === "Allocated"));
        setAvailableAssets(allAssets.filter((a) => a.status === "Available"));
      } else {
        toast.error("Failed to load assets.");
      }

      if (canAllocate) {
        if (results[1]?.status === "fulfilled") {
          setEmployees(results[1].value.data.employees || []);
        }
        if (results[2]?.status === "fulfilled") {
          setDepartments(results[2].value.data.departments || []);
        }
      }
    } catch (err) {
      toast.error("An error occurred loading allocation details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleOpenReturn = (asset) => {
    setSelectedAsset(asset);
    setCondition(asset.condition || "Good");
    setIsReturnOpen(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/assets/${selectedAsset._id}/return`, {
        conditionAtCheckIn,
      });
      toast.success("Asset returned to inventory.");
      setIsReturnOpen(false);
      fetchAllocations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log return.");
    }
  };

  const handleOpenAllocate = () => {
    setAllocateAssetId("");
    setAllocateType("user");
    setAllocateUser("");
    setAllocateDept("");
    setExpectedReturnDate("");
    setIsAllocateOpen(true);
  };

  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        assignedTo: allocateType === "user" ? allocateUser : null,
        department: allocateType === "department" ? allocateDept : null,
        expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate) : null,
      };

      await api.post(`/api/assets/${allocateAssetId}/allocate`, payload);
      toast.success("Asset allocated successfully!");
      setIsAllocateOpen(false);
      fetchAllocations();
    } catch (err) {
      if (err.response?.status === 409) {
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

  const filtered = allocatedAssets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.assetTag?.toLowerCase().includes(search.toLowerCase()) ||
    a.assignedTo?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Asset Allocation"
        subtitle="Manage and review all currently allocated company assets and return lifecycles"
        actions={
          canAllocate && (
            <button
              onClick={handleOpenAllocate}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <FiPlus className="h-4 w-4" />
              Allocate Asset
            </button>
          )
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search allocations by asset or user name..."
        className="max-w-sm"
      />

      <Table
        columns={columns(handleOpenReturn, canAllocate)}
        rows={filtered}
        loading={loading}
        emptyMessage="No active allocations found."
      />

      {/* Check-in Return Modal */}
      <Modal
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        title={`Return Asset / Check-in: ${selectedAsset?.name}`}
        footer={
          <>
            <button
              onClick={() => setIsReturnOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReturnSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Confirm Return
            </button>
          </>
        }
      >
        <form onSubmit={handleReturnSubmit} className="space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            Record check-in condition notes to release the asset back into inventory as <span className="font-semibold text-slate-700">Available</span>.
          </p>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Check-in Condition
            </label>
            <select
              value={conditionAtCheckIn}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            >
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Allocate Asset Modal */}
      <Modal
        isOpen={isAllocateOpen}
        onClose={() => setIsAllocateOpen(false)}
        title="Allocate Asset"
        footer={
          <>
            <button
              onClick={() => setIsAllocateOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAllocateSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Allocate
            </button>
          </>
        }
      >
        <form onSubmit={handleAllocateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Select Asset to Allocate *</label>
            <select
              value={allocateAssetId} required onChange={(e) => setAllocateAssetId(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            >
              <option value="">Choose an available asset...</option>
              {availableAssets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.name} ({asset.assetTag})
                </option>
              ))}
            </select>
            {availableAssets.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No assets are currently available for allocation.</p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer text-slate-700">
              <input
                type="radio" name="allocType" checked={allocateType === "user"} onChange={() => setAllocateType("user")}
                className="text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              Allocate to Employee
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer text-slate-700">
              <input
                type="radio" name="allocType" checked={allocateType === "department"} onChange={() => setAllocateType("department")}
                className="text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              Allocate to Department
            </label>
          </div>

          {allocateType === "user" ? (
            <div>
              <label className="block text-sm font-medium text-white mb-1">Select Employee *</label>
              <select
                value={allocateUser} required onChange={(e) => setAllocateUser(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              >
                <option value="">Choose employee...</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-white mb-1">Select Department *</label>
              <select
                value={allocateDept} required onChange={(e) => setAllocateDept(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
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
            <label className="block text-sm font-medium text-white mb-1">Expected Return Date</label>
            <input
              type="date" value={expectedReturnDate} onChange={(e) => setExpectedReturnDate(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Allocations;
