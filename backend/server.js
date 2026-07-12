if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const connectDB = require("./config/db");
connectDB();
// require("./utils/cronJobs");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT;

const ExpressError = require("./utils/ExpressError");
const authRoute = require("./routes/authRoute");
const employeeRoute = require("./routes/employeeRoute");
const departmentRoute = require("./routes/departmentRoute");
const assetCategoryRoute = require("./routes/assetCategoryRoute");
const assetRoute = require("./routes/assetRoute");
const bookingRoute = require("./routes/bookingRoute");
const maintenanceRoute = require("./routes/maintenanceRoute");
const auditRoute = require("./routes/auditRoute");
const notificationRoute = require("./routes/notificationRoute");
const organizationRoute = require("./routes/organizationRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const analyticsRoute = require("./routes/analyticsRoute");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // ✅ Middleware for handling cookies

corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); // ✅ CORS Middleware

app.use("/api/auth", authRoute);
app.use("/api/employees", employeeRoute);
app.use("/api/departments", departmentRoute);
app.use("/api/categories", assetCategoryRoute);
app.use("/api/assets", assetRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/maintenance", maintenanceRoute);
app.use("/api/audits", auditRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/organization", organizationRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/analytics", analyticsRoute);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Not a Valid Route"));
});

//Error Handling Middleware

app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!!" } = err;
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`App Listening To Port ${port}`);
});
