// src/pages/app/allocations/Allocations.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import usePermissions from "../../../hooks/usePermissions";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import Table from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";
import Modal from "../../../components/common/Modal";
import api from "../../../services/api";
import { FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";

const columns = (onReturn, isAssetManager) => [
  { key: "name",        label: "Asset Name" },
  { key: "assetTag",    label: "Asset Tag" },
  { key: "assignedTo",  label: "Assigned User",  render: (v) => v?.name || "—" },
  { key: "department",  label: "Department",     render: (v) => v?.name || "—" },
  { key: "expectedReturnDate", label: "Expected Return", render: (v) => v ? new Date(v).toLocaleDateString() : "No Limit" },
  {
    key: "actions",
    label: "Action",
    render: (_, row) => isAssetManager ? (
      <button
        onClick={() => onReturn(row)}
        className="text-blue-600 hover:text-blue-800 font-semibold text-xs cursor-pointer"
      >
        Check-in Return
      </button>
    ) : "—",
  },
];

const Allocations = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [allocatedAssets, setAssets]   = useState([]);
  const [loading, setLoading]          = useState(true);
  const [search, setSearch]            = useState("");

  // Check-in / Return Modal
  const [isReturnOpen, setIsReturnOpen]   = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [conditionAtCheckIn, setCondition] = useState("Good");

  const canAllocate = can("allocation:create");

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/assets");
      const allocated = (res.data.assets || []).filter((a) => a.status === "Allocated");
      setAssets(allocated);
    } catch (err) {
      toast.error("Failed to load allocation details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleOpenReturn = (asset) => {
    setSelectedAsset(asset);
    setCondition(asset.condition || "Good");
    setIsReturnOpen(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/assets/${selectedAsset._id}/return`, {
        conditionAtCheckIn,
      });
      toast.success("Asset returned to inventory.");
      setIsReturnOpen(false);
      fetchAllocations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log return.");
    }
  };

  const filtered = allocatedAssets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.assetTag?.toLowerCase().includes(search.toLowerCase()) ||
    a.assignedTo?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Asset Allocation"
        subtitle="Manage and review all currently allocated company assets and return lifecycles"
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search allocations by asset or user name..."
        className="max-w-sm"
      />

      <Table
        columns={columns(handleOpenReturn, canAllocate)}
        rows={filtered}
        loading={loading}
        emptyMessage="No active allocations found."
      />

      <Modal
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        title={`Return Asset / Check-in: ${selectedAsset?.name}`}
        footer={
          <>
            <button
              onClick={() => setIsReturnOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReturnSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Confirm Return
            </button>
          </>
        }
      >
        <form onSubmit={handleReturnSubmit} className="space-y-4">
          <p className="text-sm text-slate-500 leading-relaxed">
            Record check-in condition notes to release the asset back into inventory as <span className="font-semibold text-slate-700">Available</span>.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Check-in Condition
            </label>
            <select
              value={conditionAtCheckIn}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Allocations;
