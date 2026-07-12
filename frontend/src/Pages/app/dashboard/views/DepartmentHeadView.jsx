import { FiPackage, FiRefreshCw, FiCalendar, FiTool, FiCheckSquare, FiUsers, FiBox, FiBell, FiClipboard } from "react-icons/fi";
import { Link } from "react-router-dom";
import StatCard from "../../../../components/common/StatCard";

const iconMap = {
  FiPackage, FiRefreshCw, FiCalendar, FiTool, FiCheckSquare, FiUsers, FiBox, FiBell, FiClipboard
};

const DepartmentHeadView = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-[#0B172A] rounded-lg border border-white/10 shadow-sm p-5 hover:border-white/20 transition-colors">
        <h3 className="text-white font-semibold text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/app/transfers" className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors">
            <FiRefreshCw /> Transfer Requests
          </Link>
          <Link to="/app/bookings" className="flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-300 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            <FiCalendar /> Department Bookings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.kpis?.map((kpi, index) => (
          <StatCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={iconMap[kpi.icon] || FiBox}
            color={kpi.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0B172A] rounded-lg border border-white/10 shadow-sm p-5 hover:border-white/20 transition-colors">
          <h3 className="text-white font-semibold text-sm mb-4">Department Employees</h3>
          {stats?.deptEmployees?.length > 0 ? (
            <div className="space-y-3">
              {stats.deptEmployees.map((emp) => (
                <div key={emp._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {emp.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{emp.name}</p>
                      <p className="text-xs text-slate-400">{emp.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${emp.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {emp.status}
                  </span>
                </div>
              ))}
              <Link to="/app/employees" className="block text-center text-sm text-blue-400 hover:text-blue-300 mt-2">
                View All Details
              </Link>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No employees found in this department.</p>
          )}
        </div>
        <div className="bg-[#0B172A] rounded-lg border border-white/10 shadow-sm p-5 hover:border-white/20 transition-colors">
          <h3 className="text-white font-semibold text-sm mb-4">Pending Transfers</h3>
          <p className="text-slate-400 text-sm">Transfer details and quick actions will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentHeadView;
