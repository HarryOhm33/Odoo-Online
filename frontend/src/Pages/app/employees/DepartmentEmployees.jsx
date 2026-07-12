import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import EmployeeTable from "../../../components/features/employees/EmployeeTable";
import Drawer from "../../../components/common/Drawer";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { FiMail, FiUser, FiBriefcase, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";

const DepartmentEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/employees");
      setEmployees(res.data.employees || []);
    } catch (err) {
      toast.error("Failed to load employee list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = (emp) => {
    setSelectedEmp(emp);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Employees"
        subtitle="View the list of employees in your department and their details."
      />

      <EmployeeTable
        employees={employees}
        loading={loading}
        onRowClick={handleRowClick}
      />

      {/* View Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Employee Details"
      >
        {selectedEmp && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {selectedEmp.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedEmp.name}</h3>
                <p className="text-sm text-slate-400">{selectedEmp.role}</p>
                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedEmp.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  {selectedEmp.status}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Department</p>
                <p className="text-sm font-medium text-white">{selectedEmp.department?.name || "None"}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Account</p>
                <p className="text-sm font-medium text-white">{selectedEmp.isVerified ? "Activated" : "Pending"}</p>
              </div>
            </div>

            <hr className="border-white/10" />

            {/* Contact & Professional Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Contact Information
              </h4>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Email Address</p>
                  <p className="text-sm font-medium text-white">{selectedEmp.email}</p>
                </div>
              </div>

              {selectedEmp.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Phone Number</p>
                    <p className="text-sm font-medium text-white">{selectedEmp.phone}</p>
                  </div>
                </div>
              )}

              {selectedEmp.location && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Location</p>
                    <p className="text-sm font-medium text-white">{selectedEmp.location}</p>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-white/10" />

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                System Information
              </h4>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Joined Date</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(selectedEmp.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DepartmentEmployees;
