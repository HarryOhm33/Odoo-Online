import { FiFilter } from "react-icons/fi";

const FilterBar = ({ filters }) => {
  // filters is an array of objects: { label, value, options: [{label, value}], onChange }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <FiFilter className="w-4 h-4" />
        <span className="font-medium">Filters:</span>
      </div>
      {filters.map((filter, idx) => (
        <select
          key={idx}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default FilterBar;
