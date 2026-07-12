// src/components/features/employees/EmployeeTable.jsx
import Table from "../../common/Table";
import Badge from "../../common/Badge";

const statusColor = { Active: "green", Inactive: "red" };
const roleColor   = { Admin: "violet", Employee: "blue", DepartmentHead: "amber", AssetManager: "green" };

const columns = [
  { key: "name",   label: "Name" },
  { key: "email",  label: "Email" },
  {
    key: "role",
    label: "Role",
    render: (val) => <Badge label={val} color={roleColor[val] || "slate"} />,
  },
  {
    key: "department",
    label: "Department",
    render: (val) => val?.name || "—",
  },
  {
    key: "status",
    label: "Status",
    render: (val) => <Badge label={val} color={statusColor[val] || "slate"} />,
  },
  {
    key: "isVerified",
    label: "Activated",
    render: (val) => (
      <Badge label={val ? "Yes" : "Pending"} color={val ? "green" : "amber"} />
    ),
  },
];

const EmployeeTable = ({ employees, loading, onRowClick }) => (
  <Table
    columns={columns}
    rows={employees}
    loading={loading}
    onRowClick={onRowClick}
    emptyMessage="No employees found. Add employees from the directory."
  />
);

export default EmployeeTable;
