// src/components/common/StatCard.jsx
// KPI card for dashboards. Reused across Admin and Employee portals.
const colorMap = {
  blue:    { bg: "bg-blue-500/10",    icon: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]",    text: "text-blue-400"    },
  green:   { bg: "bg-emerald-500/10", icon: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]", text: "text-emerald-400" },
  amber:   { bg: "bg-amber-500/10",   icon: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]",   text: "text-amber-400"   },
  red:     { bg: "bg-red-500/10",     icon: "bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]",     text: "text-red-400"     },
  violet:  { bg: "bg-violet-500/10",  icon: "bg-gradient-to-br from-violet-500 to-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.5)]",  text: "text-violet-400"  },
  slate:   { bg: "bg-slate-500/10",   icon: "bg-gradient-to-br from-slate-600 to-slate-800 shadow-[0_0_15px_rgba(100,116,139,0.5)]",   text: "text-slate-400"   },
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
    <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-5 hover:bg-white/5 transition-all duration-300 relative overflow-hidden group">
      {/* Subtle background glow effect on hover */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 ${c.bg} rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-sm font-medium truncate">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-white/10 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-2xl font-bold text-white mt-1">{value ?? "—"}</p>
          )}
          {subtitle && (
            <p className="text-slate-400 text-xs mt-1 truncate">{subtitle}</p>
          )}
          {change && (
            <p className="text-xs mt-1.5">
              <span className={change.startsWith("+") ? "text-emerald-400" : "text-red-400"}>
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
