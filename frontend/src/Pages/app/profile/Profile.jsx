// src/pages/app/profile/Profile.jsx
import { useAuth } from "../../../contexts/AuthContext";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/common/Badge";
import {
  FiUser, FiMail, FiShield, FiCalendar, FiEdit2, FiKey, FiBriefcase
} from "react-icons/fi";

const roleColor = {
  Employee: "blue", DepartmentHead: "amber", AssetManager: "green", Admin: "violet",
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
    <Icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
    <span className="text-slate-500 text-sm w-32 flex-shrink-0">{label}</span>
    <span className="text-slate-800 text-sm font-medium truncate">{value || "—"}</span>
  </div>
);

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Profile"
        subtitle="Your account information and settings"
        actions={
          <button className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <FiEdit2 className="h-4 w-4" />
            Edit Profile
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Avatar card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-3xl">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-slate-800 font-bold text-lg">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
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
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h3 className="text-slate-800 font-semibold text-sm mb-1">Account Details</h3>
          <p className="text-slate-500 text-xs mb-4">Your personal information</p>

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
                ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
                : "—"
            }
          />

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              <FiKey className="h-4 w-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
