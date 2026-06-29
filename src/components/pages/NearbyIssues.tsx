import { useEffect, useState } from 'react';
import { 
  MapPin, 
  MessageSquare, 
  Vote, 
  CheckCircle, 
  Search, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  Filter,
  Check,
  Building
} from 'lucide-react';
import { Issue } from '../../types';

interface NearbyIssuesProps {
  issues: Issue[];
  onUpvoteIssue: (id: string) => Promise<void>;
  onVerifyIssue: (id: string) => Promise<void>;
  onAddComment: (issueId: string, author: string, message: string) => Promise<void>;
}

export default function NearbyIssues({ issues, onUpvoteIssue, onVerifyIssue, onAddComment }: NearbyIssuesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  
const [reports, setReports] = useState<any[]>([]);

useEffect(() => {
  const savedReports = JSON.parse(
    localStorage.getItem('actiwardReports') || '[]'
  );

  setReports(savedReports);
}, []);

  
  // Filter issues
  const filteredIssues = reports.filter((issue: any) => {
    const matchesCat = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || issue.priority === selectedPriority;
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesPriority && matchesSearch;
  });


 const activeIssue = reports.find(
  (i: any) => String(i.id) === String(activeIssueId)
);

console.log("Reports:", reports);
console.log("Selected ID:", activeIssueId);
console.log("Active Issue:", activeIssue);



  const handleCommentSubmit = async (e: React.FormEvent, issueId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await onAddComment(issueId,'current logged in User', commentText);
      setCommentText('');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingComment(false);
    }
  };

  

  return (
    <div className="space-y-6" id="nearby-issues-panel">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          Nearby Issues <MapPin className="h-6 w-6 text-emerald-800" />
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore, upvote, or verify reported safety hazards and civic blockages in your immediate neighborhood.
        </p>
      </div>

      {/* Filter and search board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white rounded-xl shadow-xs border border-slate-100 p-4">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search keyword, ward, or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/50 rounded-lg border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/50 rounded-lg border border-slate-200 text-xs text-slate-600 focus:border-emerald-600 focus:outline-hidden capitalize"
          >
            <option value="all">All Categories</option>
            <option value="pothole">🚧 Potholes</option>
            <option value="garbage">🗑️ Garbage</option>
            <option value="water_leakage">💧 Water Leakage</option>
            <option value="streetlight">💡 Streetlights</option>
            <option value="drainage">🌪️ Drainage</option>
            <option value="other">📍 Other</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select 
            value={selectedPriority} 
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/50 rounded-lg border border-slate-200 text-xs text-slate-600 focus:border-emerald-600 focus:outline-hidden capitalize"
          >
            <option value="all">All Priorities</option>
            <option value="high">🚨 High Priority</option>
            <option value="medium">⚠️ Medium Priority</option>
            <option value="low">🌱 Low Priority</option>
          </select>
        </div>
      </div>

      {/* Dual Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Issues List Column */}
        <div className="lg:col-span-7 space-y-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div 
                key={issue.id}
                onClick={() => setActiveIssueId(issue.id)}
                className={`rounded-xl bg-white p-5 border shadow-xs transition duration-200 cursor-pointer flex flex-col justify-between ${
                  activeIssueId === issue.id 
                    ? 'border-emerald-600 ring-2 ring-emerald-500/15' 
                    : 'border-slate-100 hover:border-emerald-200 hover:shadow-sm'
                }`}
              >
                <div className="flex gap-4 items-start">
                  {issue.image ? (
                    <img 
                      src={issue.image} 
                      alt={issue.title}
                      className="w-20 h-20 object-cover rounded-lg border border-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 text-emerald-700 shrink-0">
                      <Building className="h-6 w-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider capitalize">
                        {issue.category.replace('_', ' ')}
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

                    <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight hover:text-emerald-700 transition">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-slate-150 text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-medium text-slate-500">
                    <MapPin className="h-4.5 w-4.5 text-emerald-700 shrink-0" />
                    <span className="truncate max-w-[200px]">{issue.location}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                      <MessageSquare className="h-4 w-4" /> {issue.comments?.length || 0}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                      <Vote className="h-4 w-4" /> {issue.upvotes || 0}
                    </span>
                    <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      Verified ×{issue.verifiedCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 p-12 text-center text-slate-400">
              <AlertCircle className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-600 text-sm">No Active Tickets Found</p>
              <p className="text-xs mt-1 text-slate-400">Try adjusting your filters or checking adjacent zones.</p>
            </div>
          )}
        </div>

        {/* Detailed Interactive Panel Drawer */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-150 p-5 md:p-6 sticky top-6 shadow-xs">
          {activeIssue ? (
            <div className="space-y-5" id="nearby-details-box">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase">
                    {activeIssue.category.replace('_', ' ')}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold capitalize ${
                    activeIssue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                    activeIssue.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                    activeIssue.status === 'verified' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {activeIssue.status}
                  </span>
                </div>

                <h2 className="text-lg font-black text-slate-800 leading-snug">
                  {activeIssue.title}
                </h2>
              </div>

              {/* Photo representation */}
              {activeIssue.image && (
                <div className="relative rounded-lg overflow-hidden border border-slate-100">
                  <img 
                    src={activeIssue.image} 
                    alt={activeIssue.title}
                    className="w-full h-44 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Info grid */}
              <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="h-4.5 w-4.5 text-emerald-700 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-700">Location Address</p>
                    <p className="text-slate-500 mt-0.5">{activeIssue.location}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-500">
                  <span>Reported By: <strong>{activeIssue.user}</strong></span>
                  <span>Date: <strong>{new Date(activeIssue.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>

              {/* Main text message details */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Citizen Note</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                  “{activeIssue.description}”
                </p>
              </div>

              {/* Direct Interactions widget */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button 
                  onClick={() => onUpvoteIssue(activeIssue.id)}
                  className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    activeIssue.isUpvotedByUser 
                      ? 'bg-emerald-800 text-white border-emerald-800' 
                      : 'bg-emerald-50 text-emerald-850 border-emerald-100 hover:bg-emerald-100'
                  }`}
                >
                  <Vote className="h-4 w-4" />
                  {activeIssue.isUpvotedByUser ? 'Upvoted ✓' : 'Upvote Ticket'} ({activeIssue.upvotes})
                </button>

                <button 
                  onClick={() => onVerifyIssue(activeIssue.id)}
                  className={`py-2 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    activeIssue.isVerifiedByUser 
                      ? 'bg-amber-500 text-white border-amber-500' 
                      : 'bg-amber-50 text-amber-850 border-amber-100 hover:bg-amber-100'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  {activeIssue.isVerifiedByUser ? 'Verified ✓' : 'Verify Project'} ({activeIssue.verifiedCount}/5)
                </button>
              </div>

              {/* Live Comments Feed Section */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center justify-between">
                  <span>Comments ({activeIssue.comments?.length || 0})</span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">Civic tracking logs</span>
                </h4>
                {/* Comment feeds container */}
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {(activeIssue.comments?.length || 0) > 0 ? (
  activeIssue.comments?.map((comment) => (
    <div
      key={comment.id}
      className="bg-slate-50 p-2.5 rounded-lg text-slate-600 space-y-1 text-xs"
    >
      <div className="flex items-center justify-between font-bold text-slate-700">
        <span>{comment.author}</span>
        <span className="text-[9px] text-slate-400 font-normal">
          {new Date(comment.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      <p>{comment.message}</p>
    </div>
  ))
) : (
  <p className="text-xs text-slate-400 py-2 italic">
    No comments filed. Be the first to coordinate!
  </p>
)}
                </div>

                {/* Send comments container */}
                <form onSubmit={(e) => handleCommentSubmit(e, activeIssue.id)} className="flex gap-1">
                  <input 
                    type="text" 
                    placeholder="Coordinate with ward workers..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="px-3 bg-emerald-800 text-white font-bold rounded-lg text-xs hover:bg-emerald-950 shrink-0 transition"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <MapPin className="h-10 w-10 mb-2.5 text-slate-300" />
              <p className="font-bold text-slate-500 text-sm">Select a Ticket</p>
              <p className="text-xs mt-1 text-slate-400">Pick any active report card from the list viewport to read notes, look at files, verify evidence, or run comments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
