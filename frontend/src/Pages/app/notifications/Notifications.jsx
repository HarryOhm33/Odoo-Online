// src/pages/app/notifications/Notifications.jsx
import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import NotificationList from "../../../components/features/notifications/NotificationList";
import api from "../../../services/api";
import { FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      toast.error("Failed to update notification.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("/api/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch (err) {
      toast.error("Failed to update notifications.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with asset allocations, bookings, maintenance, and audit discrepancies"
        actions={
          unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <FiCheck className="h-4 w-4" />
              Mark All Read
            </button>
          )
        }
      />

      <div className="max-w-2xl">
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkRead={handleMarkRead}
        />
      </div>
    </div>
  );
};

export default Notifications;
