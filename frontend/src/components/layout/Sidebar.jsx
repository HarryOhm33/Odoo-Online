// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FiLogOut, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import sidebarConfig from "../../config/sidebarConfig";

const Sidebar = ({ isOpen, onToggle, isMobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth();
  const items = sidebarConfig[user?.role] || [];

  const roleBadgeColor = {
    Admin:         "bg-violet-500/20 text-violet-300",
    Employee:      "bg-blue-500/20 text-blue-300",
    DepartmentHead:"bg-amber-500/20 text-amber-300",
    AssetManager:  "bg-emerald-500/20 text-emerald-300",
  };

  const SidebarContent = ({ collapsed }) => (
    <div className="flex flex-col h-full">
      {/* ── Brand ── */}
      <div className={`flex items-center h-16 px-4 border-b border-white/10 flex-shrink-0 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-sm leading-tight tracking-wide">AssetERP</p>
            <p className="text-slate-400 text-xs truncate leading-tight mt-0.5">
              {user?.organization?.name || "Enterprise Portal"}
            </p>
          </div>
        )}
        {/* Desktop collapse toggle */}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="hidden lg:flex text-slate-400 hover:text-slate-300 transition-colors p-1 rounded"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            className="hidden lg:flex text-slate-400 hover:text-slate-300 transition-colors mt-0"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        )}
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden text-slate-400 hover:text-white p-1"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* ── Role badge ── */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/5 ${roleBadgeColor[user?.role] || "bg-slate-700 text-slate-300"}`}>
            {user?.role}
          </span>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="space-y-0.5 px-2">
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
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "text-white bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`
                }
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                {!collapsed && (
                  <span className="truncate">{item.title}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ── User section ── */}
      <div className="border-t border-white/10 p-3 flex-shrink-0 bg-black/10">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border border-white/10">
              <span className="text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-slate-400 hover:text-red-400 transition-colors p-1"
            >
              <FiLogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10">
              <span className="text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate leading-tight">
                {user?.name}
              </p>
              <p className="text-slate-400 text-xs truncate leading-tight mt-0.5">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 flex-shrink-0"
            >
              <FiLogOut className="h-4 w-4" />
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
          isOpen ? "w-64" : "w-[68px]"
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
          <aside className="relative w-64 bg-[#08111F] border-r border-white/10 flex flex-col h-full z-10 shadow-2xl">
            <SidebarContent collapsed={false} />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
