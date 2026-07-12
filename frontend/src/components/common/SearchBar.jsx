// src/components/common/SearchBar.jsx
import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && (
        <button
          onClick={onClear || (() => onChange(""))}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
