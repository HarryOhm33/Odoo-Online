const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department");

router.get("/",    authenticate, wrapAsync(getDepartments));
router.post("/",   authenticate, authorize("Admin"), wrapAsync(createDepartment));
router.put("/:id", authenticate, authorize("Admin"), wrapAsync(updateDepartment));
router.delete("/:id", authenticate, authorize("Admin"), wrapAsync(deleteDepartment));

module.exports = router;
