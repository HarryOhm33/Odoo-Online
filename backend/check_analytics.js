const mongoose = require("mongoose");
const User = require("/Users/rajnishmaurya/Downloads/Odoo-Online/backend/models/user");
const Asset = require("/Users/rajnishmaurya/Downloads/Odoo-Online/backend/models/asset");
const Department = require("/Users/rajnishmaurya/Downloads/Odoo-Online/backend/models/department");
const AssetCategory = require("/Users/rajnishmaurya/Downloads/Odoo-Online/backend/models/assetCategory");
const Booking = require("/Users/rajnishmaurya/Downloads/Odoo-Online/backend/models/booking");
const MaintenanceRequest = require("/Users/rajnishmaurya/Downloads/Odoo-Online/backend/models/maintenanceRequest");

const MONGO_URI = "mongodb+srv://hari333333om:3y32irCKtdH8BGvL@cluster0.7p4sjtg.mongodb.net/Odoo-Online?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // Find first user to get their organization ID
    const user = await User.findOne({ role: "Admin" });
    if (!user) {
      console.log("No Admin user found.");
      mongoose.connection.close();
      return;
    }
    const organization = user.organization;
    console.log("Using Organization ID:", organization);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

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

    const assetUtilization = totalAssets > 0 ? Math.round((allocatedAssets / totalAssets) * 100) : 0;

    console.log("KPI Stats:", {
      totalAssets,
      allocatedAssets,
      maintenanceThisMonth,
      activeBookings,
      pendingApprovals,
      assetUtilization,
    });

    const categories = await AssetCategory.find({ organization });
    const categoryBreakdown = await Promise.all(
      categories.map(async (cat) => {
        const count = await Asset.countDocuments({ category: cat._id, organization });
        return { name: cat.name, count };
      })
    );
    console.log("Category Breakdown:", categoryBreakdown);

    const departments = await Department.find({ organization });
    const departmentBreakdown = await Promise.all(
      departments.map(async (dept) => {
        const count = await Asset.countDocuments({ department: dept._id, organization });
        return { name: dept.name, count };
      })
    );
    console.log("Department Breakdown:", departmentBreakdown);

    mongoose.connection.close();
  } catch (err) {
    console.error("Error running query:", err);
    process.exit(1);
  }
}

run();
