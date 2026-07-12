const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const Asset = require("../models/asset");
const Department = require("../models/department");
const AssetCategory = require("../models/assetCategory");
const Booking = require("../models/booking");
const MaintenanceRequest = require("../models/maintenanceRequest");
const AuditCycle = require("../models/auditCycle");

// GET analytics data (Admin only)
router.get(
  "/",
  authenticate,
  authorize("Admin"),
  wrapAsync(async (req, res) => {
    try {
      const orgId = req.user.organization?._id || req.user.organization;
      const organization = new mongoose.Types.ObjectId(orgId);

      // Start of current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // KPI Aggregations
      const [
        totalAssets,
        allocatedAssets,
        maintenanceThisMonth,
        activeBookings,
        pendingApprovals,
      ] = await Promise.all([
        Asset.countDocuments({ organization }),
        Asset.countDocuments({ organization, status: "Allocated" }),
        MaintenanceRequest.countDocuments({ organization, createdAt: { $gte: startOfMonth } }),
        Booking.countDocuments({ organization, status: { $in: ["Upcoming", "Ongoing"] } }),
        MaintenanceRequest.countDocuments({ organization, status: "Pending" }),
      ]);

      console.log("Analytics KPI stats fetched successfully:", {
        organization,
        totalAssets,
        allocatedAssets,
        maintenanceThisMonth,
        activeBookings,
        pendingApprovals,
      });

    // Calculate Asset Utilization
    const assetUtilization = totalAssets > 0 ? Math.round((allocatedAssets / totalAssets) * 100) : 0;

    // Category Breakdown
    const categories = await AssetCategory.find({ organization });
    const categoryBreakdown = await Promise.all(
      categories.map(async (cat) => {
        const count = await Asset.countDocuments({ category: cat._id, organization });
        return {
          id: cat._id,
          name: cat.name,
          count,
        };
      })
    );

    // Sort category breakdown by count descending
    categoryBreakdown.sort((a, b) => b.count - a.count);

    // Status Distribution
    const statuses = ["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"];
    const statusDistribution = await Promise.all(
      statuses.map(async (status) => {
        const count = await Asset.countDocuments({ status, organization });
        return { status, count };
      })
    );

    // Department Breakdown
    const departments = await Department.find({ organization });
    const departmentBreakdown = await Promise.all(
      departments.map(async (dept) => {
        const count = await Asset.countDocuments({ department: dept._id, organization });
        return {
          id: dept._id,
          name: dept.name,
          code: dept.code,
          count,
        };
      })
    );
    departmentBreakdown.sort((a, b) => b.count - a.count);

    // Maintenance Status Counts
    const maintenanceStatuses = ["Pending", "Approved", "Rejected", "Technician Assigned", "In Progress", "Resolved"];
    const maintenanceDistribution = await Promise.all(
      maintenanceStatuses.map(async (status) => {
        const count = await MaintenanceRequest.countDocuments({ status, organization });
        return { status, count };
      })
    );

    res.status(200).json({
      success: true,
      analytics: {
        kpis: {
          totalAssets,
          allocatedAssets,
          maintenanceThisMonth,
          activeBookings,
          pendingApprovals,
          assetUtilization,
        },
        categoryBreakdown,
        statusDistribution,
        departmentBreakdown,
        maintenanceDistribution,
      },
    });
  } catch (err) {
    console.error("Error in GET /api/analytics:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
})
);

module.exports = router;
