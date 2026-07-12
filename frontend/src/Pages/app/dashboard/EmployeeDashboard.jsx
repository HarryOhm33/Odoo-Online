import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import StatCard from "../../../components/common/StatCard";
import PageHeader from "../../../components/common/PageHeader";
import {
  FiBox, FiCalendar, FiTool, FiBell, FiUsers,
  FiRefreshCw, FiClipboard, FiCheckSquare, FiAlertCircle
} from "react-icons/fi";
import Badge from "../../../components/common/Badge";
import api from "../../../services/api";

const iconMap = {
  FiBox: FiBox,
  FiCalendar: FiCalendar,
  FiTool: FiTool,
  FiBell: FiBell,
  FiUsers: FiUsers,
  FiRefreshCw: FiRefreshCw,
  FiClipboard: FiClipboard,
  FiCheckSquare: FiCheckSquare,
  FiAlertCircle: FiAlertCircle,
};

const roleWelcome = {
  Employee:       "Here's a summary of your assigned assets and activities.",
  DepartmentHead: "Manage your department's assets, bookings, and transfer requests.",
  AssetManager:   "Monitor asset inventory, allocations, maintenance, and audits.",
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const role  = user?.role || "Employee";
  
  const [kpis, setKpis] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/dashboard");
        const { kpis: fetchedKpis, recentNotifications, upcomingBookings } = res.data.stats;
        
        // Map icon strings to icon components
        const mappedKpis = (fetchedKpis || []).map((kpi) => ({
          ...kpi,
          icon: iconMap[kpi.icon] || FiBox,
        }));
        
        setKpis(mappedKpis);
        setNotifications(recentNotifications || []);
        setBookings(upcomingBookings || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-slate-800 font-semibold text-lg">
                Welcome back, {user?.name?.split(" ")[0]}
              </h2>
              <p className="text-slate-500 text-sm">
                {roleWelcome[role]}
              </p>
            </div>
          </div>
          <Badge
            label={role}
            color={
              role === "AssetManager" ? "green"
              : role === "DepartmentHead" ? "amber"
              : "blue"
            }
          />
        </div>
      </div>

      {/* KPI cards */}
      <PageHeader
        title="My Overview"
        subtitle={`${role} dashboard — organization-scoped data`}
      />
      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${kpis.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
        {loading ? (
          [...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 animate-pulse flex flex-col justify-between h-28">
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-6 bg-slate-100 rounded w-1/3" />
            </div>
          ))
        ) : kpis.length > 0 ? (
          kpis.map((kpi) => (
            <StatCard key={kpi.title} {...kpi} />
          ))
        ) : (
          <p className="text-slate-400 text-sm col-span-full">No key metrics available.</p>
        )}
      </div>

      {/* Recent activity & Bookings widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <div className="w-2 h-2 bg-slate-200 rounded-full flex-shrink-0" />
                    <div className="h-3 bg-slate-100 rounded flex-1 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif._id} className="flex items-center gap-3 py-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${notif.isRead ? "bg-slate-300" : "bg-blue-500"}`} />
                  <div className="text-slate-700 text-sm flex-1">{notif.message}</div>
                  <span className="text-slate-400 text-xs">{new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs text-center py-4">
                No recent notifications found.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Upcoming Bookings</h3>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="text-slate-800 text-sm font-medium">{booking.asset?.name || "Asset"}</p>
                    <p className="text-slate-400 text-xs">{booking.asset?.assetTag || "No tag"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-700 text-xs font-medium">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <Badge label={booking.status} color="green" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <FiCalendar className="h-8 w-8 text-slate-200 mb-2" />
              <p className="text-slate-400 text-sm">No upcoming bookings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
