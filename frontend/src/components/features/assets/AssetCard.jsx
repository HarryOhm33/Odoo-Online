// src/components/features/assets/AssetCard.jsx
import Badge from "../../common/Badge";
import { FiBox, FiTag, FiUser } from "react-icons/fi";

const statusColor = { Available: "green", Allocated: "blue", Maintenance: "amber", Retired: "red" };

const AssetCard = ({ asset, onClick }) => (
  <div
    onClick={() => onClick?.(asset)}
    className={`bg-white rounded-lg border border-slate-200 shadow-sm p-4 ${onClick ? "cursor-pointer hover:shadow-md hover:border-blue-300 transition-all" : ""}`}
  >
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
        <FiBox className="h-5 w-5 text-blue-600" />
      </div>
      <Badge label={asset.status || "Unknown"} color={statusColor[asset.status] || "slate"} />
    </div>

    <h3 className="text-slate-800 font-semibold text-sm truncate">{asset.name}</h3>

    <div className="mt-2 space-y-1">
      {asset.assetTag && (
        <p className="text-slate-500 text-xs flex items-center gap-1.5">
          <FiTag className="h-3.5 w-3.5" />
          {asset.assetTag}
        </p>
      )}
      {asset.assignedTo && (
        <p className="text-slate-500 text-xs flex items-center gap-1.5">
          <FiUser className="h-3.5 w-3.5" />
          {asset.assignedTo?.name || asset.assignedTo}
        </p>
      )}
    </div>
  </div>
);

export default AssetCard;
