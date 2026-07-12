// src/pages/auth/ResetPassword.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiLock, FiArrowRight, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { resetPassword, loading } = useAuth();
  const location = useLocation();

  const query       = new URLSearchParams(location.search);
  const token       = query.get("token");
  const email       = query.get("email");

  const [newPassword, setNewPassword]   = useState("");
  const [confirm, setConfirm]           = useState("");
  const [showPass, setShowPass]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) { toast.error("Passwords do not match."); return; }
    if (newPassword.length < 6)  { toast.error("Password must be at least 6 characters."); return; }
    await resetPassword(token, email, newPassword);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-4">
            <FiLock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Set New Password</h1>
          <p className="text-gray-400 text-sm">for <span className="text-white">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type={showPass ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="New Password"
              className="pl-10 pr-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPass ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Confirm New Password"
              className="pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-60 text-sm"
          >
            {loading ? <FiLoader className="h-5 w-5 animate-spin" /> : <>Update Password <FiArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
