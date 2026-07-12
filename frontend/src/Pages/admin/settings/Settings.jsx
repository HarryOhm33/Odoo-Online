import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import PageHeader from "../../../components/common/PageHeader";
import Modal from "../../../components/common/Modal";
import { FiUser, FiMail, FiShield, FiKey, FiBell } from "react-icons/fi";
import Badge from "../../../components/common/Badge";
import api from "../../../services/api";
import { toast } from "react-toastify";

const Section = ({ title, children }) => (
  <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-6">
    <h3 className="text-white font-semibold text-sm mb-4 border-b border-white/10 pb-3">{title}</h3>
    {children}
  </div>
);

const Settings = () => {
  const { user } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [appNotifs, setAppNotifs] = useState(true);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      await api.put("/api/auth/change-password", {
        currentPassword,
        newPassword
      });
      toast.success("Password changed successfully.");
      setIsPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="System configuration and account management"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile */}
        <Section title="Admin Profile">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-white/10">
              <span className="text-white font-bold text-xl">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <Badge label="Admin" color="violet" />
            </div>
          </div>
          <button className="w-full border border-white/10 hover:bg-white/5 text-slate-400 py-2 rounded-lg text-sm font-medium transition-colors cursor-not-allowed opacity-50" disabled>
            Edit Profile (Contact Superadmin)
          </button>
        </Section>

        {/* Security */}
        <Section title="Security">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <FiKey className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300 text-sm">Password</span>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 cursor-pointer"
              >
                Change
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <FiShield className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300 text-sm">Two-Factor Auth</span>
              </div>
              <Badge label="Not Enabled" color="amber" />
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notification Preferences">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <FiMail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300 text-sm">Email Notifications</span>
              </div>
              <button
                onClick={() => {
                  setEmailNotifs(!emailNotifs);
                  toast.success("Preferences saved.");
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${emailNotifs ? 'bg-blue-600' : 'bg-slate-600'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${emailNotifs ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <FiBell className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300 text-sm">In-App Notifications</span>
              </div>
              <button
                onClick={() => {
                  setAppNotifs(!appNotifs);
                  toast.success("Preferences saved.");
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${appNotifs ? 'bg-blue-600' : 'bg-slate-600'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${appNotifs ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </Section>
      </div>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        footer={
          <>
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Update Password
            </button>
          </>
        }
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              New Password *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;
