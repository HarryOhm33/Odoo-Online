// src/components/common/EmptyState.jsx
import { FiInbox } from "react-icons/fi";

const EmptyState = ({ message = "No data found", icon: Icon = FiInbox, action }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 py-16 flex flex-col items-center justify-center text-center px-6">
      <Icon className="h-10 w-10 text-slate-300 mb-3" />
      <p className="text-slate-400 text-sm font-medium">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
