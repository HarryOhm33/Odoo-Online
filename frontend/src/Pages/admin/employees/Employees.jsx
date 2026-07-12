// src/pages/admin/employees/Employees.jsx
import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import EmployeeTable from "../../../components/features/employees/EmployeeTable";
import Modal from "../../../components/common/Modal";
import api from "../../../services/api";
import { FiPlus, FiMail, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const Employees = () => {
  const [employees, setEmployees]     = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp]   = useState(null);

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
    setRole(emp.role || "Employee");
    setDepartment(emp.department?._id || emp.department || "");
    setStatus(emp.status || "Active");
    setIsModalOpen(true);
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
        await api.put(`/api/employees/${editingEmp._id}`, {
          role,
          department: department || null,
          status,
        });
        toast.success("Employee updated successfully!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employee Directory"
        subtitle="Manage employees, promote/assign roles, and structure departments"
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <FiPlus className="h-4 w-4" />
            Add Employee
          </button>
        }
      />

      <div className="flex items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search employees by name or email..."
          className="w-full max-w-sm"
        />
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        loading={loading}
        onRowClick={handleOpenEdit}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isCreateMode ? "Add New Employee" : "Manage Employee Roles / Department"}
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Save
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {isCreateMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@organization.com"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role Promotion *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Employee">Employee (Operational)</option>
              <option value="DepartmentHead">Department Head</option>
              <option value="AssetManager">Asset Manager</option>
              <option value="Admin">System Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department Assignment
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No department assigned</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {!isCreateMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
