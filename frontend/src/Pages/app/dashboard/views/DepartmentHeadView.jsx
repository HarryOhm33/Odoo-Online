import { FiPackage, FiRefreshCw, FiCalendar, FiTool, FiCheckSquare } from "react-icons/fi";
import { Link } from "react-router-dom";
import StatCard from "../../../../components/common/StatCard";

const DepartmentHeadView = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <h3 className="text-slate-800 font-semibold text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/app/transfers/approvals" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            <FiCheckSquare /> Transfer Approvals
          </Link>
          <Link to="/app/bookings" className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
            <FiCalendar /> Department Bookings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Department Assets" value="15" icon={FiPackage} color="blue" />
        <StatCard title="Pending Transfers" value="2" icon={FiRefreshCw} color="amber" />
        <StatCard title="Active Bookings" value="3" icon={FiCalendar} color="green" />
        <StatCard title="Maintenance Requests" value="1" icon={FiTool} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Pending Transfers</h3>
          <p className="text-slate-500 text-sm">No pending transfers.</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Department Statistics</h3>
          <p className="text-slate-500 text-sm">Charts will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentHeadView;
