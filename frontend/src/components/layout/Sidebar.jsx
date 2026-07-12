// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight, X, Boxes } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import sidebarConfig from "../../config/sidebarConfig";

const Sidebar = ({ isOpen, onToggle, isMobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth();
  const items = sidebarConfig[user?.role] || [];

  const roleBadgeColor = {
    Admin:         "bg-violet-500/10 border-violet-500/20 text-violet-300",
    Employee:      "bg-blue-500/10 border-blue-500/20 text-blue-300",
    DepartmentHead:"bg-amber-500/10 border-amber-500/20 text-amber-300",
    AssetManager:  "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
  };

  const SidebarContent = ({ collapsed }) => (
    <div className="flex flex-col h-full">
      {/* ── Brand ── */}
      <div className={`flex items-center h-20 px-6 border-b border-white/10 flex-shrink-0 ${collapsed ? "justify-center px-0" : "gap-3"}`}>
        <div className={`flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(59,130,246,.35)] flex-shrink-0 ${collapsed ? "w-10 h-10" : "w-10 h-10"}`}>
          <Boxes size={22} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-white font-black text-[17px] leading-tight tracking-wide">AssetFlow</p>
            <p className="text-cyan-400 text-[10px] tracking-widest font-bold mt-0.5 uppercase">
              ERP PLATFORM
            </p>
          </div>
        )}
        {/* Desktop collapse toggle */}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="hidden lg:flex text-slate-400 hover:text-cyan-400 transition-colors p-1.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            className="hidden lg:flex text-slate-400 hover:text-cyan-400 transition-colors mt-0 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        )}
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden text-slate-400 hover:text-cyan-400 p-1 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Role badge ── */}
      {!collapsed && (
        <div className="px-6 py-4 border-b border-white/10">
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${roleBadgeColor[user?.role] || "bg-slate-700 text-slate-300"}`}>
            {user?.role}
          </span>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-1.5 px-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.route}
                to={item.route}
                end
                onClick={onMobileClose}
                title={collapsed ? item.title : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "text-white bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-cyan-400 border border-transparent"
                  } ${collapsed ? "justify-center" : ""}`
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="truncate tracking-wide">{item.title}</span>
                )}
                {/* Active indicator bar */}
                {({ isActive }) => isActive && !collapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ── User section ── */}
      <div className="border-t border-white/10 p-4 flex-shrink-0 bg-white/[0.02]">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
              <span className="text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-slate-400 hover:text-red-400 transition-colors p-1.5 cursor-pointer"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10 shadow-lg">
              <span className="text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-bold truncate leading-tight">
                {user?.name}
              </p>
              <p className="text-slate-400 text-xs truncate leading-tight mt-0.5 font-medium">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-red-500/10 flex-shrink-0 cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-[#08111F]/80 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 ${
          isOpen ? "w-[280px]" : "w-[88px]"
        }`}
      >
        <SidebarContent collapsed={!isOpen} />
      </aside>

      {/* ── Mobile Sidebar (drawer) ── */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="relative w-[280px] bg-[#08111F] border-r border-white/10 flex flex-col h-full z-10 shadow-2xl">
            <SidebarContent collapsed={false} />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
