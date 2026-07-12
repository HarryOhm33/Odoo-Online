// src/components/common/Badge.jsx
const colorMap = {
  green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  red:    "bg-red-50 text-red-700 border-red-200",
  amber:  "bg-amber-50 text-amber-700 border-amber-200",
  blue:   "bg-blue-50 text-blue-700 border-blue-200",
  slate:  "bg-slate-100 text-slate-700 border-slate-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
};

const Badge = ({ label, color = "slate", dot = false }) => {
  const c = colorMap[color] || colorMap.slate;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${c}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
    </span>
  );
};

export default Badge;
