// src/components/features/employees/EmployeeTable.jsx
import Table from "../../common/Table";
import Badge from "../../common/Badge";
import ActionMenu from "../../common/ActionMenu";
import { FiEdit2, FiMail, FiPower, FiTrash2 } from "react-icons/fi";

const statusColor = { Active: "green", Inactive: "red" };
const roleColor   = { Admin: "violet", Employee: "blue", DepartmentHead: "amber", AssetManager: "green" };

const EmployeeTable = ({ employees, loading, onRowClick, onEdit, onResendActivation, onToggleStatus, onDelete }) => {
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
    {
      key: "actions",
      label: "",
      render: (_, row) => {
        const actions = [];
        
        actions.push({ label: "Edit", icon: <FiEdit2 />, onClick: () => onEdit(row) });
        
        if (!row.isVerified) {
          actions.push({ label: "Resend Activation", icon: <FiMail />, onClick: () => onResendActivation(row) });
        }
        
        if (row.role !== "Admin") {
          actions.push({
            label: row.status === "Active" ? "Deactivate" : "Activate",
            icon: <FiPower />,
            onClick: () => onToggleStatus(row)
          });
        }
        
        if (row.role !== "Admin") {
          actions.push({ label: "Delete", icon: <FiTrash2 />, danger: true, onClick: () => onDelete(row) });
        }

        return <ActionMenu actions={actions} />;
      },
    }
  ];

  return (
    <Table
      columns={columns}
      rows={employees}
      loading={loading}
      onRowClick={onRowClick}
      emptyMessage="No employees found. Add employees from the directory."
    />
  );
};

export default EmployeeTable;
