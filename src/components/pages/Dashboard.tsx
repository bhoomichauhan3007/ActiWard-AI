import React from 'react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  Flame, 
  Sparkles,
  Zap,
  Users
} from 'lucide-react';
import { Issue } from '../../types';

interface DashboardProps {
  issues: Issue[];
  userPoints: number;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ issues, userPoints, setActiveTab }: DashboardProps) {
  const activeIssuesCount = issues.filter(i => i.status !== 'resolved').length;
  const resolvedIssuesCount = issues.filter(i => i.status === 'resolved').length;
  
  // Recent 3 issues
  const recentIssues = issues.slice(0, 3);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome Banner */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-slate-900 p-6 text-white shadow-lg md:p-8"
        id="dash-welcome-banner"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl"></div>
        
        <div className="relative flex flex-col justify-between md:flex-row md:items-center">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-300 uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Emerald Ward Partner
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
              Green Ward, Civic Pride
            </h1>
            <p className="max-w-md text-emerald-100 text-sm md:text-base">
              Welcome back, <strong className="text-white font-medium"></strong>. Your reports have accelerated 3 repair projects this week.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 md:mt-0">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10 flex items-center gap-4">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-200">Weekly Streak</p>
                <p className="text-xl font-bold text-white">4 Weeks 🔥</p>
              </div>
            </div>
            
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10 flex items-center gap-4">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-200">Civic Points</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-white">{userPoints}</p>
                  <span className="text-xs font-semibold text-emerald-300">pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" id="dash-quick-stats">
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-100 flex items-center gap-4 hover:border-emerald-300 hover:shadow-md transition duration-200">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Unresolved Issues</p>
            <p className="text-2xl font-bold text-slate-800">{activeIssuesCount}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-100 flex items-center gap-4 hover:border-emerald-300 hover:shadow-md transition duration-200">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Resolved Locally</p>
            <p className="text-2xl font-bold text-slate-800">{resolvedIssuesCount}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-100 flex items-center gap-4 hover:border-emerald-300 hover:shadow-md transition duration-200">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">My Ward Rank</p>
            <p className="text-2xl font-bold text-slate-800">#4</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-100 flex items-center gap-4 hover:border-emerald-300 hover:shadow-md transition duration-200">
          <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Voter Impact</p>
            <p className="text-2xl font-bold text-slate-800">+85%</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Actions + Recent Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12" id="dash-main-grid">
        {/* Quick Launchpad & Ward Overview */}
        <div className="space-y-6 lg:col-span-4" id="dash-left-panel">
          {/* Quick Actions Panel */}
          <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Quick Launchpad</h2>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => setActiveTab('report')}
                className="flex items-center justify-between w-full p-3.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium transition text-left text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold"><Zap className="h-4 w-4" /></span>
                  <span>Report an Issue</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button 
                onClick={() => setActiveTab('assistant')}
                className="flex items-center justify-between w-full p-3.5 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 font-medium transition text-left text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white font-bold"><Sparkles className="h-4 w-4" /></span>
                  <span>Consult Assistant</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button 
                onClick={() => setActiveTab('verify')}
                className="flex items-center justify-between w-full p-3.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium transition text-left text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white font-bold"><ShieldAlert className="h-4 w-4" /></span>
                  <span>Verify Nearby Reports</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Local Authority Info */}
          <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Your Ward Authority</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">Zone 4</span>
            </div>
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" 
                alt="Elizabeth Sterling"
                className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <p className="font-bold text-slate-800 text-sm">Elizabeth Sterling</p>
                <p className="text-xs text-slate-500">Emerald Ward Councilor</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Repair Crews</span>
                <span className="font-semibold text-slate-800">6 crews on duty</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Average Resolution Time</span>
                <span className="font-semibold text-slate-800">32 Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ward Priority Area</span>
                <span className="font-semibold text-amber-600">Garbage, Water Leakages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Issue Feed */}
        <div className="space-y-4 lg:col-span-8" id="dash-right-panel">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Recent Citizen Actions</h2>
            <button 
              onClick={() => setActiveTab('nearby')}
              className="text-emerald-700 hover:text-emerald-800 text-sm font-semibold inline-flex items-center gap-1"
            >
              See all nearby <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <div 
                key={issue.id}
                className="rounded-xl bg-white p-5 shadow-xs border border-slate-100 hover:border-emerald-200 hover:shadow-xs transition flex gap-5 flex-col md:flex-row cursor-pointer"
                onClick={() => setActiveTab('nearby')}
              >
                {issue.image ? (
                  <img 
                    src={issue.image} 
                    alt={issue.title}
                    className="w-full md:w-36 h-28 object-cover rounded-lg border border-slate-100 self-center"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full md:w-36 h-28 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 self-center">
                    <Building2 className="h-8 w-8" />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold capitalize">
                        {issue.category.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                        issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                        issue.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                        issue.status === 'verified' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {issue.status}
                      </span>
                      <span className={`text-[10px] uppercase px-1.5 py-0.2 rounded-md font-bold tracking-wider ${
                        issue.priority === 'high' ? 'bg-rose-50 text-rose-700' :
                        issue.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {issue.priority} priority
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 leading-tight text-base hover:text-emerald-700 transition">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {issue.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-50 text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {issue.location.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 md:mt-0">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {new Date(issue.reportedAt).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                        ▲ {issue.upvotes} Votes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
