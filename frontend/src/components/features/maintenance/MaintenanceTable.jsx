// src/components/features/maintenance/MaintenanceTable.jsx
import Table from "../../common/Table";
import Badge from "../../common/Badge";

const priorityColor = { High: "red", Medium: "amber", Low: "green" };
const statusColor   = { Open: "blue", "In Progress": "amber", Resolved: "green", Closed: "slate" };

const columns = [
  { key: "title",    label: "Issue" },
  { key: "asset",    label: "Asset",    render: (v) => v?.name || "—" },
  {
    key: "priority",
    label: "Priority",
    render: (v) => <Badge label={v} color={priorityColor[v] || "slate"} />,
  },
  {
    key: "status",
    label: "Status",
    render: (v) => <Badge label={v} color={statusColor[v] || "slate"} />,
  },
  { key: "reportedBy", label: "Reported By", render: (v) => v?.name || "—" },
  {
    key: "createdAt",
    label: "Date",
    render: (v) => v ? new Date(v).toLocaleDateString() : "—",
  },
];

const MaintenanceTable = ({ records, loading, onRowClick }) => (
  <Table
    columns={columns}
    rows={records}
    loading={loading}
    onRowClick={onRowClick}
    emptyMessage="No maintenance requests found."
  />
);

export default MaintenanceTable;
