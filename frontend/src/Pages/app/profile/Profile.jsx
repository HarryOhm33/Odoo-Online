// src/pages/app/profile/Profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/common/Badge";
import Modal from "../../../components/common/Modal";
import api from "../../../services/api";
import { toast } from "react-toastify";
import {
  FiUser, FiMail, FiShield, FiCalendar, FiEdit2, FiKey, FiBriefcase
} from "react-icons/fi";

const roleColor = {
  Employee: "blue", DepartmentHead: "amber", AssetManager: "green", Admin: "violet",
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0">
    <Icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
    <span className="text-slate-400 text-sm w-32 flex-shrink-0">{label}</span>
    <span className="text-white text-sm font-medium truncate">{value || "—"}</span>
  </div>
);

const Profile = () => {
  const { user, refreshUser } = useAuth();
  
  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  
  // Edit Profile form state
  const [editName, setEditName] = useState("");
  
  // Change Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOpenEdit = () => {
    setEditName(user?.name || "");
    setIsEditOpen(true);
  };

  const handleOpenPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await api.put("/api/auth/profile", { name: editName });
      await refreshUser();
      toast.success("Profile updated successfully!");
      setIsEditOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    try {
      await api.put("/api/auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setIsPasswordOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Profile"
        subtitle="Your account information and settings"
        actions={
          <button 
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <FiEdit2 className="h-4 w-4" />
            Edit Profile
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Avatar card */}
        <div className="bg-[#0B172A] rounded-lg border border-white/10 shadow-sm p-6 flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-3xl">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">{user?.name}</h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
          <Badge label={user?.role} color={roleColor[user?.role] || "slate"} />
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-emerald-600 text-xs font-medium">
              {user?.status || "Active"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 bg-[#0B172A] rounded-lg border border-white/10 shadow-sm p-6">
          <h3 className="text-white font-semibold text-sm mb-1">Account Details</h3>
          <p className="text-slate-400 text-xs mb-4">Your personal information</p>

          <InfoRow icon={FiUser}     label="Full Name"    value={user?.name}   />
          <InfoRow icon={FiMail}     label="Email"        value={user?.email}  />
          <InfoRow icon={FiShield}   label="Role"         value={user?.role}   />
          <InfoRow
            icon={FiBriefcase}
            label="Organization"
            value={user?.organization?.name}
          />
          <InfoRow
            icon={FiCalendar}
            label="Member Since"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "—"
            }
          />

          <div className="mt-5 pt-4 border-t border-white/10">
            <button 
              onClick={handleOpenPassword}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
            >
              <FiKey className="h-4 w-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile"
        footer={
          <>
            <button
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              placeholder="Your full name"
            />
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <FiMail />
              Email addresses cannot be changed through this panel. Contact your administrator to update your email.
            </p>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        title="Change Password"
        footer={
          <>
            <button
              onClick={() => setIsPasswordOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Change Password
            </button>
          </>
        }
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
              placeholder="••••••••"
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
              placeholder="••••••••"
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
              placeholder="••••••••"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
