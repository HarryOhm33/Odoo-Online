// src/pages/app/reports/Reports.jsx
import PageHeader from "../../../components/common/PageHeader";
import EmptyState from "../../../components/common/EmptyState";
import { FiFileText, FiDownload } from "react-icons/fi";

const reportTypes = [
  { title: "Asset Utilization Report",    desc: "Overview of asset usage and allocation efficiency" },
  { title: "Maintenance Summary",         desc: "Breakdown of maintenance requests by status and priority" },
  { title: "Booking Analytics",           desc: "Resource booking patterns and utilization rates" },
  { title: "Audit Compliance Report",     desc: "Audit cycle completion and compliance status" },
  { title: "Employee Asset Report",       desc: "Assets assigned per employee across the organization" },
];

const Reports = () => (
  <div className="space-y-5">
    <PageHeader
      title="Reports"
      subtitle="Generate and download organizational reports"
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reportTypes.map((r) => (
        <div key={r.title} className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <FiFileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-800 font-semibold text-sm">{r.title}</h3>
            <p className="text-slate-500 text-xs mt-1">{r.desc}</p>
          </div>
          <button className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-medium">
            <FiDownload className="h-3.5 w-3.5" />
            Generate Report
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default Reports;
