// src/pages/app/transfers/Transfers.jsx
import PageHeader from "../../../components/common/PageHeader";
import EmptyState from "../../../components/common/EmptyState";
import { FiRefreshCw } from "react-icons/fi";
import usePermissions from "../../../hooks/usePermissions";

const Transfers = () => {
  const { can } = usePermissions();
  const isApprovalsPage = window.location.pathname.includes("/approvals");
  
  return (
    <div className="space-y-5">
      <PageHeader
        title={isApprovalsPage ? "Transfer Approvals" : "Asset Transfers"}
        subtitle="Manage the reallocation and transfer of assets between departments or users"
      />

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center">
        <FiRefreshCw className="h-12 w-12 text-slate-200 mb-4" />
        <h3 className="text-slate-800 font-semibold mb-1">
          {isApprovalsPage ? "No pending approvals" : "No active transfer requests"}
        </h3>
        <p className="text-slate-500 text-sm text-center max-w-md">
          {isApprovalsPage 
            ? "You currently have no asset transfer requests awaiting your approval." 
            : "Asset transfer functionality is under active development. You will be able to initiate and track transfers soon."}
        </p>
      </div>
    </div>
  );
};

export default Transfers;
