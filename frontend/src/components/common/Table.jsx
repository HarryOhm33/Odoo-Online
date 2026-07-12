// src/components/common/Table.jsx
// Generic ERP data table. Pass columns config + rows array.
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const Table = ({
  columns,    // [{ key, label, render?, className? }]
  rows,       // array of data objects
  loading = false,
  emptyMessage = "No records found",
  keyField = "_id",
  onRowClick,
}) => {
  if (loading) return <LoadingSpinner />;

  if (!rows || rows.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden h-full flex flex-col">
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-200 uppercase tracking-wide whitespace-nowrap ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row, idx) => (
              <tr
                key={row[keyField] || idx}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-white/5 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-slate-200 ${col.className || ""}`}
                  >
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
