// src/components/layout/EmployeeLayout.jsx
// Single layout for all employee portal roles.
// The sidebar dynamically renders items based on user.role from sidebarConfig.
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import PortalNavbar from "./PortalNavbar";

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar — renders role-specific items automatically */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content area */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-[68px]"
        }`}
      >
        {/* Top navbar */}
        <PortalNavbar onMobileMenuOpen={() => setMobileSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
