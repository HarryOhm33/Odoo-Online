// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
// 
// ── Guards ────────────────────────────────────────────────────────────────
import ProtectedAuth   from "./components/Protected/ProtectedAuth";
import AdminRoute      from "./components/Protected/AdminRoute";
import ProtectedRoute  from "./components/Protected/ProtectedRoute";

// ── Layouts ───────────────────────────────────────────────────────────────
import PublicLayout   from "./components/layout/PublicLayout";   // Navbar + Outlet
import AdminLayout    from "./components/layout/AdminLayout";
import EmployeeLayout from "./components/layout/EmployeeLayout";

// ── Public Pages ──────────────────────────────────────────────────────────

import Home from "./Pages/Home";

// ── Auth Pages ────────────────────────────────────────────────────────────
import Login          from "./pages/auth/Login";
import Signup         from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword  from "./pages/auth/ResetPassword";
import Verify         from "./Pages/Verify";

// ── Setup Pages ───────────────────────────────────────────────────────────
import Setup    from "./pages/setup/Setup";
import Activate from "./pages/setup/Activate";

// ── Error Pages ───────────────────────────────────────────────────────────
import NotFound  from "./pages/errors/NotFound";
import Forbidden from "./pages/errors/Forbidden";

// ── Admin Pages ───────────────────────────────────────────────────────────
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import Organization   from "./pages/admin/organization/Organization";
import Departments    from "./pages/admin/departments/Departments";
import Categories     from "./pages/admin/categories/Categories";
import Employees      from "./pages/admin/employees/Employees";
import Analytics      from "./pages/admin/analytics/Analytics";
import Settings       from "./pages/admin/settings/Settings";

// ── Employee Portal Pages ─────────────────────────────────────────────────
import EmployeeDashboard from "./pages/app/dashboard/EmployeeDashboard";
import Assets            from "./pages/app/assets/Assets";
import Allocations       from "./pages/app/allocations/Allocations";
import Bookings          from "./pages/app/bookings/Bookings";
import Maintenance       from "./pages/app/maintenance/Maintenance";
import Audits            from "./pages/app/audits/Audits";
import Reports           from "./pages/app/reports/Reports";
import Notifications     from "./pages/app/notifications/Notifications";
import Profile           from "./pages/app/profile/Profile";


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
              <Route path="/auth/login"           element={<Login />} />
              <Route path="/auth/signup"          element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            </Route>
          </Route>

          {/* ── Error pages ──────────────────────────────────────────────── */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="/404" element={<NotFound />} />

          {/* ── Admin Portal /admin/* ─────────────────────────────────────── */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard"    element={<AdminDashboard />} />
              <Route path="/admin/organization" element={<Organization />} />
              <Route path="/admin/departments"  element={<Departments />} />
              <Route path="/admin/categories"   element={<Categories />} />
              <Route path="/admin/employees"    element={<Employees />} />
              <Route path="/admin/analytics"    element={<Analytics />} />
              <Route path="/admin/settings"     element={<Settings />} />
            </Route>
          </Route>

          {/* ── Employee Portal /app/* ────────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<EmployeeLayout />}>
              <Route path="/app/dashboard"     element={<EmployeeDashboard />} />
              <Route path="/app/assets"        element={<Assets />} />
              <Route path="/app/allocations"   element={<Allocations />} />
              <Route path="/app/bookings"      element={<Bookings />} />
              <Route path="/app/maintenance"   element={<Maintenance />} />
              <Route path="/app/audits"        element={<Audits />} />
              <Route path="/app/reports"       element={<Reports />} />
              <Route path="/app/notifications" element={<Notifications />} />
              <Route path="/app/profile"       element={<Profile />} />
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
