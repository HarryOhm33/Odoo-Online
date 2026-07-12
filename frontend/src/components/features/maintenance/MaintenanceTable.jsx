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
    render: (v) => v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—",
  },
];

const MaintenanceTable = ({ records, loading, canApprove, onActionClick }) => {
  const dynamicColumns = [
    ...columns,
    ...(canApprove
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (_, row) =>
              ["Pending", "Approved", "Technician Assigned", "In Progress"].includes(row.status) ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick(row);
                  }}
                  className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  Manage
                </button>
              ) : (
                "—"
              ),
          },
        ]
      : []),
  ];

  return (
    <Table
      columns={dynamicColumns}
      rows={records}
      loading={loading}
      emptyMessage="No maintenance requests found."
    />
  );
};

export default MaintenanceTable;
