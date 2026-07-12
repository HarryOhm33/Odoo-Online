// src/components/common/StatCard.jsx
// KPI card for dashboards. Reused across Admin and Employee portals.
const colorMap = {
  blue:    { bg: "bg-blue-50",    icon: "bg-blue-600",    text: "text-blue-600"    },
  green:   { bg: "bg-emerald-50", icon: "bg-emerald-600", text: "text-emerald-600" },
  amber:   { bg: "bg-amber-50",   icon: "bg-amber-500",   text: "text-amber-600"   },
  red:     { bg: "bg-red-50",     icon: "bg-red-600",     text: "text-red-600"     },
  violet:  { bg: "bg-violet-50",  icon: "bg-violet-600",  text: "text-violet-600"  },
  slate:   { bg: "bg-slate-50",   icon: "bg-slate-700",   text: "text-slate-700"   },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  change,       // e.g. "+12%"
  changeLabel,  // e.g. "from last month"
  loading = false,
}) => {
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-slate-500 text-sm font-medium truncate">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-slate-100 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-2xl font-bold text-slate-800 mt-1">{value ?? "—"}</p>
          )}
          {subtitle && (
            <p className="text-slate-400 text-xs mt-1 truncate">{subtitle}</p>
          )}
          {change && (
            <p className="text-xs mt-1.5">
              <span className={change.startsWith("+") ? "text-emerald-600" : "text-red-500"}>
                {change}
              </span>
              {changeLabel && (
                <span className="text-slate-400 ml-1">{changeLabel}</span>
              )}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-10 h-10 ${c.icon} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
