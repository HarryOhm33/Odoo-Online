// src/pages/app/bookings/Bookings.jsx
import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import Table from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";
import Modal from "../../../components/common/Modal";
import api from "../../../services/api";
import { FiPlus, FiCalendar, FiClock, FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-toastify";
import usePermissions from "../../../hooks/usePermissions";
import { useAuth } from "../../../contexts/AuthContext";

const statusColor = { Upcoming: "blue", Ongoing: "green", Completed: "slate", Cancelled: "red" };

const columns = (onCancel, canCancel) => [
  { key: "asset",   label: "Resource",   render: (v) => v ? `${v.name} (${v.assetTag})` : "—" },
  { key: "user",    label: "Booked By",  render: (v) => v?.name || "—" },
  { key: "startDate",  label: "Start Time",  render: (v) => v ? new Date(v).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—" },
  { key: "endDate",    label: "End Time",    render: (v) => v ? new Date(v).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—" },
  { key: "purpose",    label: "Purpose" },
  { key: "status",     label: "Status",     render: (v) => <Badge label={v} color={statusColor[v] || "slate"} /> },
  {
    key: "actions",
    label: "Actions",
    render: (_, row) => (row.status === "Upcoming" && canCancel) ? (
      <button
        onClick={(e) => { e.stopPropagation(); onCancel(row._id); }}
        className="text-red-500 hover:text-red-700 font-medium text-xs cursor-pointer"
      >
        Cancel
      </button>
    ) : "—",
  },
];

const Bookings = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [bookings, setBookings]       = useState([]);
  const [bookableAssets, setAssets]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [assetId, setAssetId]         = useState("");
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");
  const [purpose, setPurpose]         = useState("");

  const canCreate = can("booking:create");
  const canCancel = can("booking:cancel");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookRes, assetRes] = await Promise.all([
        api.get("/api/bookings"),
        api.get("/api/assets"),
      ]);
      
      let allBookings = bookRes.data.bookings || [];
      
      // Filter based on permissions
      if (!can("booking:view_all")) {
        if (can("booking:department")) {
          // Compare object ID if department is populated in AuthContext
          const userDeptId = typeof user.department === "object" ? user.department?._id : user.department;
          allBookings = allBookings.filter(b => b.user?.department === userDeptId || b.user?._id === user.id);
        } else {
          allBookings = allBookings.filter(b => b.user?._id === user.id);
        }
      }
      
      setBookings(allBookings);
      // Filter assets that are marked bookable and are not permanently allocated
      const bookables = (assetRes.data.assets || []).filter(
        (a) => a.sharedBookable && (a.status === "Available" || a.status === "Reserved")
      );
      setAssets(bookables);
    } catch (err) {
      toast.error("Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setAssetId("");
    setStartDate("");
    setEndDate("");
    setPurpose("");
    setIsModalOpen(true);
  };

  const handleCancelBooking = async (id) => {
    try {
      await api.put(`/api/bookings/${id}/cancel`);
      toast.success("Booking cancelled successfully.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assetId || !startDate || !endDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await api.post("/api/bookings", {
        assetId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        purpose,
      });
      toast.success("Resource booked successfully!");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(
          <div>
            <p className="font-semibold">{err.response.data.message}</p>
            <p className="text-xs">
              Overlap slot: {new Date(err.response.data.overlappingBooking.startDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })} - {new Date(err.response.data.overlappingBooking.endDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        );
      } else {
        toast.error(err.response?.data?.message || "Failed to submit booking.");
      }
    }
  };

  const filteredBookings = bookings.filter((b) =>
    b.asset?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.purpose?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Resource Bookings"
        subtitle="Reserve shared spaces, vehicles, or equipment with overlap safety checks"
        actions={
          canCreate && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <FiPlus className="h-4 w-4" />
              Book Resource
            </button>
          )
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search bookings by resource name or purpose..."
        className="max-w-sm"
      />

      <Table
        columns={columns(handleCancelBooking, canCancel)}
        rows={filteredBookings}
        loading={loading}
        emptyMessage="No bookings found. Create a booking."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book Shared Resource"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Submit Booking
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Select Bookable Resource *
            </label>
            <select
              value={assetId}
              required
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            >
              <option value="">Choose resource...</option>
              {bookableAssets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.name} ({asset.location || "No Location"})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Start Time *
              </label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                End Time *
              </label>
              <input
                type="datetime-local"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Purpose
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              rows={3}
              placeholder="e.g. Weekly sync-up meeting"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Bookings;
