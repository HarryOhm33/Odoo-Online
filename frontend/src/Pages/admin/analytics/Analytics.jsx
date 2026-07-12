// src/pages/admin/analytics/Analytics.jsx
import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import StatCard from "../../../components/common/StatCard";
import { FiBarChart2, FiUsers, FiBox, FiTrendingUp, FiTool, FiCalendar, FiActivity } from "react-icons/fi";
import api from "../../../services/api";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/analytics");
        setData(res.data.analytics);
      } catch (err) {
        console.error("Failed to load analytics data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const kpis = data?.kpis || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Organization-wide performance metrics, breakdowns, and asset utilization"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Assets"           value={loading ? "..." : (kpis.totalAssets ?? 0)} icon={FiBox}       color="blue"   />
        <StatCard title="Assets Allocated"       value={loading ? "..." : (kpis.allocatedAssets ?? 0)} icon={FiUsers}     color="green"  />
        <StatCard title="Maintenance This Month" value={loading ? "..." : (kpis.maintenanceThisMonth ?? 0)} icon={FiTool}      color="amber"  />
        <StatCard title="Active Bookings"        value={loading ? "..." : (kpis.activeBookings ?? 0)} icon={FiCalendar}  color="violet" />
        <StatCard title="Pending Approvals"      value={loading ? "..." : (kpis.pendingApprovals ?? 0)} icon={FiTrendingUp}color="red"    />
        <StatCard title="Asset Utilization"      value={loading ? "..." : `${kpis.assetUtilization ?? 0}%`} icon={FiBarChart2} color="slate"  />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          <div className="bg-white p-6 rounded-lg border border-slate-200 h-80" />
          <div className="bg-white p-6 rounded-lg border border-slate-200 h-80" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-slate-800 font-semibold text-base mb-4 flex items-center gap-2">
              <FiBox className="text-blue-500 h-5 w-5" />
              Category Breakdown
            </h3>
            <div className="flex-1 space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
                data.categoryBreakdown.map((cat) => {
                  const maxCount = Math.max(...data.categoryBreakdown.map((c) => c.count)) || 1;
                  const percentage = Math.round((cat.count / maxCount) * 100);
                  return (
                    <div key={cat.id || cat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700 font-medium">{cat.name}</span>
                        <span className="text-slate-500">{cat.count} asset{cat.count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-sm text-center py-12">No categories defined.</p>
              )}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-slate-800 font-semibold text-base mb-4 flex items-center gap-2">
              <FiActivity className="text-emerald-500 h-5 w-5" />
              Asset Status Distribution
            </h3>
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {data?.statusDistribution && data.statusDistribution.some((s) => s.count > 0) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.statusDistribution
                    .filter((s) => s.count > 0)
                    .map((item) => (
                      <div
                        key={item.status}
                        className="flex flex-col p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-xs text-slate-400 font-medium mb-1">{item.status}</span>
                        <span className="text-xl font-bold text-slate-800">{item.count}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm text-center py-12">No status details available.</p>
              )}
            </div>
          </div>

          {/* Department Allocation */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-slate-800 font-semibold text-base mb-4 flex items-center gap-2">
              <FiUsers className="text-violet-500 h-5 w-5" />
              Department Allocation
            </h3>
            <div className="flex-1 space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {data?.departmentBreakdown && data.departmentBreakdown.length > 0 ? (
                data.departmentBreakdown.map((dept) => {
                  const maxCount = Math.max(...data.departmentBreakdown.map((d) => d.count)) || 1;
                  const percentage = Math.round((dept.count / maxCount) * 100);
                  return (
                    <div key={dept.id || dept.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700 font-medium">{dept.name}</span>
                          {dept.code && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded">
                              {dept.code}
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500">{dept.count} asset{dept.count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-sm text-center py-12">No departments assigned to assets.</p>
              )}
            </div>
          </div>

          {/* Maintenance Status Breakdown */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-slate-800 font-semibold text-base mb-4 flex items-center gap-2">
              <FiTool className="text-amber-500 h-5 w-5" />
              Maintenance Requests Breakdown
            </h3>
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {data?.maintenanceDistribution && data.maintenanceDistribution.some((m) => m.count > 0) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.maintenanceDistribution
                    .filter((m) => m.count > 0)
                    .map((item) => (
                      <div
                        key={item.status}
                        className="flex flex-col p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-xs text-slate-400 font-medium mb-1">{item.status}</span>
                        <span className="text-xl font-bold text-slate-800">{item.count}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm text-center py-12">No maintenance requests created yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
