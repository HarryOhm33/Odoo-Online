// src/components/features/assets/AssetCard.jsx
import Badge from "../../common/Badge";
import { FiBox, FiTag, FiUser } from "react-icons/fi";

const statusColor = { Available: "green", Allocated: "blue", Maintenance: "amber", Retired: "red" };

const AssetCard = ({ asset, onClick, onEdit }) => (
  <div
    onClick={() => onClick?.(asset)}
    className={`bg-[#0B172A] rounded-lg border border-white/10 shadow-sm p-4 relative ${onClick ? "cursor-pointer hover:shadow-md hover:border-white/20 transition-all" : ""}`}
  >
    {onEdit && (
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(asset); }}
        className="absolute bottom-4 right-4 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
      >
        Edit
      </button>
    )}
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <FiBox className="h-5 w-5 text-blue-400" />
      </div>
      <Badge label={asset.status || "Unknown"} color={statusColor[asset.status] || "slate"} />
    </div>

    <h3 className="text-white font-semibold text-sm truncate">{asset.name}</h3>

    <div className="mt-2 space-y-1">
      {asset.assetTag && (
        <p className="text-slate-400 text-xs flex items-center gap-1.5">
          <FiTag className="h-3.5 w-3.5" />
          {asset.assetTag}
        </p>
      )}
      {asset.assignedTo && (
        <p className="text-slate-400 text-xs flex items-center gap-1.5">
          <FiUser className="h-3.5 w-3.5" />
          {asset.assignedTo?.name || asset.assignedTo}
        </p>
      )}
    </div>
  </div>
);

export default AssetCard;
