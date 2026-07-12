import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";
import Modal from "../../../components/common/Modal";
import SearchBar from "../../../components/common/SearchBar";
import api from "../../../services/api";
import { FiPlus, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import usePermissions from "../../../hooks/usePermissions";
import { useAuth } from "../../../contexts/AuthContext";

const statusColor = { Pending: "amber", Approved: "green", Rejected: "red" };

const Transfers = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const isApprovalsPage = window.location.pathname.includes("/approvals");
  
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Data for request modal
  const [myAssets, setMyAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [transferType, setTransferType] = useState("user");
  const [targetUser, setTargetUser] = useState("");
  const [targetDepartment, setTargetDepartment] = useState("");
  const [reason, setReason] = useState("");

  const canApprove = can("transfer:approve") || ["Admin", "AssetManager"].includes(user.role);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/transfers");
      setTransfers(res.data.transfers || []);
    } catch (err) {
      toast.error("Failed to load transfers.");
    } finally {
      setLoading(false);
    }
  };

  const fetchModalData = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/api/assets"),
        api.get("/api/employees"),
        api.get("/api/departments")
      ]);
      
      const assets = results[0].status === "fulfilled" ? (results[0].value.data.assets || []) : [];
      
      if (canApprove) {
        // Asset Managers can transfer any currently allocated asset
        setMyAssets(assets.filter(a => a.status === "Allocated"));
      } else {
        // Regular employees can only transfer assets assigned to them
        setMyAssets(assets.filter(a => a.assignedTo?._id === user.id || a.assignedTo === user.id));
      }
      
      setEmployees(results[1].status === "fulfilled" ? (results[1].value.data.employees || []) : []);
      setDepartments(results[2].status === "fulfilled" ? (results[2].value.data.departments || []) : []);
    } catch (err) {
      toast.error("Failed to load data for transfer request.");
    }
  };

  useEffect(() => {
    fetchData();
    if (!isApprovalsPage) {
      fetchModalData();
    }
  }, [isApprovalsPage]);

  const handleOpenRequest = () => {
    setSelectedAsset("");
    setTransferType("user");
    setTargetUser("");
    setTargetDepartment("");
    setReason("");
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedAsset || !reason || (transferType === "user" && !targetUser) || (transferType === "department" && !targetDepartment)) {
      toast.error("Please fill all required fields.");
      return;
    }
    
    try {
      await api.post("/api/transfers", {
        assetId: selectedAsset,
        toUser: transferType === "user" ? targetUser : null,
        toDepartment: transferType === "department" ? targetDepartment : null,
        reason
      });
      toast.success("Transfer request submitted.");
      setIsRequestModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/api/transfers/${id}/${action}`);
      toast.success(`Transfer ${action}d successfully.`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} transfer.`);
    }
  };

  const filteredTransfers = transfers.filter(t => 
    t.asset?.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.asset?.assetTag?.toLowerCase().includes(search.toLowerCase())
  ).filter(t => {
    if (isApprovalsPage) {
      return t.status === "Pending";
    }
    return true; // standard page shows all
  });

  const columns = [
    { key: "asset", label: "Asset", render: (v) => v ? `${v.name} (${v.assetTag})` : "—" },
    { key: "fromUser", label: "From", render: (v) => v?.name || "—" },
    { key: "to", label: "To", render: (_, row) => row.toUser ? row.toUser.name : (row.toDepartment ? row.toDepartment.name : "—") },
    { key: "reason", label: "Reason" },
    { key: "status", label: "Status", render: (v) => <Badge label={v} color={statusColor[v] || "slate"} /> },
    { key: "date", label: "Date", render: (_, row) => new Date(row.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) },
    ...(canApprove && isApprovalsPage ? [{
      key: "actions",
      label: "Actions",
      render: (_, row) => row.status === "Pending" ? (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); handleAction(row._id, 'approve'); }} className="text-green-600 hover:text-green-800 cursor-pointer">
            <FiCheck className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleAction(row._id, 'reject'); }} className="text-red-600 hover:text-red-800 cursor-pointer">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : "—"
    }] : [])
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title={isApprovalsPage ? "Transfer Approvals" : "Asset Transfers"}
        subtitle="Manage the reallocation and transfer of assets between departments or users"
        actions={!isApprovalsPage && (
          <button
            onClick={handleOpenRequest}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <FiPlus className="h-4 w-4" />
            {canApprove ? "Initiate Transfer" : "Request Transfer"}
          </button>
        )}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search transfers by asset name or tag..."
        className="max-w-sm"
      />

      <Table
        columns={columns}
        rows={filteredTransfers}
        loading={loading}
        emptyMessage={isApprovalsPage ? "No pending approvals." : "No active transfer requests."}
      />

      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Initiate Asset Transfer"
        footer={
          <>
            <button onClick={() => setIsRequestModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button onClick={handleSubmitRequest} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">
              {canApprove ? "Transfer Now" : "Submit Request"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Asset to Transfer *</label>
            <select value={selectedAsset} required onChange={(e) => setSelectedAsset(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Choose asset...</option>
              {myAssets.map(a => (
                <option key={a._id} value={a._id}>{a.name} ({a.assetTag})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 text-sm">
              <input type="radio" checked={transferType === "user"} onChange={() => setTransferType("user")} /> User
            </label>
            <label className="flex items-center gap-1.5 text-sm">
              <input type="radio" checked={transferType === "department"} onChange={() => setTransferType("department")} /> Department
            </label>
          </div>
          {transferType === "user" ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Employee *</label>
              <select value={targetUser} required onChange={(e) => setTargetUser(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Choose employee...</option>
                {employees.filter(e => e._id !== user.id).map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Department *</label>
              <select value={targetDepartment} required onChange={(e) => setTargetDepartment(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Choose department...</option>
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Transfer *</label>
            <textarea required value={reason} onChange={(e) => setReason(e.target.value)} rows="3" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Why are you transferring this asset?" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transfers;
