import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
// @ts-ignore: CSS module import for react-toastify
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from 'react';
import { 
  FolderHeart, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Issue } from '../../types';


interface MyReportsProps {
  issues: Issue[];
  setActiveTab: (tab: string) => void;
}

export default function MyReports({ issues, setActiveTab }: MyReportsProps) {
  // Filter issues reported by simulated active user 
 const [myIssues, setMyIssues] = useState<any[]>([]);
 const [searchQuery, setSearchQuery] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [loading, setLoading] = useState(false);

useEffect(() => {
  const savedUser = JSON.parse(
    localStorage.getItem('actiwardUser') || '{}'
  );

  const reports = JSON.parse(
    localStorage.getItem('actiwardReports') || '[]'
  );

  const userReports = reports.filter(
    (report: any) => report.user === savedUser.name
  );

  setMyIssues(userReports);
}, []);

const totalReports = myIssues.length;

const pendingReports = myIssues.filter(
  (r: any) => r.status === "Pending"
).length;

const resolvedReports = myIssues.filter(
  (r: any) => r.status === "Resolved"
).length;

const totalPoints = totalReports * 15;

const [editingReport, setEditingReport] = useState<any>(null);
const [editTitle, setEditTitle] = useState("");
const [editDescription, setEditDescription] = useState("");
const [editLocation, setEditLocation] = useState("");

const handleDelete = (id: number) => {
  const reports = JSON.parse(
    localStorage.getItem("actiwardReports") || "[]"
  );

  const deletedReport = reports.find(
    (report: any) => report.id === id
  );

  const updatedReports = reports.filter(
    (report: any) => report.id !== id
  );
  localStorage.setItem(
    "actiwardReports",
    JSON.stringify(updatedReports)
  );

  // Add a single notification entry for the deletion
  const notifications = JSON.parse(
    localStorage.getItem("actiwardNotifications") || "[]"
  );


  notifications.unshift({
    id: Date.now().toString(),
    title: "Report Deleted",
    message: `Your report "${deletedReport?.title || 'Untitled'}" was deleted successfully. It has been removed from your reports`,
    type: "status_change",
    timestamp: new Date().toISOString(),
    read: false
  });

  localStorage.setItem(
    "actiwardNotifications",
    JSON.stringify(notifications)
  );

  setMyIssues(
  updatedReports.filter(
    (report: any) =>
      report.user ===
      JSON.parse(
        localStorage.getItem("actiwardUser") || "{}"
      ).name
  )
);

  toast.success("Report deleted successfully!");
  window.location.reload();

};

const handleEdit = (report: any) => {
  setEditingReport(report);

  setEditTitle(report.title);
  setEditDescription(report.description);
  setEditLocation(report.location);
};
const handleSave = () => {
  const reports = JSON.parse(
    localStorage.getItem("actiwardReports") || "[]"
  );

  const notifications = JSON.parse(
    localStorage.getItem("actiwardNotifications") || "[]"
  );

  notifications.unshift({
    id: Date.now().toString(),
    title: "Report Updated",
    message: `Your report "${editingReport.title}" was updated successfully. It has been modified in your reports`,
    type: "status_change",
    timestamp: new Date().toISOString(),
    read: false
  });

  localStorage.setItem(
    "actiwardNotifications",
    JSON.stringify(notifications)
  );

  const updatedReports = reports.map((report: any) => {
    if (report.id === editingReport.id) {
      return {
        ...report,
        title: editTitle,
        description: editDescription,
        location: editLocation,
      };
    }

    return report;
  });

  localStorage.setItem(
    "actiwardReports",
    JSON.stringify(updatedReports)
  );

  setMyIssues(
    updatedReports.filter(
      (r: any) =>
        r.user ===
        JSON.parse(
          localStorage.getItem("actiwardUser") || "{}"
        ).name
    )
  );

  setEditingReport(null);

  toast.success("Report updated successfully!");
};


console.log("My Reports:", myIssues);

  function downloadPDF(
  event: React.MouseEvent<HTMLButtonElement>
): void {

  event.preventDefault();

  const doc = new jsPDF();

  const savedUser = JSON.parse(
    localStorage.getItem("actiwardUser") || "{}"
  );

  const reports = JSON.parse(
    localStorage.getItem("actiwardReports") || "[]"
  );

  const myReports = reports.filter(
    (r:any)=>r.user===savedUser.name
  );

  // ===== Header =====

  doc.setFillColor(16,185,129);
  doc.rect(0,0,210,30,"F");

  doc.setFontSize(24);
  doc.setTextColor(255,255,255);
  doc.text("ACTIWARD AI",105,15,{align:"center"});

  doc.setFontSize(11);
  doc.text("Smart Civic Reporting Platform",105,23,{align:"center"});

  // ===== Title =====

  doc.setTextColor(0,0,0);

  doc.setFontSize(18);

  doc.text("Citizen Report Summary",15,45);

  // ===== Citizen Information =====

  doc.setFillColor(240,248,255);

  doc.roundedRect(15,52,180,42,3,3,"F");

  doc.setFontSize(12);

  doc.text(`Citizen : ${savedUser.name}`,20,63);

  doc.text(`Email : ${savedUser.email}`,20,71);

  doc.text(`Phone : ${savedUser.phone}`,20,79);

  doc.text(`Area : ${savedUser.area}`,20,87);

  // ===== Report Summary =====

  doc.setFillColor(232,245,233);

  doc.roundedRect(15,102,180,32,3,3,"F");

  doc.setFontSize(13);

  doc.text("REPORT SUMMARY",20,112);
doc.setFontSize(11);

doc.text(`Total Reports : ${totalReports}`,20,120);

doc.text(`Pending Reports : ${pendingReports}`,20,127);

doc.text(`Resolved Reports : ${resolvedReports}`,20,134);

doc.text(`Citizen Points : ${totalPoints}`,110,120);

doc.text(
`Generated On : ${new Date().toLocaleString()}`,
110,
127
);

    const filteredIssues = myIssues.filter(
      (issue) =>
        (statusFilter === "All" || issue.status === statusFilter) &&
        (issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filteredIssues.length === 0) {
      toast.error("No reports available to export.");
      return;
    }

    doc.setDrawColor(180);

doc.line(15,140,195,140);

doc.setFontSize(14);

doc.setTextColor(16,185,129);

doc.text("Detailed Issue Reports",15,148);

doc.setTextColor(0,0,0);

let y = 158;
    filteredIssues.forEach((issue,index) => {

      if (y > 240) {
  doc.addPage();

  y = 20;
}

   doc.setFontSize(14);
   doc.setFillColor(16,185,129);

doc.roundedRect(18,y-8,25,8,2,2,"F");

doc.setTextColor(255);

doc.setFontSize(10);

doc.text(`Issue ${index+1}`,21,y-2);

doc.setTextColor(0);

doc.setFontSize(15);

doc.text(issue.title,50,y);

   doc.setFontSize(11);

   doc.text(
      `Category : ${issue.category}`,
      20,
      y+8
   );

   doc.text(
      `Status : ${issue.status}`,
      20,
      y+16
   );

   doc.text(
      `Location : ${issue.location}`,
      20,
      y+24
   );

   const description = doc.splitTextToSize(
    issue.description,
    165
);

doc.text(
    description,
    20,
    y + 32
);

   y += 55 + description.length * 6;

   doc.setFontSize(10);

doc.setTextColor(120);

doc.setDrawColor(220);

doc.line(
    20,
    y + 48 + description.length * 6,
    190,
    y + 48 + description.length * 6
);

doc.text(
`Filed On : ${issue.createdAt}`,
20,
y + 32 + description.length * 6
);

doc.setTextColor(0);



});

const totalPages = doc.getNumberOfPages();

for (let i = 1; i <= totalPages; i++) {

  doc.setFontSize(9);

doc.setTextColor(120);

doc.text(
`Page ${i} of ${totalPages}`,
180,
290
);

}

setLoading(false);

    doc.save("my-civic-reports.pdf");
  }


  return (
    <div className="space-y-6" id="my-reports-panel">
      <div className="flex items-center justify-between">

  <div>
    <h1 className="text-2xl font-black text-slate-800">
      My Civic Reports
    </h1>

    <p className="text-slate-500 text-sm">
      Monitor response progressions and manage your reports.
    </p>
  </div>

 <button
  onClick={downloadPDF}
  disabled={loading}
    className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-lg font-semibold"
  >
    {loading ? "Generating PDF..." : "Download PDF"}
  </button>

</div>
<div className="mb-5">
  <input
    type="text"
    placeholder="Search your reports..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
  />
</div>
<ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  theme="colored"
/>

      {myIssues.length > 0 ? (
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar breakdown of points contribution */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-900 rounded-2xl text-white p-5 border border-slate-800 space-y-4">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold tracking-widest uppercase px-2 py-0.5 rounded">
                Profile Impact Breakdown
              </span>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                  <span className="text-xs text-slate-300">Total reported tickets</span>
                  <span className="font-extrabold text-white text-base">{myIssues.length}</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                  <span className="text-xs text-slate-300">Cleanly resolved</span>
                  <span className="font-extrabold text-emerald-400 text-base">
                    {myIssues.filter(i => i.status === 'Resolved').length}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                  <span className="text-xs text-slate-300">Verification Rate</span>
                  <span className="font-extrabold text-amber-300 text-base">100%</span>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-3 border border-white/10 flex items-center gap-2 text-xs">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Excellent submission quality score. Your reports are verified within hours.</span>
              </div>
            </div>
          </div>
          {editingReport && (
  <div className="bg-white p-5 rounded-xl border mb-5">
    <h2 className="font-bold text-lg mb-4">
      Edit Report
    </h2>

    <input
      className="w-full border p-2 rounded mb-3"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      placeholder="Title"
    />

    <textarea
      className="w-full border p-2 rounded mb-3"
      value={editDescription}
      onChange={(e) => setEditDescription(e.target.value)}
      placeholder="Description"
    />

    <input
      className="w-full border p-2 rounded mb-3"
      value={editLocation}
      onChange={(e) => setEditLocation(e.target.value)}
      placeholder="Location"
    />

    <button
      onClick={handleSave}
      className="bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      {loading ? "Saving..." : "Save Changes"}
    </button>
  </div>
)}

          {/* Active reported files list */}
          <div className="md:col-span-2 space-y-4">
            {myIssues
              .filter(issue =>
(statusFilter==="All" || issue.status===statusFilter) &&
(
issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
issue.category.toLowerCase().includes(searchQuery.toLowerCase())
)
)

              .map((issue) => (

              <div 
                key={issue.id}
                className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-wrap md:flex-nowrap gap-5 items-start justify-between hover:border-emerald-200 transition"
              >
                {issue.image && (
                  <img 
                    src={issue.image} 
                    alt={issue.title}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider capitalize">
                      {issue.category.substring(0, 15).replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      issue.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                      issue.status === 'verified' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {issue.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                    {issue.title}
                  </h3>
{issue.aiSeverity && (
  <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
    <p className="text-sm">
      <strong>🤖 AI Severity:</strong> {issue.aiSeverity}
    </p>

    <p className="text-sm">
      <strong>🏢 Department:</strong> {issue.aiDepartment}
    </p>

    <p className="text-sm">
      <strong>🎯 Confidence:</strong> {issue.aiConfidence}%
    </p>
    <p className="mt-2">
<strong>Recommended Action:</strong>
</p>

<p>
{issue.aiRecommendedAction || "No recommendation available"}
</p>
     <p className="text-sm mt-2">
      <strong>Summary:</strong>
      <br />
      {issue.aiSummary}
    </p>
    
  </div>
)}

                  
                  <div className="flex gap-3 mt-3">
<button
  onClick={() => handleEdit(issue)}
  className="mt-2 ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
>
  Edit Report
</button>

  <button
  onClick={() => handleDelete(issue.id)}
  className="text-red-600 font-bold"
>
  🗑 Delete
</button>

</div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-1">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {issue.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Filed {issue.createdAt}
                    </span>
                  </div>

              
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center max-w-md mx-auto space-y-4">
          <FileText className="h-12 w-12 mx-auto text-slate-300" />
          <p className="font-extrabold text-slate-800 text-base">You Haven't Reported Any Issues Yet</p>
          <p className="text-xs text-slate-400">Join your ward community and start reporting to civic issues clean up road defects, garbage, or pipe leakages now!</p>
          <button 
            onClick={() => setActiveTab('report')}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white font-bold rounded-lg text-xs transition"
          >
            File Your First Report
          </button>
        </div>
      )}
    </div>
  );
}
