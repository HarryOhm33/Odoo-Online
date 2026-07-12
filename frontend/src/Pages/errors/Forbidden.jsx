// src/pages/errors/Forbidden.jsx
import { Link } from "react-router-dom";
import { FiShield, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const Forbidden = () => {
  const { user } = useAuth();
  const dashboardRoute = user?.role === "Admin" ? "/admin/dashboard" : "/app/dashboard";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiShield className="h-9 w-9 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">403</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">Access Forbidden</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          You don't have permission to view this page. If you believe this is a
          mistake, please contact your system administrator.
        </p>
        <Link
          to={user ? dashboardRoute : "/auth/login"}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" />
          {user ? "Back to Dashboard" : "Go to Login"}
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
