import { FiBox, FiRefreshCw, FiCalendar, FiTool, FiClipboard, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";
import StatCard from "../../../../components/common/StatCard";

const AssetManagerView = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <h3 className="text-slate-800 font-semibold text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/app/assets" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            <FiBox /> Register Asset
          </Link>
          <Link to="/app/allocations" className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
            <FiRefreshCw /> Allocate Asset
          </Link>
          <Link to="/app/audits" className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">
            <FiClipboard /> Create Audit
          </Link>
          <Link to="/app/reports" className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
            <FiFileText /> Generate Report
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assets Available" value="42" icon={FiBox} color="blue" />
        <StatCard title="Assets Allocated" value="128" icon={FiRefreshCw} color="indigo" />
        <StatCard title="Pending Returns" value="5" icon={FiCalendar} color="amber" />
        <StatCard title="Pending Maintenance" value="3" icon={FiTool} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Pending Transfers</h3>
          <p className="text-slate-500 text-sm">No pending transfers.</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Open Audit Cycles</h3>
          <p className="text-slate-500 text-sm">No open audit cycles.</p>
        </div>
      </div>
    </div>
  );
};

export default AssetManagerView;
