// src/pages/admin/settings/Settings.jsx
import { useAuth } from "../../../contexts/AuthContext";
import PageHeader from "../../../components/common/PageHeader";
import { FiUser, FiMail, FiShield, FiKey } from "react-icons/fi";
import Badge from "../../../components/common/Badge";

const Section = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
    <h3 className="text-slate-800 font-semibold text-sm mb-4 border-b border-slate-100 pb-3">{title}</h3>
    {children}
  </div>
);

const Settings = () => {
  const { user } = useAuth();

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
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-slate-800 font-semibold">{user?.name}</p>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <Badge label="Admin" color="violet" />
            </div>
          </div>
          <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors">
            Edit Profile
          </button>
        </Section>

        {/* Security */}
        <Section title="Security">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FiKey className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700 text-sm">Password</span>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Change</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FiShield className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700 text-sm">Two-Factor Auth</span>
              </div>
              <Badge label="Not Enabled" color="amber" />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Settings;
