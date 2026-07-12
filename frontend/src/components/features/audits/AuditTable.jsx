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
    render: (v) => v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—",
  },
  {
    key: "endDate",
    label: "End Date",
    render: (v) => v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—",
  },
  { key: "assetsAudited", label: "Assets" },
];

const AuditTable = ({ audits, loading, onActionClick }) => {
  const dynamicColumns = [
    ...columns,
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onActionClick(row);
          }}
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
        >
          Open Audit
        </button>
      ),
    },
  ];

  return (
    <Table
      columns={dynamicColumns}
      rows={audits}
      loading={loading}
      emptyMessage="No audit cycles found."
    />
  );
};

export default AuditTable;
