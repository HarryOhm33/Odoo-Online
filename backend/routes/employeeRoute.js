const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  resendActivation,
} = require("../controllers/employee");

// POST   /api/employees          — Admin creates a new employee
router.post(
  "/",
  authenticate,
  authorize("Admin"),
  wrapAsync(createEmployee)
);

// GET    /api/employees          — Admin / DepartmentHead lists all employees
router.get(
  "/",
  authenticate,
  authorize("Admin", "DepartmentHead"),
  wrapAsync(getEmployees)
);

// GET    /api/employees/:id      — Admin / DepartmentHead gets a single employee
router.get(
  "/:id",
  authenticate,
  authorize("Admin", "DepartmentHead"),
  wrapAsync(getEmployee)
);

// PUT    /api/employees/:id      — Admin updates employee role / department / status
router.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  wrapAsync(updateEmployee)
);

// POST   /api/employees/:id/resend-activation — Admin resends activation email
router.post(
  "/:id/resend-activation",
  authenticate,
  authorize("Admin"),
  wrapAsync(resendActivation)
);

module.exports = router;
