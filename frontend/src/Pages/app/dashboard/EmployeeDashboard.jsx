// src/pages/app/dashboard/EmployeeDashboard.jsx
// Single dashboard page with role-aware KPI cards and widgets.
import { useAuth } from "../../../contexts/AuthContext";
import StatCard from "../../../components/common/StatCard";
import PageHeader from "../../../components/common/PageHeader";
import {
  FiBox, FiCalendar, FiTool, FiBell, FiUsers,
  FiRefreshCw, FiClipboard, FiCheckSquare, FiAlertCircle
} from "react-icons/fi";
import Badge from "../../../components/common/Badge";

// ── Per-role KPI card config ───────────────────────────────────────────────
const kpiConfig = {
  Employee: [
    { title: "My Assets",          value: "—", icon: FiBox,       color: "blue"   },
    { title: "Active Bookings",    value: "—", icon: FiCalendar,  color: "green"  },
    { title: "Pending Maintenance",value: "—", icon: FiTool,      color: "amber"  },
    { title: "Notifications",      value: "—", icon: FiBell,      color: "slate"  },
  ],
  DepartmentHead: [
    { title: "Department Assets",  value: "—", icon: FiUsers,     color: "blue"   },
    { title: "Pending Transfers",  value: "—", icon: FiRefreshCw, color: "amber"  },
    { title: "Active Bookings",    value: "—", icon: FiCalendar,  color: "green"  },
    { title: "Notifications",      value: "—", icon: FiBell,      color: "slate"  },
  ],
  AssetManager: [
    { title: "Available Assets",   value: "—", icon: FiBox,       color: "green"  },
    { title: "Assets Allocated",   value: "—", icon: FiUsers,     color: "blue"   },
    { title: "Maintenance Today",  value: "—", icon: FiTool,      color: "amber"  },
    { title: "Pending Approvals",  value: "—", icon: FiCheckSquare,color: "red"   },
    { title: "Active Audit Cycles",value: "—", icon: FiClipboard, color: "violet" },
  ],
};

const roleWelcome = {
  Employee:       "Here's a summary of your assigned assets and activities.",
  DepartmentHead: "Manage your department's assets, bookings, and transfer requests.",
  AssetManager:   "Monitor asset inventory, allocations, maintenance, and audits.",
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const role  = user?.role || "Employee";
  const kpis  = kpiConfig[role] || kpiConfig.Employee;

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-slate-800 font-semibold text-lg">
                Welcome back, {user?.name?.split(" ")[0]}
              </h2>
              <p className="text-slate-500 text-sm">
                {roleWelcome[role]}
              </p>
            </div>
          </div>
          <Badge
            label={role}
            color={
              role === "AssetManager" ? "green"
              : role === "DepartmentHead" ? "amber"
              : "blue"
            }
          />
        </div>
      </div>

      {/* KPI cards */}
      <PageHeader
        title="My Overview"
        subtitle={`${role} dashboard — organization-scoped data`}
      />
      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${kpis.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
        {kpis.map((kpi) => (
          <StatCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                <div className="h-3 bg-slate-100 rounded flex-1 animate-pulse" />
              </div>
            ))}
            <p className="text-slate-400 text-xs text-center pt-2">
              Notifications will appear here once the system is connected.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Upcoming Bookings</h3>
          <div className="flex flex-col items-center justify-center py-6">
            <FiCalendar className="h-8 w-8 text-slate-200 mb-2" />
            <p className="text-slate-400 text-sm">No upcoming bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
