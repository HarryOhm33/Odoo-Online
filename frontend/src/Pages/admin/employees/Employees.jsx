import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import FilterBar from "../../../components/common/FilterBar";
import EmployeeTable from "../../../components/features/employees/EmployeeTable";
import Modal from "../../../components/common/Modal";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import Drawer from "../../../components/common/Drawer";
import api from "../../../services/api";
import { FiPlus, FiMail, FiUser, FiBriefcase, FiPhone, FiMapPin, FiCalendar, FiBox, FiTool } from "react-icons/fi";
import { toast } from "react-toastify";

const Employees = () => {
  const [employees, setEmployees]     = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  
  // Filtering & Search
  const [search, setSearch]           = useState("");
  const [roleFilter, setRoleFilter]   = useState("");
  const [deptFilter, setDeptFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp]   = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [empToDelete, setEmpToDelete] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Form State
  const [role, setRole]               = useState("Employee");
  const [department, setDepartment]   = useState("");
  const [status, setStatus]           = useState("Active");

  // Create Mode Form State
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [createName, setCreateName]     = useState("");
  const [createEmail, setCreateEmail]   = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([
        api.get("/api/employees"),
        api.get("/api/departments"),
      ]);
      setEmployees(empRes.data.employees || []);
      setDepartments(deptRes.data.departments || []);
    } catch (err) {
      toast.error("Failed to load employee list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setIsCreateMode(true);
    setEditingEmp(null);
    setCreateName("");
    setCreateEmail("");
    setRole("Employee");
    setDepartment("");
    setStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setIsCreateMode(false);
    setEditingEmp(emp);
    setCreateName(emp.name || "");
    setCreateEmail(emp.email || "");
    setRole(emp.role || "Employee");
    setDepartment(emp.department?._id || emp.department || "");
    setStatus(emp.status || "Active");
    setIsModalOpen(true);
  };

  const handleRowClick = (emp) => {
    setSelectedEmp(emp);
    setIsDrawerOpen(true);
  };

  const handleResendActivation = async (emp) => {
    try {
      await api.post(`/api/employees/${emp._id}/resend-activation`);
      toast.success("Activation email resent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend activation.");
    }
  };

  const handleToggleStatus = async (emp) => {
    try {
      const newStatus = emp.status === "Active" ? "Inactive" : "Active";
      await api.put(`/api/employees/${emp._id}`, { status: newStatus });
      toast.success(`Employee ${newStatus === "Active" ? "activated" : "deactivated"}!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change status.");
    }
  };

  const handleDeleteClick = (emp) => {
    setEmpToDelete(emp);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/employees/${empToDelete._id}`);
      toast.success("Employee deactivated successfully!");
      setIsDeleteModalOpen(false);
      setEmpToDelete(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deactivate employee.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isCreateMode) {
        if (!createName || !createEmail) {
          toast.error("Name and Email are required.");
          return;
        }
        await api.post("/api/employees", {
          name: createName,
          email: createEmail,
          role,
          department: department || null,
        });
        toast.success("Employee created! Activation link sent.");
      } else {
        if (!createName || !createEmail) {
          toast.error("Name and Email are required.");
          return;
        }
        await api.put(`/api/employees/${editingEmp._id}`, {
          name: createName,
          email: createEmail,
          role,
          department: department || null,
          status,
        });
        toast.success("Employee updated successfully!");
        if (selectedEmp && selectedEmp._id === editingEmp._id) {
            setIsDrawerOpen(false);
        }
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole   = roleFilter ? emp.role === roleFilter : true;
    const matchesDept   = deptFilter ? (emp.department?._id || emp.department) === deptFilter : true;
    const matchesStatus = statusFilter ? emp.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-5">
      <PageHeader
        title="Employee Directory"
        subtitle="Manage employees, promote/assign roles, and structure departments"
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <FiPlus className="h-4 w-4" />
            Add Employee
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search employees by name or email..."
          className="w-full lg:max-w-sm"
        />
        <FilterBar
          filters={[
            {
              label: "All Roles",
              value: roleFilter,
              onChange: setRoleFilter,
              options: [
                { label: "Admin", value: "Admin" },
                { label: "Department Head", value: "DepartmentHead" },
                { label: "Asset Manager", value: "AssetManager" },
                { label: "Employee", value: "Employee" },
              ]
            },
            {
              label: "All Departments",
              value: deptFilter,
              onChange: setDeptFilter,
              options: departments.map(d => ({ label: d.name, value: d._id }))
            },
            {
              label: "All Statuses",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" }
              ]
            }
          ]}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <EmployeeTable
          employees={filteredEmployees}
          loading={loading}
          onRowClick={handleRowClick}
          onEdit={handleOpenEdit}
          onResendActivation={handleResendActivation}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteClick}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isCreateMode ? "Add New Employee" : "Manage Employee Roles / Department"}
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Save
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Full Name *
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email Address *
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                placeholder="john@organization.com"
                disabled={!isCreateMode} // Usually shouldn't change email after creation easily
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Role Promotion *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              disabled={!isCreateMode && editingEmp?.role === "Admin"} // Prevent changing admin's role
            >
              <option className="bg-[#0B172A] text-white" value="Employee">Employee (Operational)</option>
              <option className="bg-[#0B172A] text-white" value="DepartmentHead">Department Head</option>
              <option className="bg-[#0B172A] text-white" value="AssetManager">Asset Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Department Assignment
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            >
              <option className="bg-[#0B172A] text-white" value="">No department assigned</option>
              {departments.map((dept) => (
                <option className="bg-[#0B172A] text-white" key={dept._id} value={dept._id}>
                  {dept.name} {dept.code ? `(${dept.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          {!isCreateMode && (
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                disabled={editingEmp?.role === "Admin"} // Prevent deactivating admin from here
              >
                <option className="bg-[#0B172A] text-white" value="Active">Active</option>
                <option className="bg-[#0B172A] text-white" value="Inactive">Inactive</option>
              </select>
            </div>
          )}
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Deactivate Employee"
        message={`Are you sure you want to deactivate ${empToDelete?.name}? They will lose access to the system.`}
        confirmText="Deactivate"
        danger={true}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Employee Profile"
      >
        {selectedEmp && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl border border-white/10 shadow-lg">
                {selectedEmp.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedEmp.name}</h3>
                <p className="text-slate-400">{selectedEmp.role}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${selectedEmp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedEmp.status}
                  </span>
                  {!selectedEmp.isVerified && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                      Pending Activation
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-3 shadow-lg">
              <h4 className="text-sm font-semibold text-white mb-2">Contact Information</h4>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <FiMail className="text-slate-400" />
                <a href={`mailto:${selectedEmp.email}`} className="hover:text-blue-400 transition-colors">{selectedEmp.email}</a>
              </div>
              {selectedEmp.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <FiPhone className="text-slate-400" />
                  <a href={`tel:${selectedEmp.phone}`} className="hover:text-blue-600 transition-colors">{selectedEmp.phone}</a>
                </div>
              )}
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-3 shadow-lg">
              <h4 className="text-sm font-semibold text-white mb-2">Organization Details</h4>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <FiBriefcase className="text-slate-400" />
                <span>{selectedEmp.department?.name || "No Department Assigned"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <FiCalendar className="text-slate-400" />
                <span>Joined {new Date(selectedEmp.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
              </div>
            </div>

          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Employees;
