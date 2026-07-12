import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import PageHeader from "../../../components/common/PageHeader";
import { FiGlobe, FiEdit2 } from "react-icons/fi";
import Badge from "../../../components/common/Badge";
import Modal from "../../../components/common/Modal";
import api from "../../../services/api";
import { toast } from "react-toastify";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className="text-slate-800 text-sm font-medium">{value || "—"}</span>
  </div>
);

const Organization = () => {
  const { user, refreshUser } = useAuth();
  const org = user?.organization;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    if (org) {
      setName(org.name || "");
      setIndustry(org.industry || "");
      setAddress(org.address || "");
      setEmail(org.email || "");
      setPhone(org.phone || "");
      setWebsite(org.website || "");
      setTimezone(org.timezone || "UTC");
    }
  }, [org]);

  const handleOpenEdit = () => {
    if (org) {
      setName(org.name || "");
      setIndustry(org.industry || "");
      setAddress(org.address || "");
      setEmail(org.email || "");
      setPhone(org.phone || "");
      setWebsite(org.website || "");
      setTimezone(org.timezone || "UTC");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Organization name is required.");
      return;
    }
    try {
      await api.put("/api/organization", {
        name,
        industry,
        address,
        email,
        phone,
        website,
        timezone,
      });
      toast.success("Organization details updated successfully!");
      setIsModalOpen(false);
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update organization details.");
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Organization"
        subtitle="View and manage your organization profile"
        actions={
          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <FiEdit2 className="h-4 w-4" />
            Edit Details
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Org card */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiGlobe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-slate-800 font-bold text-xl">
                {org?.name || "Your Organization"}
              </h2>
              <Badge label={org?.status || "Active"} color="green" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div className="divide-y divide-slate-100">
                <InfoRow label="Industry"   value={org?.industry}  />
                <InfoRow label="Email"      value={org?.email}     />
                <InfoRow label="Phone"      value={org?.phone}     />
            </div>
            <div className="divide-y divide-slate-100">
                <InfoRow label="Website"    value={org?.website}   />
                <InfoRow label="Timezone"   value={org?.timezone}  />
                <InfoRow
                  label="Created"
                  value={org?.createdAt ? new Date(org.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"}
                />
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
             <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Address</h4>
             <p className="text-sm text-slate-700 whitespace-pre-line">{org?.address || "—"}</p>
          </div>
        </div>

        {/* Admin info */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">System Administrator</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Organization Details"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Save
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Organization Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Technology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://www.company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 123 Main St, New York, NY"
              rows={3}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Organization;
