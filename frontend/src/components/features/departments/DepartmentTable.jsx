// src/components/features/departments/DepartmentTable.jsx
import Table from "../../common/Table";
import Badge from "../../common/Badge";

const columns = [
  { key: "code",        label: "Code",        render: (v) => v || "—" },
  { key: "name",        label: "Department Name" },
  { key: "head",        label: "Head",        render: (v) => v?.name || "—" },
  { key: "employeeCount",label: "Employees",  render: (v) => v ?? "—" },
  { key: "assetCount",  label: "Assets",      render: (v) => v ?? "—" },
  {
    key: "status",
    label: "Status",
    render: (v) => <Badge label={v || "Active"} color={v === "Active" ? "green" : "slate"} />,
  },
];

const DepartmentTable = ({ departments, loading, onRowClick }) => (
  <Table
    columns={columns}
    rows={departments}
    loading={loading}
    onRowClick={onRowClick}
    emptyMessage="No departments found. Create your first department."
  />
);

export default DepartmentTable;
