// src/config/sidebarConfig.js
// Central role-based sidebar configuration.
// Each entry: { title, icon (component ref), route }
// Sidebar.jsx reads user.role and renders the matching array.

import {
  LayoutDashboard,
  Globe,
  Users,
  Tag,
  User,
  BarChart2,
  Settings,
  Package,
  CalendarDays,
  Wrench,
  Bell,
  RefreshCw,
  ClipboardList,
  FileText,
  Box,
  CheckSquare,
} from "lucide-react";

const sidebarConfig = {
  // ── Admin Portal ──────────────────────────────────────────────────────────
  Admin: [
    { title: "Dashboard",        icon: LayoutDashboard, route: "/admin/dashboard"    },
    { title: "Organization",     icon: Globe,           route: "/admin/organization" },
    { title: "Departments",      icon: Users,           route: "/admin/departments"  },
    { title: "Asset Categories", icon: Tag,             route: "/admin/categories"   },
    { title: "Employee Directory",icon: User,           route: "/admin/employees"    },
    { title: "Analytics",        icon: BarChart2,       route: "/admin/analytics"    },
    { title: "Settings",         icon: Settings,        route: "/admin/settings"     },
  ],

  // ── Employee Portal ───────────────────────────────────────────────────────
  Employee: [
    { title: "Dashboard",           icon: LayoutDashboard, route: "/app/dashboard"     },
    { title: "Assets",              icon: Package,         route: "/app/assets"        },
    { title: "Bookings",            icon: CalendarDays,    route: "/app/bookings"      },
    { title: "Maintenance Requests",icon: Wrench,          route: "/app/maintenance"   },
    { title: "Audit Cycles",        icon: ClipboardList,   route: "/app/audits"        },
    { title: "Notifications",       icon: Bell,            route: "/app/notifications" },
    { title: "Profile",             icon: User,            route: "/app/profile"       },
  ],

  // ── Department Head Portal ────────────────────────────────────────────────
  DepartmentHead: [
    { title: "Dashboard",          icon: LayoutDashboard, route: "/app/dashboard"     },
    { title: "Employees",          icon: Users,           route: "/app/employees"     },
    { title: "Assets",             icon: Package,         route: "/app/assets"        },
    { title: "Bookings",           icon: CalendarDays,    route: "/app/bookings"      },
    { title: "Transfer Requests",  icon: RefreshCw,       route: "/app/transfers"     },
    { title: "Audit Cycles",       icon: ClipboardList,   route: "/app/audits"        },
    { title: "Notifications",      icon: Bell,            route: "/app/notifications" },
    { title: "Profile",            icon: User,            route: "/app/profile"       },
  ],

  // ── Asset Manager Portal ──────────────────────────────────────────────────
  AssetManager: [
    { title: "Dashboard",        icon: LayoutDashboard, route: "/app/dashboard"     },
    { title: "Assets",           icon: Package,         route: "/app/assets"        },
    { title: "Asset Allocation", icon: RefreshCw,       route: "/app/allocations"   },
    { title: "Transfers",        icon: RefreshCw,       route: "/app/transfers"     },
    { title: "Transfer Approvals", icon: CheckSquare,   route: "/app/transfers/approvals" },
    { title: "Bookings",         icon: CalendarDays,    route: "/app/bookings"      },
    { title: "Maintenance",      icon: Wrench,          route: "/app/maintenance"   },
    { title: "Audit Cycles",     icon: ClipboardList,   route: "/app/audits"        },
    { title: "Notifications",    icon: Bell,            route: "/app/notifications" },
    { title: "Profile",          icon: User,            route: "/app/profile"       },
  ],
};

export default sidebarConfig;
