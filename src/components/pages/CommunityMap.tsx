import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Eye, 
  CheckCircle, 
  Compass, 
  Search, 
  Plus, 
  Vote, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Issue, IssueCategory, IssueStatus } from '../../types';

interface CommunityMapProps {
  issues: Issue[];
  onUpvoteIssue: (id: string) => Promise<void>;
  onVerifyIssue: (id: string) => Promise<void>;
}

export default function CommunityMap({ issues, onUpvoteIssue, onVerifyIssue }: CommunityMapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(issues[0] || null);

  // Filters logic
  const filteredIssues = issues.filter(issue => {
    const matchesCat = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const getMarkerColor = (status: IssueStatus) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-500 ring-emerald-500/30';
      case 'dispatched': return 'bg-blue-500 ring-blue-500/30';
      case 'verified': return 'bg-amber-500 ring-amber-500/30';
      default: return 'bg-slate-500 ring-slate-500/30';
    }
  };

  const getMarkerEmoji = (category: IssueCategory) => {
    switch (category) {
      case 'pothole': return '🚧';
      case 'garbage': return '🗑️';
      case 'water_leakage': return '💧';
      case 'streetlight': return '💡';
      case 'drainage': return '🌪️';
      default: return '📍';
    }
  };

  // Convert lat/lng coordinates to standard relative positions (percentage-based) on our styled vector map
  // Emerald Ward coordinate box is simulation:
  // Base: lat: 12.9600 to 12.9850, lng: 77.5800 to 77.6100
  const getMapPosition = (lat: number, lng: number) => {
    const latMin = 12.9600;
    const latMax = 12.9850;
    const lngMin = 77.5800;
    const lngMax = 77.6100;

    // Calculate percentage coordinates
    const top = 100 - ((lat - latMin) / (latMax - latMin)) * 100;
    const left = ((lng - lngMin) / (lngMax - lngMin)) * 100;

    // Clamp values
    return {
      top: `${Math.max(10, Math.min(85, top))}%`,
      left: `${Math.max(10, Math.min(85, left))}%`
    };
  };

  return (
    <div className="space-y-6" id="community-map-panel">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Community Map <Layers className="h-6 w-6 text-emerald-800" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time geospatial visualization of active, verified, and dispatched ward projects.
          </p>
        </div>

        {/* Status Legends */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 flex-wrap">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mr-1">Legend:</span>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-500" /><span>Reported</span></div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /><span>Verified</span></div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /><span>Dispatched</span></div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span>Resolved</span></div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="relative md:col-span-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search address or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/50 rounded-lg border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden"
          />
        </div>

        {/* Category select */}
        <div className="relative md:col-span-3">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/50 rounded-lg border border-slate-200 text-xs text-slate-600 focus:border-emerald-600 focus:outline-hidden capitalize"
          >
            <option value="all">All Categories</option>
            <option value="pothole">Potholes Only</option>
            <option value="garbage">Garbage dumps</option>
            <option value="water_leakage">Water Leakages</option>
            <option value="streetlight">Streetlights</option>
            <option value="drainage">Drainages</option>
          </select>
        </div>

        {/* Status select */}
        <div className="relative md:col-span-3">
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/50 rounded-lg border border-slate-200 text-xs text-slate-600 focus:border-emerald-600 focus:outline-hidden capitalize"
          >
            <option value="all">All Project Statuses</option>
            <option value="reported">Reported (Pending)</option>
            <option value="verified">Verified (Pending crew)</option>
            <option value="dispatched">Dispatched (Repair team)</option>
            <option value="resolved">Resolved (Closed)</option>
          </select>
        </div>

        {/* Metrics readout */}
        <div className="md:col-span-2 text-right">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
            {filteredIssues.length} Pin{filteredIssues.length !== 1 && 's'} plotted
          </span>
        </div>
      </div>

      {/* Map Layout splitting into Map (60%) and interactive sidebar card (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[55vh]">
        
        {/* Interactive Simulated Map Canvas */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 h-full flex flex-col justify-between" id="ward-map-canvas">
          {/* Compass layout absolute overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2 z-10 text-slate-700 text-xs font-semibold shadow-xs">
            <Compass className="h-4 w-4 text-emerald-700 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Emerald Zone Simulation Map</span>
          </div>

          {/* Map Vector Graphic Background */}
          <div className="absolute inset-0 bg-[#eef1f6] select-none pointer-events-none">
            <svg width="100%" height="100%" className="opacity-90">
              {/* Forest/Green zone */}
              <rect x="15%" y="60%" width="30%" height="25%" fill="#e2efe0" rx="12" />
              <text x="30%" y="72%" fill="#5b8f54" className="text-[10px] font-bold uppercase tracking-wider">Emerald Central Park</text>

              {/* Waterway */}
              <path d="M -20,200 Q 200,180 400,280 T 1000,400" fill="none" stroke="#cedff0" strokeWidth="32" strokeLinecap="round" />
              <text x="50%" y="31%" fill="#4878a8" className="text-[10px] font-bold uppercase tracking-wider">Emerald Canal</text>

              {/* Core Streets network lines */}
              <line x1="0" y1="100" x2="1000" y2="100" stroke="#ffffff" strokeWidth="8" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="#d0d6e2" strokeWidth="2" strokeDasharray="5" />
              <text x="75%" y="15%" fill="#718096" className="text-[9px] font-semibold">Emerald Expressway</text>

              <line x1="300" y1="0" x2="300" y2="600" stroke="#ffffff" strokeWidth="12" />
              <line x1="300" y1="0" x2="300" y2="600" stroke="#d0d6e2" strokeWidth="2" strokeDasharray="5" />
              <text x="250%" y="45%" rotate="90" fill="#718096" className="text-[9px] font-semibold">Hill Road Corridor</text>

              <line x1="0" y1="480" x2="1000" y2="480" stroke="#ffffff" strokeWidth="8" />
              <line x1="0" y1="480" x2="1000" y2="480" stroke="#d0d6e2" strokeWidth="2" strokeDasharray="5" />
              <text x="5%" y="80%" fill="#718096" className="text-[9px] font-semibold">Greenwood Lane</text>

              <line x1="700" y1="0" x2="700" y2="600" stroke="#ffffff" strokeWidth="8" />
              <line x1="700" y1="0" x2="700" y2="600" stroke="#d0d6e2" strokeWidth="2" strokeDasharray="5" />
            </svg>
          </div>

          {/* Interactive Plot Pins overlapping based on GPS percentage converters */}
          <div className="absolute inset-0 z-0">
            {filteredIssues.map((issue) => {
              const position = getMapPosition(issue.location.lat, issue.location.lng);
              const isSelected = selectedIssue?.id === issue.id;

              return (
                <button
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="absolute cursor-pointer transition transform hover:scale-125 z-10 flex flex-col items-center group focus:outline-hidden"
                  style={{ top: position.top, left: position.left }}
                >
                  {/* Status Indicator circle with animated glow */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ring-4 transition ${getMarkerColor(issue.status)} ${
                    isSelected ? 'scale-120 shadow-lg border-2 border-white' : 'shadow-xs border border-white'
                  }`}>
                    <span className="text-sm select-none">{getMarkerEmoji(issue.category)}</span>
                  </div>
                  
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 shadow-lg pointer-events-none transition duration-200">
                    {issue.title.substring(0, 24)}...
                  </div>

                  {/* Marker Pin Line Anchor */}
                  <div className="h-1.5 w-0.5 bg-slate-400"></div>
                </button>
              );
            })}
          </div>

          {/* Bottom Zoom and Helper Bar overlay */}
          <div className="relative p-4 flex items-center justify-between text-[11px] text-slate-500 bg-white/80 backdrop-blur-md border-t border-slate-100 z-10">
            <span>Scroll mock canvas to scan. Click any pin to read details.</span>
            <div className="flex gap-2">
              <span className="h-4 px-1.5 bg-white border border-slate-200 rounded font-bold cursor-pointer">+ Zoom</span>
              <span className="h-4 px-1.5 bg-white border border-slate-200 rounded font-bold cursor-pointer">- Zoom</span>
            </div>
          </div>
        </div>

        {/* Selected Pin Details Side Drawer */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-100 h-full p-5 overflow-y-auto flex flex-col justify-between" id="ward-map-drawer">
          {selectedIssue ? (
            <div className="space-y-4 flex flex-col h-full justify-between">
              {/* Content top */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-md capitalize">
                    {selectedIssue.category.replace('_', ' ')}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-md font-extrabold capitalize ${
                    selectedIssue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                    selectedIssue.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                    selectedIssue.status === 'verified' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedIssue.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-lg leading-snug">
                  {selectedIssue.title}
                </h3>

                {selectedIssue.image && (
                  <img 
                    src={selectedIssue.image} 
                    alt={selectedIssue.title}
                    className="w-full h-32 object-cover rounded-lg border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                )}

                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedIssue.description}
                </p>

                <div className="space-y-1 text-xs">
                  <p className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="h-4 w-4 text-emerald-700 font-bold shrink-0" />
                    <span>{selectedIssue.location.address}</span>
                  </p>
                  <p className="text-slate-400 pl-5">
                    Reported by {selectedIssue.reportedBy} • {new Date(selectedIssue.reportedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bottom interactions */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => onUpvoteIssue(selectedIssue.id)}
                    className={`p-2.5 rounded-lg border font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      selectedIssue.isUpvotedByUser 
                        ? 'bg-emerald-800 text-white border-emerald-800' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-150 hover:bg-emerald-100'
                    }`}
                  >
                    <Vote className="h-4 w-4" />
                    {selectedIssue.isUpvotedByUser ? 'Upvoted' : 'Upvote'} ({selectedIssue.upvotes})
                  </button>

                  <button 
                    onClick={() => onVerifyIssue(selectedIssue.id)}
                    className={`p-2.5 rounded-lg border font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      selectedIssue.isVerifiedByUser
                        ? 'bg-amber-500 text-white border-amber-550' 
                        : 'bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {selectedIssue.isVerifiedByUser ? 'Verified' : 'Verify'} ({selectedIssue.verifiedCount})
                  </button>
                </div>
                <p className="text-[10px] text-center text-slate-400">
                  Verifying or upvoting gains up to +10 Civic points!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8">
              <MapPin className="h-10 w-10 mb-2.5 text-slate-300" />
              <p className="font-bold text-slate-500 text-sm">No Active Pin Selected</p>
              <p className="text-xs mt-1 text-slate-400">Click any marker pin plotted on the simulation canvas to load local reports, metrics, and actions.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
