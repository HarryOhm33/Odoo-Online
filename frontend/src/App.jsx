// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
// 
// ── Guards ────────────────────────────────────────────────────────────────
import ProtectedAuth from "./components/Protected/ProtectedAuth";
import AdminRoute from "./components/Protected/AdminRoute";
import ProtectedRoute from "./components/Protected/ProtectedRoute";

// ── Layouts ───────────────────────────────────────────────────────────────
import PublicLayout from "./components/layout/PublicLayout";   // Navbar + Outlet
import AdminLayout from "./components/layout/AdminLayout";
import EmployeeLayout from "./components/layout/EmployeeLayout";

// ── Public Pages ──────────────────────────────────────────────────────────

import Home from "./Pages/Home";

// ── Auth Pages ────────────────────────────────────────────────────────────
import Login from "./Pages/auth/Login";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import ResetPassword from "./Pages/auth/ResetPassword";
import Verify from "./Pages/Verify";

// ── Setup Pages ───────────────────────────────────────────────────────────
import Setup from "./Pages/setup/Setup";
import Activate from "./Pages/setup/Activate";

// ── Error Pages ───────────────────────────────────────────────────────────
import NotFound from "./Pages/errors/NotFound";
import Forbidden from "./Pages/errors/Forbidden";

// ── Admin Pages ───────────────────────────────────────────────────────────
import AdminDashboard from "./Pages/admin/dashboard/AdminDashboard";
import Organization from "./Pages/admin/organization/Organization";
import Departments from "./Pages/admin/departments/Departments";
import Categories from "./Pages/admin/categories/Categories";
import Employees from "./Pages/admin/employees/Employees";
import Analytics from "./Pages/admin/analytics/Analytics";
import Settings from "./Pages/admin/settings/Settings";

// ── Employee Portal Pages ─────────────────────────────────────────────────
import EmployeeDashboard from "./Pages/app/dashboard/EmployeeDashboard";
import Assets from "./Pages/app/assets/Assets";
import Allocations from "./Pages/app/allocations/Allocations";
import Transfers from "./Pages/app/transfers/Transfers";
import Bookings from "./Pages/app/bookings/Bookings";
import Maintenance from "./Pages/app/maintenance/Maintenance";
import Audits from "./Pages/app/audits/Audits";

import DepartmentEmployees from "./Pages/app/employees/DepartmentEmployees";
import Notifications from "./Pages/app/notifications/Notifications";
import Profile from "./Pages/app/profile/Profile";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* ── Public pages — wrapped in PublicLayout (Navbar + page) ──── */}
          <Route element={<PublicLayout />}>
            {/* Home page */}
            <Route path="/" element={<Home />} />

            {/* Admin org initialization — "Admin Signup" */}
            <Route path="/setup" element={<Setup />} />

            {/* Employee account activation via email link */}
            <Route path="/auth/activate" element={<Activate />} />

            {/* Email verification */}
            <Route path="/auth/verify" element={<Verify />} />

            {/* Reset password */}
            <Route path="/auth/reset-password" element={<ResetPassword />} />

            {/* Auth-only pages (redirect away if already logged in) */}
            <Route element={<ProtectedAuth />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            </Route>
          </Route>

          {/* ── Error pages ──────────────────────────────────────────────── */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="/404" element={<NotFound />} />

          {/* ── Admin Portal /admin/* ─────────────────────────────────────── */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/organization" element={<Organization />} />
              <Route path="/admin/departments" element={<Departments />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/employees" element={<Employees />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* ── Employee Portal /app/* ────────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<EmployeeLayout />}>
              <Route path="/app/dashboard" element={<EmployeeDashboard />} />
              <Route path="/app/assets" element={<Assets />} />
              <Route path="/app/allocations" element={<Allocations />} />
              <Route path="/app/transfers" element={<Transfers />} />
              <Route path="/app/transfers/approvals" element={<Transfers />} />
              <Route path="/app/bookings" element={<Bookings />} />
              <Route path="/app/maintenance" element={<Maintenance />} />
              <Route path="/app/audits" element={<Audits />} />

              <Route path="/app/employees" element={<DepartmentEmployees />} />
              <Route path="/app/notifications" element={<Notifications />} />
              <Route path="/app/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* ── Catch-all 404 ─────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />

        </Routes>

      </AuthProvider>
    </Router>

  );
}

export default App;
