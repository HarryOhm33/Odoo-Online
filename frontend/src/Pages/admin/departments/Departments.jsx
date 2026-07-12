import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import FilterBar from "../../../components/common/FilterBar";
import DepartmentTable from "../../../components/features/departments/DepartmentTable";
import Modal from "../../../components/common/Modal";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import api from "../../../services/api";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

  // Form State
  const [name, setName]                         = useState("");
  const [code, setCode]                         = useState("");
  const [head, setHead]                         = useState("");
  const [parentDepartment, setParentDepartment] = useState("");
  const [status, setStatus]                     = useState("Active");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptRes, empRes] = await Promise.all([
        api.get("/api/departments"),
        api.get("/api/employees"),
      ]);
      setDepartments(deptRes.data.departments || []);
      setEmployees(empRes.data.employees || []);
    } catch (err) {
      toast.error("Failed to load department data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setName("");
    setCode("");
    setHead("");
    setParentDepartment("");
    setStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setName(dept.name || "");
    setCode(dept.code || "");
    setHead(dept.head?._id || dept.head || "");
    setParentDepartment(dept.parentDepartment?._id || dept.parentDepartment || "");
    setStatus(dept.status || "Active");
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (dept) => {
    try {
      const newStatus = dept.status === "Active" ? "Inactive" : "Active";
      await api.put(`/api/departments/${dept._id}`, { status: newStatus });
      toast.success(`Department ${newStatus === "Active" ? "activated" : "deactivated"}!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change status.");
    }
  };

  const handleDeleteClick = (dept) => {
    setDeptToDelete(dept);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/departments/${deptToDelete._id}`);
      toast.success("Department deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeptToDelete(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete department.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        code,
        head: head || null,
        parentDepartment: parentDepartment || null,
        status,
      };

      if (editingDept) {
        await api.put(`/api/departments/${editingDept._id}`, payload);
        toast.success("Department updated successfully!");
      } else {
        await api.post("/api/departments", payload);
        toast.success("Department created successfully!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    }
  };

  const filteredDepts = departments.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || (d.code && d.code.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter ? d.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Departments"
        subtitle="Manage organizational departments, hierarchy, and heads"
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <FiPlus className="h-4 w-4" />
            New Department
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search departments..."
          className="w-full sm:max-w-sm"
        />
        <FilterBar
          filters={[
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

      <DepartmentTable
        departments={filteredDepts}
        loading={loading}
        onRowClick={handleOpenEdit}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteClick}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? "Edit Department" : "New Department"}
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
              Department Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              placeholder="e.g. Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Department Code *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              placeholder="e.g. ENG"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Department Head
            </label>
            <select
              value={head}
              onChange={(e) => setHead(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            >
              <option className="bg-[#0B172A] text-white" value="">No head assigned</option>
              {employees.map((emp) => (
                <option className="bg-[#0B172A] text-white" key={emp._id} value={emp._id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Parent Department (Hierarchy)
            </label>
            <select
              value={parentDepartment}
              onChange={(e) => setParentDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            >
              <option className="bg-[#0B172A] text-white" value="">None</option>
              {departments
                .filter((d) => !editingDept || d._id !== editingDept._id)
                .map((d) => (
                  <option className="bg-[#0B172A] text-white" key={d._id} value={d._id}>
                    {d.name} {d.code ? `(${d.code})` : ""}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            >
              <option className="bg-[#0B172A] text-white" value="Active">Active</option>
              <option className="bg-[#0B172A] text-white" value="Inactive">Inactive (Deactivated)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        message={`Are you sure you want to delete ${deptToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
};

export default Departments;
