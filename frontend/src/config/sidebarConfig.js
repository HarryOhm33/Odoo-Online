// src/config/sidebarConfig.js
// Central role-based sidebar configuration.
// Each entry: { title, icon (component ref), route }
// Sidebar.jsx reads user.role and renders the matching array.

import {
  FiGrid,
  FiGlobe,
  FiUsers,
  FiTag,
  FiUser,
  FiBarChart2,
  FiSettings,
  FiBox,
  FiCalendar,
  FiTool,
  FiBell,
  FiRefreshCw,
  FiClipboard,
  FiFileText,
  FiPackage,
  FiCheckSquare,
} from "react-icons/fi";

const sidebarConfig = {
  // ── Admin Portal ──────────────────────────────────────────────────────────
  Admin: [
    { title: "Dashboard",        icon: FiGrid,        route: "/admin/dashboard"    },
    { title: "Organization",     icon: FiGlobe,       route: "/admin/organization" },
    { title: "Departments",      icon: FiUsers,       route: "/admin/departments"  },
    { title: "Asset Categories", icon: FiTag,         route: "/admin/categories"   },
    { title: "Employee Directory",icon: FiUser,       route: "/admin/employees"    },
    { title: "Analytics",        icon: FiBarChart2,   route: "/admin/analytics"    },
    { title: "Settings",         icon: FiSettings,    route: "/admin/settings"     },
  ],

  // ── Employee Portal ───────────────────────────────────────────────────────
  Employee: [
    { title: "Dashboard",           icon: FiGrid,     route: "/app/dashboard"     },
    { title: "Assets",              icon: FiBox,      route: "/app/assets"        },
    { title: "Bookings",            icon: FiCalendar, route: "/app/bookings"      },
    { title: "Maintenance Requests",icon: FiTool,     route: "/app/maintenance"   },
    { title: "Audit Cycles",        icon: FiClipboard,route: "/app/audits"        },
    { title: "Notifications",       icon: FiBell,     route: "/app/notifications" },
    { title: "Profile",             icon: FiUser,     route: "/app/profile"       },
  ],

  // ── Department Head Portal ────────────────────────────────────────────────
  DepartmentHead: [
    { title: "Dashboard",          icon: FiGrid,        route: "/app/dashboard"     },
    { title: "Assets",             icon: FiBox,         route: "/app/assets"        },
    { title: "Bookings",           icon: FiCalendar,    route: "/app/bookings"      },
    { title: "Transfer Requests",  icon: FiRefreshCw,   route: "/app/transfers"     },
    { title: "Audit Cycles",       icon: FiClipboard,   route: "/app/audits"        },
    { title: "Notifications",      icon: FiBell,        route: "/app/notifications" },
    { title: "Profile",            icon: FiUser,        route: "/app/profile"       },
  ],

  // ── Asset Manager Portal ──────────────────────────────────────────────────
  AssetManager: [
    { title: "Dashboard",        icon: FiGrid,      route: "/app/dashboard"     },
    { title: "Assets",           icon: FiBox,       route: "/app/assets"        },
    { title: "Asset Allocation", icon: FiRefreshCw, route: "/app/allocations"   },
    { title: "Transfers",        icon: FiRefreshCw, route: "/app/transfers"     },
    { title: "Transfer Approvals", icon: FiCheckSquare, route: "/app/transfers/approvals" },
    { title: "Bookings",         icon: FiCalendar,  route: "/app/bookings"      },
    { title: "Maintenance",      icon: FiTool,      route: "/app/maintenance"   },
    { title: "Audit Cycles",     icon: FiClipboard, route: "/app/audits"        },
    { title: "Reports",          icon: FiFileText,  route: "/app/reports"       },
    { title: "Notifications",    icon: FiBell,      route: "/app/notifications" },
    { title: "Profile",          icon: FiUser,      route: "/app/profile"       },
  ],
};

export default sidebarConfig;
