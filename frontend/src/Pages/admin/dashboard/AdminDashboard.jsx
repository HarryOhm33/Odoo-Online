// src/pages/admin/dashboard/AdminDashboard.jsx
import { useAuth } from "../../../contexts/AuthContext";
import StatCard from "../../../components/common/StatCard";
import PageHeader from "../../../components/common/PageHeader";
import { FiUsers, FiLayers, FiTag, FiCheckCircle, FiActivity, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const recentActivity = [
  { id: 1, action: "Employee added",      user: "Admin",     time: "Just now",    dot: "bg-blue-500"   },
  { id: 2, action: "Department created",  user: "Admin",     time: "2 hours ago", dot: "bg-green-500"  },
  { id: 3, action: "Category updated",    user: "Admin",     time: "Yesterday",   dot: "bg-amber-500"  },
  { id: 4, action: "Organization setup",  user: "System",    time: "Day 1",       dot: "bg-violet-500" },
];

const quickLinks = [
  { label: "Add Employee",      icon: FiUsers,  route: "/admin/employees",    color: "bg-blue-600"    },
  { label: "New Department",    icon: FiLayers, route: "/admin/departments",   color: "bg-emerald-600" },
  { label: "Asset Category",    icon: FiTag,    route: "/admin/categories",   color: "bg-amber-500"   },
  { label: "View Analytics",    icon: FiActivity,route:"/admin/analytics",    color: "bg-violet-600"  },
];

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-slate-800 font-semibold text-lg">
              Good morning, {user?.name?.split(" ")[0]}
            </h2>
            <p className="text-slate-500 text-sm">
              {user?.organization?.name} · Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <PageHeader
        title="Organization Overview"
        subtitle="Key metrics for your organization"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value="—"
          icon={FiUsers}
          color="blue"
          subtitle="Across all departments"
        />
        <StatCard
          title="Departments"
          value="—"
          icon={FiLayers}
          color="green"
          subtitle="Active departments"
        />
        <StatCard
          title="Asset Categories"
          value="—"
          icon={FiTag}
          color="amber"
          subtitle="Defined categories"
        />
        <StatCard
          title="System Status"
          value="Active"
          icon={FiCheckCircle}
          color="green"
          subtitle="All systems operational"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.route}
                  to={item.route}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                >
                  <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-slate-600 font-medium text-center leading-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800 font-semibold text-sm">Recent Activity</h3>
            <span className="text-xs text-slate-400">Last 7 days</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm truncate">{item.action}</p>
                  <p className="text-slate-400 text-xs">{item.user}</p>
                </div>
                <span className="text-slate-400 text-xs flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
