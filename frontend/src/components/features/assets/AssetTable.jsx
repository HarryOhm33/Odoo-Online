// src/components/features/assets/AssetTable.jsx
import Table from "../../common/Table";
import Badge from "../../common/Badge";

const statusColor = {
  Available:  "green",
  Allocated:  "blue",
  Maintenance:"amber",
  Retired:    "red",
};

const columns = [
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
    key: "purchaseDate",
    label: "Purchase Date",
    render: (v) => v ? new Date(v).toLocaleDateString() : "—",
  },
];

const AssetTable = ({ assets, loading, onRowClick }) => (
  <Table
    columns={columns}
    rows={assets}
    loading={loading}
    onRowClick={onRowClick}
    emptyMessage="No assets found."
  />
);

export default AssetTable;
