// src/components/features/audits/AuditTable.jsx
import Table from "../../common/Table";
import Badge from "../../common/Badge";

const statusColor = { Planned: "blue", "In Progress": "amber", Completed: "green", Cancelled: "red" };

const columns = [
  { key: "title",      label: "Audit Title" },
  { key: "auditor",    label: "Auditor",    render: (v) => v?.name || "—" },
  {
    key: "status",
    label: "Status",
    render: (v) => <Badge label={v} color={statusColor[v] || "slate"} />,
  },
  {
    key: "startDate",
    label: "Start Date",
    render: (v) => v ? new Date(v).toLocaleDateString() : "—",
  },
  {
    key: "endDate",
    label: "End Date",
    render: (v) => v ? new Date(v).toLocaleDateString() : "—",
  },
  { key: "assetsAudited", label: "Assets" },
];

const AuditTable = ({ audits, loading, onRowClick }) => (
  <Table
    columns={columns}
    rows={audits}
    loading={loading}
    onRowClick={onRowClick}
    emptyMessage="No audit cycles found."
  />
);

export default AuditTable;
