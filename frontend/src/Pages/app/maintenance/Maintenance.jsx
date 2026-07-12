import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import usePermissions from "../../../hooks/usePermissions";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import MaintenanceTable from "../../../components/features/maintenance/MaintenanceTable";
import Modal from "../../../components/common/Modal";
import api from "../../../services/api";
import { FiPlus, FiTool, FiCheck, FiX, FiInfo } from "react-icons/fi";
import { toast } from "react-toastify";

const Maintenance = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [requests, setRequests]       = useState([]);
  const [assets, setAssets]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State - Create Request
  const [assetId, setAssetId]         = useState("");
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority]       = useState("Medium");
  const [photo, setPhoto]             = useState("");

  // Manage Action Modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedReq, setSelectedReq]             = useState(null);
  const [technicianName, setTechnicianName]       = useState("");
  const [notes, setNotes]                         = useState("");

  const canRaise = can("maintenance:raise");
  const canApprove = can("maintenance:approve");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, assetRes] = await Promise.all([
        api.get("/api/maintenance"),
        api.get("/api/assets"),
      ]);
      
      let allRequests = reqRes.data.requests || [];
      
      if (!can("maintenance:view_all")) {
        if (can("maintenance:view_dept")) {
          // Fallback logic for department filtering
          allRequests = allRequests.filter(r => r.reportedBy?.department === user.department || r.reportedBy?._id === user._id);
        } else {
          allRequests = allRequests.filter(r => r.reportedBy?._id === user._id);
        }
      }

      setRequests(allRequests);
      setAssets(assetRes.data.assets || []);
    } catch (err) {
      toast.error("Failed to load maintenance requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setAssetId("");
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setPhoto("");
    setIsModalOpen(true);
  };

  const handleOpenAction = (req) => {
    setSelectedReq(req);
    setTechnicianName(req.technicianName || "");
    setNotes(req.notes || "");
    setIsActionModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/maintenance", {
        assetId,
        title,
        description,
        priority,
        photo,
      });
      toast.success("Maintenance request submitted successfully.");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    }
  };

  const handleActionSubmit = async (status) => {
    try {
      await api.put(`/api/maintenance/${selectedReq._id}/status`, {
        status,
        technicianName,
        notes,
      });
      toast.success(`Request status updated to ${status}.`);
      setIsActionModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    }
  };

  const filteredReqs = requests.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.asset?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Maintenance Requests"
        subtitle="Report and resolve hardware asset technical issues"
        actions={
          canRaise && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <FiPlus className="h-4 w-4" />
              New Request
            </button>
          )
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search requests by title or asset..."
        className="max-w-sm"
      />

      <MaintenanceTable
        records={filteredReqs}
        loading={loading}
        onRowClick={(req) => {
          if (canApprove && ["Pending", "Approved", "Technician Assigned", "In Progress"].includes(req.status)) {
            handleOpenAction(req);
          }
        }}
      />

      {/* Modal 1: Create Request */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Raise Maintenance Request"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Submit Request
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Asset *
            </label>
            <select
              value={assetId}
              required
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose asset...</option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.name} ({asset.assetTag})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Issue Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Broken keyboard keys"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Detail the issue..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Action Workflow Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`Review Request: ${selectedReq?.title}`}
        footer={
          <div className="flex justify-between w-full">
            <div>
              {selectedReq?.status === "Pending" && (
                <button
                  onClick={() => handleActionSubmit("Rejected")}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer mr-2"
                >
                  Reject Request
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              {selectedReq?.status === "Pending" && (
                <button
                  onClick={() => handleActionSubmit("Approved")}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 cursor-pointer"
                >
                  Approve (Marks Under Maintenance)
                </button>
              )}

              {["Approved", "Technician Assigned", "In Progress"].includes(selectedReq?.status) && (
                <button
                  onClick={() => handleActionSubmit("Resolved")}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Resolve (Marks Asset Available)
                </button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm">
            <p className="text-slate-500 mb-1"><span className="font-semibold text-slate-700">Issue:</span> {selectedReq?.description || "No description"}</p>
            <p className="text-slate-500"><span className="font-semibold text-slate-700">Current Status:</span> {selectedReq?.status}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Technician Name (Optional)
            </label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Alex Maintenance Tech"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Action Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Record repairs notes..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Maintenance;
