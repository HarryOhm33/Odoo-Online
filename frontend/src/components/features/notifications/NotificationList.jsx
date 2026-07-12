// src/components/features/notifications/NotificationList.jsx
import { FiBell, FiCheck } from "react-icons/fi";

const NotificationList = ({ notifications = [], loading, onMarkRead }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0B172A] rounded-lg border border-white/10 p-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="bg-[#0B172A] rounded-lg border border-white/10 py-12 flex flex-col items-center">
        <FiBell className="h-10 w-10 text-slate-500 mb-3" />
        <p className="text-slate-400 text-sm">No notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((n, idx) => (
        <div
          key={n._id || idx}
          className={`bg-[#0B172A] rounded-lg border p-4 flex items-start gap-3 ${
            n.isRead ? "border-white/10" : "border-blue-500/30 bg-blue-500/10"
          }`}
        >
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? "bg-slate-300" : "bg-blue-500"}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${n.isRead ? "text-slate-400" : "text-white font-medium"}`}>
              {n.message}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {n.createdAt ? new Date(n.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Just now"}
            </p>
          </div>
          {!n.isRead && onMarkRead && (
            <button
              onClick={() => onMarkRead(n._id)}
              className="text-slate-400 hover:text-blue-400 transition-colors p-1"
              title="Mark as read"
            >
              <FiCheck className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
