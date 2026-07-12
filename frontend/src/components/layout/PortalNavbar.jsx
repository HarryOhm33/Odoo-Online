// src/components/layout/PortalNavbar.jsx
// Top navigation bar inside admin and employee portals.
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, ChevronDown, User, LogOut, Check } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";

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
    "/app/notifications":  "Notifications",
    "/app/profile":        "Profile",
  };
  return map[pathname] || "Enterprise Asset Management";
};

const PortalNavbar = ({ onMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/notifications");
        setNotifications(res.data.notifications || []);
      } catch (err) {
        // Silently fail for navbar notifications to not interrupt UX
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      await api.put("/api/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark notifications as read");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pageTitle = getPageTitle(location.pathname);
  const profileRoute = user?.role === "Admin" ? "/admin/settings" : "/app/profile";

  return (
    <header className="h-20 bg-[#08111F]/80 backdrop-blur-2xl border-b border-white/10 flex items-center px-6 gap-4 flex-shrink-0 z-10 sticky top-0 shadow-lg">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden text-slate-400 hover:text-cyan-400 p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="text-white font-bold text-xl flex-1 truncate tracking-tight">
        {pageTitle}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Notifications bell */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => { setNotificationsOpen(!notificationsOpen); setDropdownOpen(false); }}
            className="relative flex items-center justify-center w-10 h-10 text-slate-400 hover:text-cyan-400 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-[#0D1728]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 py-2 z-50 flex flex-col max-h-96 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">No recent notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={`px-5 py-4 border-b border-white/5 last:border-0 ${notif.isRead ? 'bg-transparent' : 'bg-cyan-500/5'}`}
                    >
                      <p className={`text-sm ${notif.isRead ? 'text-slate-400' : 'text-white font-medium'}`}>
                        {notif.message}
                      </p>
                      <span className="text-xs text-slate-500 mt-2 block">
                        {new Date(notif.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: '2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotificationsOpen(false); }}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,.3)]">
              <span className="text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="hidden sm:block text-left mr-1">
              <p className="text-white text-sm font-semibold leading-tight">
                {user?.name}
              </p>
              <p className="text-slate-400 text-xs leading-tight font-medium mt-0.5">{user?.role}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-[#0D1728]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 py-2 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                <p className="text-white font-semibold truncate">{user?.name}</p>
                <p className="text-slate-400 text-xs truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="p-2 space-y-1">
                <Link
                  to={profileRoute}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-cyan-400 transition-all"
                >
                  <User size={16} />
                  Profile & Settings
                </Link>
                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PortalNavbar;
