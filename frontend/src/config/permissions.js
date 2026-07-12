// src/config/permissions.js

/**
 * Define specific capabilities/actions in the system.
 */
export const PERMISSIONS = {
  // Asset Management
  ASSET_REGISTER: "asset:register",
  ASSET_EDIT: "asset:edit",
  ASSET_DELETE: "asset:delete",
  ASSET_VIEW_ALL: "asset:view_all",
  ASSET_VIEW_DEPARTMENT: "asset:view_dept",
  ASSET_VIEW_OWN: "asset:view_own",

  // Allocation & Transfers
  ALLOCATION_CREATE: "allocation:create",
  TRANSFER_CREATE: "transfer:create",
  TRANSFER_APPROVE: "transfer:approve",
  TRANSFER_REJECT: "transfer:reject",
  TRANSFER_COMPLETE: "transfer:complete",

  // Bookings
  BOOKING_CREATE: "booking:create",
  BOOKING_CANCEL: "booking:cancel",
  BOOKING_VIEW_ALL: "booking:view_all",
  BOOKING_DEPARTMENT: "booking:department",

  // Maintenance
  MAINTENANCE_RAISE: "maintenance:raise",
  MAINTENANCE_APPROVE: "maintenance:approve",
  MAINTENANCE_REJECT: "maintenance:reject",
  MAINTENANCE_ASSIGN: "maintenance:assign",
  MAINTENANCE_RESOLVE: "maintenance:resolve",
  MAINTENANCE_VIEW_ALL: "maintenance:view_all",
  MAINTENANCE_VIEW_DEPT: "maintenance:view_dept",

  // Audits
  AUDIT_CREATE: "audit:create",
  AUDIT_MANAGE: "audit:manage",

  // Reports
  REPORT_GENERATE: "report:generate",
};

/**
 * Role-to-Permissions Mapping
 */
export const ROLE_PERMISSIONS = {
  Admin: Object.values(PERMISSIONS), // Admin gets all permissions by default
  AssetManager: [
    PERMISSIONS.ASSET_REGISTER,
    PERMISSIONS.ASSET_EDIT,
    PERMISSIONS.ASSET_DELETE, // Assuming Asset Manager can delete (or at least manage lifecycle)
    PERMISSIONS.ASSET_VIEW_ALL,
    PERMISSIONS.ALLOCATION_CREATE,
    PERMISSIONS.TRANSFER_CREATE,
    PERMISSIONS.TRANSFER_APPROVE,
    PERMISSIONS.TRANSFER_REJECT,
    PERMISSIONS.TRANSFER_COMPLETE,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.BOOKING_VIEW_ALL,
    PERMISSIONS.MAINTENANCE_RAISE,
    PERMISSIONS.MAINTENANCE_APPROVE,
    PERMISSIONS.MAINTENANCE_REJECT,
    PERMISSIONS.MAINTENANCE_ASSIGN,
    PERMISSIONS.MAINTENANCE_RESOLVE,
    PERMISSIONS.MAINTENANCE_VIEW_ALL,
    PERMISSIONS.AUDIT_CREATE,
    PERMISSIONS.AUDIT_MANAGE,
    PERMISSIONS.REPORT_GENERATE,
  ],
  DepartmentHead: [
    PERMISSIONS.ASSET_VIEW_DEPARTMENT,
    PERMISSIONS.ASSET_VIEW_OWN,
    PERMISSIONS.TRANSFER_CREATE,
    PERMISSIONS.TRANSFER_APPROVE,
    PERMISSIONS.TRANSFER_REJECT,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.BOOKING_DEPARTMENT,
    PERMISSIONS.MAINTENANCE_RAISE,
    PERMISSIONS.MAINTENANCE_VIEW_DEPT,
  ],
  Employee: [
    PERMISSIONS.ASSET_VIEW_OWN,
    PERMISSIONS.TRANSFER_CREATE,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.MAINTENANCE_RAISE,
  ],
};

/**
 * Helper to check if a role has a specific permission
 */
export const hasPermission = (role, permission) => {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
};
