/**
 * authorize(...roles)
 *
 * Middleware factory for role-based access control.
 * Must be used AFTER the `authenticate` middleware so that req.user is populated.
 *
 * Usage:
 *   router.post("/employees", authenticate, authorize("Admin"), wrapAsync(createEmployee));
 *   router.get("/assets",     authenticate, authorize("Admin", "AssetManager"), wrapAsync(getAssets));
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = authorize;
