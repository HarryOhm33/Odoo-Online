// src/pages/admin/analytics/Analytics.jsx
import PageHeader from "../../../components/common/PageHeader";
import StatCard from "../../../components/common/StatCard";
import { FiBarChart2, FiUsers, FiBox, FiTrendingUp, FiTool, FiCalendar } from "react-icons/fi";
import EmptyState from "../../../components/common/EmptyState";

const Analytics = () => (
  <div className="space-y-5">
    <PageHeader
      title="Analytics"
      subtitle="Organization-wide performance metrics and reports"
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Total Assets"           value="—" icon={FiBox}       color="blue"   />
      <StatCard title="Assets Allocated"       value="—" icon={FiUsers}     color="green"  />
      <StatCard title="Maintenance This Month" value="—" icon={FiTool}      color="amber"  />
      <StatCard title="Active Bookings"        value="—" icon={FiCalendar}  color="violet" />
      <StatCard title="Pending Approvals"      value="—" icon={FiTrendingUp}color="red"    />
      <StatCard title="Asset Utilization"      value="—" icon={FiBarChart2} color="slate"  />
    </div>

    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <EmptyState
        message="Analytics charts will be available once asset data is populated."
        icon={FiBarChart2}
      />
    </div>
  </div>
);

export default Analytics;
