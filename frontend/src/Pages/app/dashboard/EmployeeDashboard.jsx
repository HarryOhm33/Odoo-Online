import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import PageHeader from "../../../components/common/PageHeader";
import EmployeeView from "./views/EmployeeView";
import DepartmentHeadView from "./views/DepartmentHeadView";
import AssetManagerView from "./views/AssetManagerView";
import api from "../../../services/api";
import { toast } from "react-toastify";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const role = user?.role || "Employee";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/dashboard");
        setStats(res.data.stats);
      } catch (err) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${role} Dashboard`}
        subtitle="Overview and Quick Actions"
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {role === "Employee" && <EmployeeView stats={stats} />}
          {role === "DepartmentHead" && <DepartmentHeadView stats={stats} />}
          {role === "AssetManager" && <AssetManagerView stats={stats} />}
        </>
      )}
    </div>
  );
};

export default EmployeeDashboard;
