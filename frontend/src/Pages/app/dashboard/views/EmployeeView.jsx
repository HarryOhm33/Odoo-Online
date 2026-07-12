import { FiBox, FiCalendar, FiTool, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import StatCard from "../../../../components/common/StatCard";

const EmployeeView = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <h3 className="text-slate-800 font-semibold text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/app/maintenance" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            <FiTool /> Raise Maintenance Request
          </Link>
          <Link to="/app/bookings" className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
            <FiCalendar /> Request Resource
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Assets" value="3" icon={FiBox} color="blue" />
        <StatCard title="Upcoming Returns" value="1" icon={FiCalendar} color="amber" />
        <StatCard title="Current Bookings" value="0" icon={FiCalendar} color="green" />
        <StatCard title="Maintenance Requests" value="1" icon={FiTool} color="rose" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <h3 className="text-slate-800 font-semibold text-sm mb-4 flex items-center gap-2">
          <FiBell className="text-slate-400" /> Recent Notifications
        </h3>
        <div className="space-y-3">
          <p className="text-slate-500 text-sm">No recent notifications.</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
