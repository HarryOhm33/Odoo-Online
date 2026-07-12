import { useAuth } from "../../../contexts/AuthContext";
import PageHeader from "../../../components/common/PageHeader";
import EmployeeView from "./views/EmployeeView";
import DepartmentHeadView from "./views/DepartmentHeadView";
import AssetManagerView from "./views/AssetManagerView";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const role = user?.role || "Employee";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${role} Dashboard`}
        subtitle="Overview and Quick Actions"
      />

      {role === "Employee" && <EmployeeView />}
      {role === "DepartmentHead" && <DepartmentHeadView />}
      {role === "AssetManager" && <AssetManagerView />}
    </div>
  );
};

export default EmployeeDashboard;
