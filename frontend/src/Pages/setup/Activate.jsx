// src/pages/setup/Activate.jsx
// Employee account activation page.
// Employee clicks email link → lands here → sets password → can login.
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  FiLock, FiCheckCircle, FiXCircle, FiEye, FiEyeOff, FiArrowRight, FiLoader
} from "react-icons/fi";

const Activate = () => {
  const { activateAccount, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirm]     = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [status, setStatus]               = useState("idle"); // idle | success | error

  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const email = query.get("email");

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid activation link.");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await activateAccount(token, password);
      if (res.data.success) {
        setStatus("success");
        toast.success("Account activated! Redirecting to login...");
        setTimeout(() => navigate("/auth/login"), 2500);
      }
    } catch (err) {
      setStatus("error");
      toast.error(err.response?.data?.message || "Activation failed.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
            <FiCheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Account Activated!</h2>
          <p className="text-gray-400 text-sm mb-4">
            Your account is ready. Redirecting to login...
          </p>
          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4">
            <FiLock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Activate Your Account</h1>
          <p className="text-gray-400 text-sm">
            Set a password for <span className="text-white font-medium">{email || "your account"}</span>
          </p>
        </div>

        {(!token || !email) ? (
          <div className="text-center">
            <FiXCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 text-sm mb-4">Invalid or expired activation link.</p>
            <p className="text-gray-500 text-xs">
              Please contact your administrator for a new activation email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="New Password"
                className="pl-10 pr-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Confirm Password"
                className="pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-60 text-sm mt-2"
            >
              {loading ? (
                <FiLoader className="h-5 w-5 animate-spin" />
              ) : (
                <>Activate Account <FiArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 text-xs mt-6">
          Already activated?{" "}
          <Link to="/auth/login" className="text-blue-400 hover:text-blue-300">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Activate;
