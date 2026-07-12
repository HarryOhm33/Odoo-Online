// src/pages/setup/Setup.jsx
// One-time organization + admin setup page.
// Only accessible when no org exists. POST /api/auth/setup
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiGlobe, FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

const Setup = () => {
  const { setupOrganization, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    orgName:     "",
    orgIndustry: "",
    orgAddress:  "",
    name:        "",
    email:       "",
    password:    "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setupOrganization(form);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-4">
            <FiGlobe className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Organization Setup</h1>
          <p className="text-gray-400 text-sm">
            Create your organization and admin account to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization section */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Organization Details
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  name="orgName"
                  value={form.orgName}
                  onChange={handleChange}
                  required
                  placeholder="Organization Name *"
                  className="pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <input
                name="orgIndustry"
                value={form.orgIndustry}
                onChange={handleChange}
                placeholder="Industry (optional)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                name="orgAddress"
                value={form.orgAddress}
                onChange={handleChange}
                placeholder="Address (optional)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Admin section */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Admin Account
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name *"
                  className="pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Admin Email *"
                  className="pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Password *"
                  className="pl-10 pr-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-60 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Initialize System <FiArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Already set up?{" "}
          <Link to="/auth/login" className="text-blue-400 hover:text-blue-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Setup;
