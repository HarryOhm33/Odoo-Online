// src/components/layout/PortalNavbar.jsx
// Top navigation bar inside admin and employee portals.
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiBell, FiChevronDown, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

// Map route segments to readable page titles
const getPageTitle = (pathname) => {
  const map = {
    "/admin/dashboard":    "Dashboard",
    "/admin/organization": "Organization",
    "/admin/departments":  "Departments",
    "/admin/categories":   "Asset Categories",
    "/admin/employees":    "Employee Directory",
    "/admin/analytics":    "Analytics",
    "/admin/settings":     "Settings",
    "/app/dashboard":      "Dashboard",
    "/app/assets":         "Assets",
    "/app/allocations":    "Asset Allocation",
    "/app/bookings":       "Resource Bookings",
    "/app/maintenance":    "Maintenance",
    "/app/audits":         "Audit Cycles",
    "/app/reports":        "Reports",
    "/app/notifications":  "Notifications",
    "/app/profile":        "Profile",
  };
  return map[pathname] || "Enterprise Asset Management";
};

const PortalNavbar = ({ onMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pageTitle = getPageTitle(location.pathname);

  const profileRoute = user?.role === "Admin" ? "/admin/settings" : "/app/profile";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 flex-shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <h1 className="text-slate-800 font-semibold text-base flex-1 truncate">
        {pageTitle}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications bell */}
        <button className="relative text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <FiBell className="h-5 w-5" />
          {/* Unread indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-slate-800 text-sm font-medium leading-tight">
                {user?.name}
              </p>
              <p className="text-slate-500 text-xs leading-tight">{user?.role}</p>
            </div>
            <FiChevronDown
              className={`h-4 w-4 text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
              {/* User info */}
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-slate-800 text-sm font-medium truncate">{user?.name}</p>
                <p className="text-slate-500 text-xs truncate">{user?.email}</p>
              </div>

              {/* Links */}
              <Link
                to={profileRoute}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FiUser className="h-4 w-4 text-slate-400" />
                Profile & Settings
              </Link>

              {/* Logout */}
              <button
                onClick={() => { setDropdownOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PortalNavbar;
