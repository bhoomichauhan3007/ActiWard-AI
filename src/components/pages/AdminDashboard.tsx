import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { 
  ShieldAlert, 
  Settings, 
  MapPin, 
  CheckCircle, 
  Clock, 
  FileText, 
  FolderCheck,
  ChevronRight,
  TrendingDown,
  Wrench,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { Issue, IssueStatus } from '../../types';

interface AdminDashboardProps {
  issues: Issue[];
  onUpdateStatus: (id: string, newStatus: IssueStatus) => Promise<void>;
}

export default function AdminDashboard({ issues, onUpdateStatus }: AdminDashboardProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [priorityFilter, setPriorityFilter] = useState("all");
const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);


const reports = issues as any[];

const highSeverityCount = reports.filter(
  r => r.aiSeverity === "High"
).length;

const departmentCount: Record<string, number> = {};

reports.forEach(report => {
  if (report.aiDepartment) {
    departmentCount[report.aiDepartment] =
      (departmentCount[report.aiDepartment] || 0) + 1;
  }
});

const mostAssignedDepartment =
  Object.keys(departmentCount).length
    ? Object.keys(departmentCount).reduce((a, b) =>
        departmentCount[a] > departmentCount[b] ? a : b
      )
    : "N/A";

const categoryCount: Record<string, number> = {};

reports.forEach(report => {
  categoryCount[report.category] =
    (categoryCount[report.category] || 0) + 1;
});

const mostReportedCategory =
  Object.keys(categoryCount).length
    ? Object.keys(categoryCount).reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b
      )
    : "N/A";

const averageConfidence = reports.length
  ? reports.reduce((sum, r) => sum + (r.confidence || 0), 0) / reports.length
  : 0;

const categoryData = Object.keys(categoryCount).map((key) => ({
  name: key.replace("_", " "),
  value: categoryCount[key],
}));

const statusData = [
  {
    name: "Reported",
    value: reports.filter((r) => r.status === "reported").length,
  },
  {
    name: "Verified",
    value: reports.filter((r) => r.status === "verified").length,
  },
  {
    name: "Dispatched",
    value: reports.filter((r) => r.status === "dispatched").length,
  },
  {
    name: "Resolved",
    value: reports.filter((r) => r.status === "resolved").length,
  },
];

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];
  reports.length
    ? Math.round(
        reports.reduce(
          (sum, r) =>
            sum +
            Number(
              String(r.aiConfidence || "0").replace("%", "")
            ),
          0
        ) / reports.length
      )
    : 0;


const highSeverity = issues.filter(
  (i: any) => i.aiSeverity === "High"
).length;

const mediumSeverity = issues.filter(
  (i: any) => i.aiSeverity === "Medium"
).length;

const lowSeverity = issues.filter(
  (i: any) => i.aiSeverity === "Low"
).length;

const sanitationCount = issues.filter(
  (i: any) => i.aiDepartment === "Sanitation Department"
).length;

const publicWorksCount = issues.filter(
  (i: any) => i.aiDepartment === "Public Works"
).length;


  const handleStatusChange = async (issueId: string, status: IssueStatus) => {
    setUpdatingId(issueId);
    setSuccessMsg('');
    try {
      await onUpdateStatus(issueId, status);
      setSuccessMsg(`Successfully updated ticket and generated automated notifying comments.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };
const filteredIssues = issues.filter((issue) => {

const matchesSearch =
issue.title.toLowerCase().includes(search.toLowerCase()) ||
issue.location.address.toLowerCase().includes(search.toLowerCase());

const matchesStatus =
statusFilter==="all" ||
issue.status===statusFilter;

const matchesPriority =
priorityFilter==="all" ||
issue.priority===priorityFilter;

return matchesSearch &&
matchesStatus &&
matchesPriority;

});

  return (
    <div className="space-y-6" id="admin-dashboard-panel">
      {/* Admin header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Admin dispatcher console <Settings className="h-6 w-6 text-emerald-800" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review incoming problems faced by perople in your municipality and 
            dispatch repair crews to resolve them.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
  <h3 className="font-bold text-emerald-700">
    Welcome Officer 👋
  </h3>

  <p className="text-sm text-slate-600 mt-1">
    You currently have {issues.length} active citizen reports waiting for review.
  </p>
</div>

        {/* Auth level status card */}
        <span className="inline-flex items-center gap-1 bg-amber-100 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold leading-none shrink-0">
          🔑 Municipal Officer Auth: Level 4
          <div className="mt-2 text-xs text-slate-500">
  Last Updated:
  {new Date().toLocaleString()}
</div>
        </span>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-210 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Admin quick counts */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 mt-6">
  <h2 className="text-xl font-bold mb-4">
    🤖 AI Predictive Insights
  </h2>

  <ul className="space-y-3 text-slate-700">

  <li>
    📂 Most reported category:
    <strong> {mostReportedCategory.replace("_"," ")}</strong>
  </li>

  <li>
    🚨 High severity issues:
    <strong> {highSeverityCount}</strong>
  </li>

  <li>
    🏢 Department with highest workload:
    <strong> {mostAssignedDepartment}</strong>
  </li>

  <li>
    🤖 AI average confidence:
    <strong> {averageConfidence}%</strong>
  </li>

  <li>
    💡 Recommendation:
    Deploy additional staff to
    <strong> {mostAssignedDepartment}</strong>
    {" "}to reduce pending complaints.
  </li>

</ul>
</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

  <div className="bg-white rounded-xl shadow p-4 border">
    <p className="text-xs text-slate-500">
      📂 Most Reported
    </p>

    <h3 className="font-bold text-lg text-emerald-700">
      {mostReportedCategory}
    </h3>
  </div>

  <div className="bg-white rounded-xl shadow p-4 border">
    <p className="text-xs text-slate-500">
      🚨 High Severity
    </p>

    <h3 className="font-bold text-lg text-red-600">
      {highSeverityCount}
    </h3>
  </div>

  <div className="bg-white rounded-xl shadow p-4 border">
    <p className="text-xs text-slate-500">
      🏢 Top Department
    </p>

    <h3 className="font-bold text-lg text-blue-700">
      {mostAssignedDepartment}
    </h3>
  </div>

  <div className="bg-white rounded-xl shadow p-4 border">
    <p className="text-xs text-slate-500">
      🤖 Avg AI Confidence
    </p>

    <h3 className="font-bold text-lg text-purple-700">
      {averageConfidence}%
    </h3>
  </div>

</div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] uppercase font-bold text-slate-400">📂 Master Tickets</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{issues.length}</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] uppercase font-bold text-slate-400">🚧 Awaiting Dispatch</p>
          <p className="text-2xl font-black text-blue-700 mt-1">
            {issues.filter(i => i.status === 'verified').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] uppercase font-bold text-slate-400">🔧 Under Repair</p>
          <p className="text-2xl font-black text-purple-700 mt-1">
            {issues.filter(i => i.status === 'dispatched').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] uppercase font-bold text-slate-400">✅ Resolved</p>
          <p className="text-2xl font-black text-emerald-800 mt-1">
            {issues.filter(i => i.status === 'resolved').length}
          </p>
        </div>
      </div>
<div className="bg-red-50 border border-red-200 rounded-xl p-5">
  <h2 className="text-lg font-bold text-red-700">
    🚨 High Priority Alerts
  </h2>

  <p className="text-sm text-slate-600 mt-2">
    {
      issues.filter(issue => issue.priority === "high").length
    } high priority complaints require immediate attention.
  </p>
</div>

<div className="grid md:grid-cols-2 gap-6 mb-6">

  <div className="bg-white rounded-2xl shadow border p-5">

    <h2 className="font-bold text-lg mb-4">
      📂 Reports by Category
    </h2>

    <ResponsiveContainer width="100%" height={280}>

      <PieChart>

        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          label
        >

          {categoryData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

  <div className="bg-white rounded-2xl shadow border p-5">

    <h2 className="font-bold text-lg mb-4">
      📈 Reports by Status
    </h2>

    <ResponsiveContainer width="100%" height={280}>

      <BarChart data={statusData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="value" fill="#10B981" />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>

      {/* Primary Issue Management Ledger */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="p-4 border-b border-slate-100 grid md:grid-cols-3 gap-3">

  <input
    type="text"
    placeholder="Search issue..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border rounded-lg px-3 py-2 text-sm"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border rounded-lg px-3 py-2 text-sm"
  >
    <option value="all">All Status</option>
    <option value="reported">Reported</option>
    <option value="verified">Verified</option>
    <option value="dispatched">Dispatched</option>
    <option value="resolved">Resolved</option>
  </select>

  <select
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
    className="border rounded-lg px-3 py-2 text-sm"
  >
    <option value="all">All Priority</option>
    <option value="high">High</option>
    <option value="medium">Medium</option>
    <option value="low">Low</option>
  </select>

</div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
            <FolderCheck className="h-4.5 w-4.5 text-emerald-700" /> Active Service Tickets ledger
          </h3>
          <span className="text-xs text-slate-400">Click actions to advance repair progress</span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div 
                key={issue.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition hover:bg-slate-50/55"
              >
                {/* Left ticket properties */}
                <div className="flex gap-4 items-start flex-1">
                  {issue.image ? (
  <img
    src={issue.image}
    alt={issue.title}
    className="w-24 h-24 rounded-xl object-cover border border-slate-200 shadow-sm"
    referrerPolicy="no-referrer"
  />
) : (
  <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
    No Image

  </div>
)}

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase font-mono">
                      #{issue.id}
                    </span>
                    <span className="text-[9px] bg-slate-50 text-slate-500 font-semibold px-2 py-0.5 rounded capitalize">
                      {issue.category.replace('_', ' ')}
                    </span>
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      issue.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                      issue.status === 'verified' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {issue.status}
                    </span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.3 rounded ${
                      issue.priority === 'high' ? 'bg-rose-50 text-rose-700' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {issue.priority}
                    </span>
                  </div>
{issue.image && (
<img
src={issue.image}
alt={issue.title}
className="w-24 h-24 rounded-xl object-cover border"
/>
)}
<p className="text-xs text-slate-400">
{(issue as any).createdAt ? new Date((issue as any).createdAt).toLocaleString() : ''}
</p>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight">
                    {issue.title}
                  </h4>
                  {(issue as any).aiSeverity && (
  <div className="mt-2 flex items-center gap-2">

    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        (issue as any).aiSeverity === "High"
          ? "bg-red-100 text-red-700"
          : (issue as any).aiSeverity === "Medium"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      🤖 AI Risk: {(issue as any).aiSeverity}
    </span>

  </div>
)}
                  {(issue as any).aiDepartment && (
  <div className="mt-2 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
    <span className="text-lg">🏢</span>

    <div>
      <p className="text-xs text-slate-500">
        AI Assigned Department
      </p>

      <p className="font-semibold text-emerald-700">
        {(issue as any).aiDepartment}
      </p>
    </div>
  </div>
)}
{(issue as any).aiConfidence && (
  <div className="mt-2 text-xs text-slate-600">
    🤖 AI Confidence:
    <span className="font-bold text-purple-700">
      {" "}
      {(issue as any).aiConfidence}
    </span>
  </div>
)}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {issue.location.address}
                    </span>
                    <div className="flex flex-col text-xs text-slate-500">
  <span>Reported by: {issue.reportedBy}</span>
  <span>
    {(issue as any).createdAt ? new Date((issue as any).createdAt).toLocaleString() : ''}
  </span>
  <p className="text-xs text-slate-400">
{(issue as any).email}
</p>
</div>

                  </div>
                </div>

                {/* Right quick dispatch transitions list */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {issue.status === 'reported' && (
                    <button
                      onClick={() => handleStatusChange(issue.id, 'verified')}
                      disabled={updatingId === issue.id}
                      className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-100 hover:bg-amber-100 rounded-lg text-[11px] font-bold cursor-pointer transition"
                    >
                      Verify ticket
                    </button>
                  )}

                  {issue.status !== 'dispatched' && issue.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusChange(issue.id, 'dispatched')}
                      disabled={updatingId === issue.id}
                      className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-100 hover:bg-blue-100 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1"
                    >
                      <Wrench className="h-3.5 w-3.5" /> {
updatingId===issue.id
?
"Dispatching..."
:
"Dispatch Crew"
}

                    </button>
                  )}

                  {issue.status !== 'resolved' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(issue.id, 'resolved')}
                        disabled={updatingId === issue.id}
                        className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-[11px] font-bold cursor-pointer hover:bg-emerald-950 transition flex items-center gap-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Mark Resolved
                      </button>
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-[11px] font-bold hover:bg-slate-900"
                      >
                        View Details
                      </button>
                    </>
                  )}

                  {issue.status === 'resolved' && (
                    <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg">✓ Resolved File</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400">
              <FileText className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-600">No issues found on ledger.</p>
            </div>
          )}
        </div>
      </div>
      {selectedIssue && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl w-[700px] p-6 shadow-2xl">

      <h2 className="text-2xl font-bold mb-5">
        Issue Details
      </h2>

      {selectedIssue.image && (
        <img
          src={selectedIssue.image}
          alt={selectedIssue.title}
          className="w-full h-64 object-cover rounded-xl mb-5"
        />
      )}

      <div className="space-y-3">

        <p><strong>Title:</strong> {selectedIssue.title}</p>

        <p><strong>Description:</strong> {selectedIssue.description}</p>

        <p><strong>Category:</strong> {selectedIssue.category}</p>

        <p><strong>Priority:</strong> {selectedIssue.priority}</p>

        <p><strong>Status:</strong> {selectedIssue.status}</p>

        <div className="mt-5 border-t pt-4">

  <h3 className="font-bold text-lg mb-3">
    📌 Activity Timeline
  </h3>

  <div className="space-y-3">

    <div className="flex items-center gap-3">
      <span>📝</span>
      <span>Report Submitted</span>
    </div>

    <div className="flex items-center gap-3">
      <span>🤖</span>
      <span>AI Classified Issue</span>
    </div>

    <div className="flex items-center gap-3">
      <span>🏢</span>
      <span>
        Assigned to {(selectedIssue as any).aiDepartment || "Municipal Department"}
      </span>
    </div>

    {selectedIssue.status !== "reported" && (
      <div className="flex items-center gap-3">
        <span>👷</span>
        <span>Crew Dispatched</span>
      </div>
    )}

    {selectedIssue.status === "resolved" && (
      <div className="flex items-center gap-3 text-green-600 font-semibold">
        <span>✅</span>
        <span>Issue Successfully Resolved</span>
      </div>
    )}

  </div>

</div>


        <p><strong>Location:</strong> {selectedIssue.location.address}</p>

        <p><strong>Reported By:</strong> {selectedIssue.reportedBy}</p>

      </div>
<div className="text-center mt-8 text-xs text-slate-400 border-t pt-4">
  ActiWard AI © 2026
  <br />
  Municipal Administration Dashboard
</div>

      <div className="flex justify-end mt-6">

        <button
          onClick={() => setSelectedIssue(null)}
          className="bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}
<div className="mt-10 text-center text-sm text-slate-500 border-t pt-4">

  <p className="font-semibold">
    🤖 ActiWard AI • Smart Civic Management Platform
  </p>

  <p>
    Powered by Google Gemini AI • Real-time Analytics • Community Driven
  </p>

</div>
    </div>
    
  );
}
