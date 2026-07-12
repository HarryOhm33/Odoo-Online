import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import AuditTable from "../../../components/features/audits/AuditTable";
import Modal from "../../../components/common/Modal";
import Table from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";
import api from "../../../services/api";
import { FiPlus, FiCheckSquare, FiXOctagon, FiAlertCircle, FiClipboard } from "react-icons/fi";
import { toast } from "react-toastify";
import usePermissions from "../../../hooks/usePermissions";
import { useAuth } from "../../../contexts/AuthContext";

const auditedAssetColumns = (onVerify, isClosed, canManage, user, auditAuditors = []) => [
  { key: "asset", label: "Asset Tag", render: (v) => v?.assetTag || "—" },
  { key: "assetName", label: "Asset Name", render: (_, row) => row.asset?.name || "—" },
  {
    key: "status",
    label: "Verification Status",
    render: (v) => <Badge label={v} color={v === "Verified" ? "green" : v === "Missing" ? "red" : v === "Damaged" ? "amber" : "slate"} />,
  },
  { key: "notes", label: "Notes", render: (v) => v || "—" },
  {
    key: "actions",
    label: "Verify Action",
    render: (_, row) => {
      const canVerifyAsset = !isClosed && (canManage || auditAuditors.includes(user?.id) || row.asset?.assignedTo === user?.id);
      return canVerifyAsset ? (
        <div className="flex gap-1.5">
        <button
          onClick={() => onVerify(row.asset?._id, "Verified")}
          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded text-xs font-semibold cursor-pointer"
        >
          Verify
        </button>
        <button
          onClick={() => onVerify(row.asset?._id, "Missing")}
          className="bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1 rounded text-xs font-semibold cursor-pointer"
        >
          Missing
        </button>
        <button
          onClick={() => onVerify(row.asset?._id, "Damaged")}
          className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-1 rounded text-xs font-semibold cursor-pointer"
        >
          Damaged
        </button>
      </div>
    ) : (isClosed ? "Audit Locked" : "—");
    }
  },
];

const Audits = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [audits, setAudits]           = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");

  // Create Audit Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle]                         = useState("");
  const [scopeDepartment, setScopeDepartment]     = useState("");
  const [scopeLocation, setScopeLocation]         = useState("");
  const [startDate, setStartDate]                 = useState("");
  const [endDate, setEndDate]                     = useState("");
  const [auditors, setAuditors]                   = useState([]);

  // Audit Checklist Modal
  const [isChecklistOpen, setIsChecklistOpen]     = useState(false);
  const [selectedAudit, setSelectedAudit]         = useState(null);

  const canCreate = can("audit:create");
  const canManage = can("audit:manage");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [auditRes, deptRes, empRes] = await Promise.all([
        api.get("/api/audits"),
        api.get("/api/departments"),
        api.get("/api/employees"),
      ]);
      setAudits(auditRes.data.audits || []);
      setDepartments(deptRes.data.departments || []);
      setEmployees(empRes.data.employees || []);
    } catch (err) {
      toast.error("Failed to load audit cycles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setTitle("");
    setScopeDepartment("");
    setScopeLocation("");
    setStartDate("");
    setEndDate("");
    setAuditors([]);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/audits", {
        title,
        scopeDepartment: scopeDepartment || null,
        scopeLocation: scopeLocation || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        auditors,
      });
      toast.success("Audit cycle created successfully!");
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create audit cycle.");
    }
  };

  const handleAuditorSelect = (empId) => {
    setAuditors((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const handleOpenChecklist = (audit) => {
    setSelectedAudit(audit);
    setIsChecklistOpen(true);
  };

  const handleVerifyAsset = async (assetId, status) => {
    try {
      const notes = prompt("Enter verification notes (optional):") || "";
      const res = await api.put(`/api/audits/${selectedAudit._id}/asset/${assetId}`, {
        status,
        notes,
      });
      toast.success("Asset status logged.");
      // Refresh current modal audit state
      setSelectedAudit(res.data.audit);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verify action failed.");
    }
  };

  const handleCloseAudit = async () => {
    if (!window.confirm("Close this audit? This will lock the audit cycle and automatically mark missing assets as 'Lost' in the inventory.")) return;
    try {
      await api.post(`/api/audits/${selectedAudit._id}/close`);
      toast.success("Audit cycle successfully closed.");
      setIsChecklistOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Close action failed.");
    }
  };

  const filteredAudits = audits.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit Cycles"
        subtitle="Schedule and execute periodic verification cycles to detect inventory discrepancies"
        actions={
          canCreate && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <FiPlus className="h-4 w-4" />
              New Audit
            </button>
          )
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search audits..."
        className="max-w-sm"
      />

      <AuditTable audits={filteredAudits} loading={loading} onActionClick={handleOpenChecklist} />

      {/* MODAL 1: Create Audit Cycle */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule Audit Cycle"
        footer={
          <>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Create Cycle
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Audit Title *
            </label>
            <input
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Q3 HQ Tech Audit"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department Scope
              </label>
              <select
                value={scopeDepartment} onChange={(e) => setScopeDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} {d.code ? `(${d.code})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location Scope
              </label>
              <input
                type="text" value={scopeLocation} onChange={(e) => setScopeLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. HQ Block A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Date *
              </label>
              <input
                type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                End Date *
              </label>
              <input
                type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Assign Auditors *
            </label>
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 max-h-40 overflow-y-auto space-y-2">
              {employees.map((emp) => (
                <label key={emp._id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={auditors.includes(emp._id)}
                    onChange={() => handleAuditorSelect(emp._id)}
                    className="rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  {emp.name} ({emp.email})
                </label>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Audit Checklist & Verification Screen */}
      <Modal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        size="lg"
        title={`Audit checklist: ${selectedAudit?.title}`}
        footer={
          <div className="flex justify-between w-full">
            <div>
              {selectedAudit?.discrepancyReport && (
                <div className="text-xs text-amber-600 font-medium flex items-center gap-1">
                  <FiAlertCircle />
                  Report: {selectedAudit.discrepancyReport}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsChecklistOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close View
              </button>
              {selectedAudit?.status !== "Completed" && canManage && (
                <button
                  onClick={handleCloseAudit}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  Lock &amp; Close Audit
                </button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm grid grid-cols-2 gap-2">
            <p className="text-slate-500"><span className="font-semibold text-slate-700">Scope Department:</span> {selectedAudit?.scopeDepartment?.name || "All Departments"}</p>
            <p className="text-slate-500"><span className="font-semibold text-slate-700">Scope Location:</span> {selectedAudit?.scopeLocation || "All Locations"}</p>
            <p className="text-slate-500"><span className="font-semibold text-slate-700">Current Status:</span> {selectedAudit?.status}</p>
          </div>

          <Table
            columns={auditedAssetColumns(handleVerifyAsset, selectedAudit?.status === "Completed", canManage, user, selectedAudit?.auditors || [])}
            rows={(selectedAudit?.auditedAssets || []).filter(a => {
              if (canManage || (selectedAudit?.auditors || []).includes(user.id)) return true;
              return a.asset?.assignedTo === user.id;
            })}
            emptyMessage="No scoped assets detected under this audit department/location."
          />
        </div>
      </Modal>
    </div>
  );
};

export default Audits;
