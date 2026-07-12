// src/components/common/Badge.jsx
const colorMap = {
  green:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  red:    "bg-red-500/10 text-red-400 border-red-500/20",
  amber:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  blue:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  slate:  "bg-white/5 text-slate-300 border-white/10",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
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
