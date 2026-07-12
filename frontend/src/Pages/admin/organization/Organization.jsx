// src/pages/admin/organization/Organization.jsx
import { useAuth } from "../../../contexts/AuthContext";
import PageHeader from "../../../components/common/PageHeader";
import { FiGlobe, FiEdit2, FiMapPin, FiBriefcase, FiCalendar } from "react-icons/fi";
import Badge from "../../../components/common/Badge";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className="text-slate-800 text-sm font-medium">{value || "—"}</span>
  </div>
);

const Organization = () => {
  const { user } = useAuth();
  const org = user?.organization;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Organization"
        subtitle="View and manage your organization profile"
        actions={
          <button className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <FiEdit2 className="h-4 w-4" />
            Edit Details
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Org card */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiGlobe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-slate-800 font-bold text-xl">
                {org?.name || "Your Organization"}
              </h2>
              <Badge label={org?.status || "Active"} color="green" />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <InfoRow label="Industry"   value={org?.industry}  />
            <InfoRow label="Address"    value={org?.address}   />
            <InfoRow label="Status"     value={org?.status}    />
            <InfoRow
              label="Created"
              value={org?.createdAt ? new Date(org.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
            />
          </div>
        </div>

        {/* Admin info */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">System Administrator</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-slate-800 text-sm font-medium">{user?.name}</p>
              <p className="text-slate-500 text-xs">{user?.email}</p>
            </div>
          </div>
          <Badge label="Admin" color="violet" />
        </div>
      </div>
    </div>
  );
};

export default Organization;
