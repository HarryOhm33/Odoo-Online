// src/components/features/departments/DepartmentTable.jsx
import Table from "../../common/Table";
import Badge from "../../common/Badge";
import ActionMenu from "../../common/ActionMenu";
import { FiEdit2, FiPower, FiTrash2 } from "react-icons/fi";

const DepartmentTable = ({ departments, loading, onRowClick, onEdit, onToggleStatus, onDelete }) => {
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
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <ActionMenu
          actions={[
            { label: "Edit", icon: <FiEdit2 />, onClick: () => onEdit(row) },
            {
              label: row.status === "Active" ? "Deactivate" : "Activate",
              icon: <FiPower />,
              onClick: () => onToggleStatus(row),
            },
            { label: "Delete", icon: <FiTrash2 />, danger: true, onClick: () => onDelete(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={departments}
      loading={loading}
      onRowClick={onRowClick}
      emptyMessage="No departments found. Create your first department."
    />
  );
};

export default DepartmentTable;
