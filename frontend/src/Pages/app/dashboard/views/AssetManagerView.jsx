import { FiBox, FiRefreshCw, FiCalendar, FiTool, FiClipboard, FiFileText, FiUsers, FiCheckSquare, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import StatCard from "../../../../components/common/StatCard";

const iconMap = {
  FiBox, FiRefreshCw, FiCalendar, FiTool, FiClipboard, FiFileText, FiUsers, FiCheckSquare, FiBell
};

const AssetManagerView = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-[#0B172A] rounded-lg border border-white/10 shadow-sm p-5 hover:border-white/20 transition-colors">
        <h3 className="text-white font-semibold text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/app/assets" className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors">
            <FiBox /> Register Asset
          </Link>
          <Link to="/app/allocations" className="flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-300 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            <FiRefreshCw /> Allocate Asset
          </Link>
          <Link to="/app/audits" className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/20 transition-colors">
            <FiClipboard /> Create Audit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
          <h3 className="text-white font-semibold text-sm mb-4">Pending Transfers</h3>
          <p className="text-slate-400 text-sm">No pending transfers.</p>
        </div>
        <div className="bg-[#0B172A] rounded-lg border border-white/10 shadow-sm p-5 hover:border-white/20 transition-colors">
          <h3 className="text-white font-semibold text-sm mb-4">Open Audit Cycles</h3>
          <p className="text-slate-400 text-sm">No open audit cycles.</p>
        </div>
      </div>
    </div>
  );
};

export default AssetManagerView;
