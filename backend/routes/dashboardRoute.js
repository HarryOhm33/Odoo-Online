const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const User = require("../models/user");
const Department = require("../models/department");
const Asset = require("../models/asset");
const AssetCategory = require("../models/assetCategory");
const Booking = require("../models/booking");
const MaintenanceRequest = require("../models/maintenanceRequest");
const AuditCycle = require("../models/auditCycle");
const Notification = require("../models/notification");
const Transfer = require("../models/transfer");

// GET dashboard statistics based on role
router.get(
  "/",
  authenticate,
  wrapAsync(async (req, res) => {
    const { role, organization, id: userId } = req.user;

    if (role === "Admin") {
      // Fetch Admin Dashboard Stats
      const [
        totalEmployees,
        activeEmployees,
        totalDepartments,
        activeAssets,
        assetsUnderMaintenance,
        activeBookings,
        pendingMaintenanceRequests,
        activeAuditCycles,
        categoriesCount
      ] = await Promise.all([
        User.countDocuments({ organization }),
        User.countDocuments({ organization, status: "Active" }),
        Department.countDocuments({ organization }),
        Asset.countDocuments({ organization, status: "Available" }),
        Asset.countDocuments({ organization, status: "In Maintenance" }),
        Booking.countDocuments({ organization, status: { $in: ["Upcoming", "Ongoing"] } }),
        MaintenanceRequest.countDocuments({ organization, status: "Pending" }),
        AuditCycle.countDocuments({ organization, status: { $in: ["Planned", "In Progress"] } }),
        AssetCategory.countDocuments({ organization }),
      ]);

      // Fetch recent actions / activity
      const [recentEmployees, recentDepartments, recentCategories] = await Promise.all([
        User.find({ organization }).sort({ createdAt: -1 }).limit(4),
        Department.find({ organization }).sort({ createdAt: -1 }).limit(4),
        AssetCategory.find({ organization }).sort({ createdAt: -1 }).limit(4),
      ]);

      const activities = [];
      recentEmployees.forEach((emp) => {
        activities.push({
          id: `emp-${emp._id}`,
          action: `Employee ${emp.name} added`,
          user: emp.createdBy ? "Admin" : "System",
          time: emp.createdAt,
          dot: "bg-blue-500",
        });
      });
      recentDepartments.forEach((dept) => {
        activities.push({
          id: `dept-${dept._id}`,
          action: `Department ${dept.name} created`,
          user: "Admin",
          time: dept.createdAt,
          dot: "bg-green-500",
        });
      });
      recentCategories.forEach((cat) => {
        activities.push({
          id: `cat-${cat._id}`,
          action: `Category ${cat.name} updated`,
          user: "Admin",
          time: cat.createdAt,
          dot: "bg-amber-500",
        });
      });

      // Sort by time descending and limit to 4
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      const recentActivity = activities.slice(0, 4).map((act) => {
        const diffMs = Date.now() - new Date(act.time).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        let timeStr = "Just now";
        if (diffHours >= 24) {
          timeStr = new Date(act.time).toLocaleDateString();
        } else if (diffHours > 0) {
          timeStr = `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
        } else if (diffMins > 0) {
          timeStr = `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
        }
        return {
          id: act.id,
          action: act.action,
          user: act.user,
          time: timeStr,
          dot: act.dot,
        };
      });

      return res.status(200).json({
        success: true,
        stats: {
          totalEmployees,
          activeEmployees,
          totalDepartments,
          activeAssets,
          assetsUnderMaintenance,
          activeBookings,
          pendingMaintenanceRequests,
          activeAuditCycles,
          categoriesCount,
          recentActivity,
        },
      });
    } else {
      // Fetch Employee/DepartmentHead/AssetManager Dashboard Stats
      const dbUser = await User.findById(userId);
      const myDeptId = dbUser ? dbUser.department : null;

      const stats = {};

      if (role === "Employee") {
        const [myAssets, activeBookings, pendingMaintenance, unreadNotifications] = await Promise.all([
          Asset.countDocuments({ assignedTo: userId, organization }),
          Booking.countDocuments({ user: userId, organization, status: { $in: ["Upcoming", "Ongoing"] } }),
          MaintenanceRequest.countDocuments({ reportedBy: userId, organization, status: "Pending" }),
          Notification.countDocuments({ user: userId, organization, isRead: false }),
        ]);

        stats.kpis = [
          { title: "My Assets",          value: myAssets, icon: "FiBox",       color: "blue"   },
          { title: "Active Bookings",    value: activeBookings, icon: "FiCalendar",  color: "green"  },
          { title: "Pending Maintenance",value: pendingMaintenance, icon: "FiTool",      color: "amber"  },
          { title: "Notifications",      value: unreadNotifications, icon: "FiBell",      color: "slate"  },
        ];
      } else if (role === "DepartmentHead") {
        // Find the department they manage
        const managedDept = await Department.findOne({ head: userId });
        const targetDeptId = managedDept ? managedDept._id : myDeptId;

        const [deptAssets, activeBookings, unreadNotifications] = await Promise.all([
          targetDeptId ? Asset.countDocuments({ department: targetDeptId, organization }) : 0,
          Booking.countDocuments({ user: userId, organization, status: { $in: ["Upcoming", "Ongoing"] } }),
          Notification.countDocuments({ user: userId, organization, isRead: false }),
        ]);

        let pendingTransfers = 0;
        let deptEmployees = [];
        if (targetDeptId) {
          const deptUsers = await User.find({ department: targetDeptId }).select("_id");
          const deptUserIds = deptUsers.map((u) => u._id);
          pendingTransfers = await Transfer.countDocuments({
            $or: [
              { fromUser: { $in: deptUserIds } },
              { toDepartment: targetDeptId }
            ],
            organization,
            status: "Pending",
          });
          
          deptEmployees = await User.find({ department: targetDeptId })
            .select("name email role status")
            .sort({ name: 1 })
            .limit(5);
        }

        stats.kpis = [
          { title: "Department Assets",  value: deptAssets, icon: "FiUsers",     color: "blue"   },
          { title: "Pending Transfers",  value: pendingTransfers, icon: "FiRefreshCw", color: "amber"  },
          { title: "Active Bookings",    value: activeBookings, icon: "FiCalendar",  color: "green"  },
          { title: "Notifications",      value: unreadNotifications, icon: "FiBell",      color: "slate"  },
        ];
        stats.deptEmployees = deptEmployees;
      } else if (role === "AssetManager") {
        const [availableAssets, allocatedAssets, maintenanceToday, pendingApprovals, activeAudits] = await Promise.all([
          Asset.countDocuments({ status: "Available", organization }),
          Asset.countDocuments({ status: "Allocated", organization }),
          MaintenanceRequest.countDocuments({ organization, status: { $in: ["Pending", "In Progress", "Technician Assigned"] } }),
          Transfer.countDocuments({ organization, status: "Pending" }),
          AuditCycle.countDocuments({ organization, status: { $in: ["Planned", "In Progress"] } }),
        ]);

        stats.kpis = [
          { title: "Available Assets",   value: availableAssets, icon: "FiBox",       color: "green"  },
          { title: "Assets Allocated",   value: allocatedAssets, icon: "FiUsers",     color: "blue"   },
          { title: "Maintenance Today",  value: maintenanceToday, icon: "FiTool",      color: "amber"  },
          { title: "Pending Approvals",  value: pendingApprovals, icon: "FiCheckSquare",color: "red"   },
          { title: "Active Audit Cycles",value: activeAudits, icon: "FiClipboard", color: "violet" },
        ];
      }

      // Fetch recent notifications for widget
      const recentNotifications = await Notification.find({ user: userId, organization })
        .sort({ createdAt: -1 })
        .limit(3);

      // Fetch upcoming bookings for widget
      const upcomingBookings = await Booking.find({ user: userId, organization, status: "Upcoming" })
        .populate("asset", "name assetTag")
        .sort({ startDate: 1 })
        .limit(3);

      return res.status(200).json({
        success: true,
        stats: {
          kpis: stats.kpis,
          recentNotifications,
          upcomingBookings,
          deptEmployees: stats.deptEmployees,
        },
      });
    }
  })
);

module.exports = router;
