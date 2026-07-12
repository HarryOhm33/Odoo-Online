// src/components/features/assets/AssetTable.jsx
import Table from "../../common/Table";
import Badge from "../../common/Badge";

const statusColor = {
  Available:  "green",
  Allocated:  "blue",
  Maintenance:"amber",
  Retired:    "red",
};

const columns = (onEdit) => [
  { key: "name",     label: "Asset Name" },
  { key: "category", label: "Category",   render: (v) => v?.name || "—" },
  { key: "assetTag", label: "Asset Tag" },
  {
    key: "status",
    label: "Status",
    render: (v) => <Badge label={v} color={statusColor[v] || "slate"} />,
  },
  { key: "assignedTo", label: "Assigned To", render: (v) => v?.name || "Unassigned" },
  {
    key: "acquisitionDate",
    label: "Purchase Date",
    render: (v) => v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—",
  },
  {
    key: "actions",
    label: "",
    render: (_, row) => onEdit ? (
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(row); }}
        className="text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer"
      >
        Edit
      </button>
    ) : null,
  },
];

const AssetTable = ({ assets, loading, onRowClick, onEdit }) => (
  <Table
    columns={columns(onEdit)}
    rows={assets}
    loading={loading}
    onRowClick={onRowClick}
    emptyMessage="No assets found."
  />
);

export default AssetTable;
