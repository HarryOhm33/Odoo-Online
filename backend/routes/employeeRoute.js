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
  deleteEmployee,
} = require("../controllers/employee");

// POST   /api/employees          — Admin creates a new employee
router.post(
  "/",
  authenticate,
  authorize("Admin"),
  wrapAsync(createEmployee)
);

// GET    /api/employees          — Admin / DepartmentHead / AssetManager / Employee lists all employees
router.get(
  "/",
  authenticate,
  authorize("Admin", "DepartmentHead", "AssetManager", "Employee"),
  wrapAsync(getEmployees)
);

// GET    /api/employees/:id      — Admin / DepartmentHead / AssetManager gets a single employee
router.get(
  "/:id",
  authenticate,
  authorize("Admin", "DepartmentHead", "AssetManager"),
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

// DELETE /api/employees/:id — Admin deactivates (soft-deletes) an employee
router.delete(
  "/:id",
  authenticate,
  authorize("Admin"),
  wrapAsync(deleteEmployee)
);

module.exports = router;
