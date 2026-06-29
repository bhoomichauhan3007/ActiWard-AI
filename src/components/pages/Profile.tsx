import React, { useState, useEffect } from 'react';
import { 
  User, 
  Award, 
  MapPin, 
  Flame, 
  ShieldAlert, 
  CheckCircle, 
  ChevronRight, 
  TrendingUp, 
  Sparkles,
  Info,
  Medal,
  Users
} from 'lucide-react';
import { LeaderboardUser } from '../../types';

export default function Profile() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  const [reportCount, setReportCount] = useState(0);

  const [userPoints, setUserPoints] = useState(0);

  const savedUser = JSON.parse(
  localStorage.getItem('actiwardUser') || '{}'
);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
  const reports = JSON.parse(
    localStorage.getItem("actiwardReports") || "[]"
  );

  const myReports = reports.filter(
    (report: any) => report.user === savedUser.name
  );

  const currentUser = {
    rank: 0,
    name: savedUser.name,
    avatar: "",
    points: myReports.length * 15,
    impactScore: 100,
  };

  const updatedLeaderboard = [...data, currentUser];

  updatedLeaderboard.sort(
    (a, b) => b.points - a.points
  );

  updatedLeaderboard.forEach((user, index) => {
    user.rank = index + 1;
  });

  setLeaderboard(updatedLeaderboard);
})
      .catch(err => console.error(err));

      const reports = JSON.parse(
  localStorage.getItem('actiwardReports') || '[]'
);

const myReports = reports.filter(
  (report: any) => report.user === savedUser.name
);

setUserPoints(myReports.length * 15);

  }, []);

  const reports = JSON.parse(
  localStorage.getItem('actiwardReports') || '[]'
);

const myReports = reports.filter(
  (report: any) => report.user === savedUser.name
);

const totalReports = myReports.length;

const resolvedReports = myReports.filter(
  (report: any) => report.status === "Resolved"
);

const reputation =
myReports.length === 0
? 100
: Math.round((resolvedReports.length / myReports.length) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="profile-zone">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-emerald-950 p-6 text-white shadow-lg md:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-6">
         <div className="h-24 w-24 rounded-full border-4 border-emerald-500/50 shadow-md bg-emerald-700 flex items-center justify-center">
  <span className="text-4xl font-black text-white">
    {savedUser.name?.charAt(0).toUpperCase()}
  </span>
</div>
          <div className="space-y-2 flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 uppercase">
              ★ Active Citizen
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
  {savedUser.name}
</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-emerald-400" />
{savedUser.area}</span>
              <span>Joined July 2025</span>

              <button
  onClick={() => {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
  }}
  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
>
  Logout
</button>

            </div>
          </div>
        </div>
      </div>

<div className="bg-white rounded-xl p-5 border border-slate-100">
  <h3 className="font-bold text-slate-800 mb-3">
    Citizen Information
  </h3>

  <div className="space-y-2 text-sm">
    <p><strong>Name:</strong> {savedUser.name}</p>
    <p><strong>Email:</strong> {savedUser.email}</p>
    <p><strong>Phone:</strong> {savedUser.phone}</p>
    <p><strong>Area:</strong> {savedUser.area}</p>
  </div>
</div>

      {/* Stats Breakdown Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-xs border border-slate-100/80 flex items-center gap-3">
          <span className="rounded-lg bg-emerald-50 p-2.5 text-emerald-700 font-extrabold"><CheckCircle className="h-5 w-5" /></span>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Reports</p>
            <p className="text-lg font-black text-slate-800">
  {myReports.length} Issues
</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-xs border border-slate-100/80 flex items-center gap-3">
          <span className="rounded-lg bg-amber-50 p-2.5 text-amber-700 font-extrabold"><Award className="h-5 w-5" /></span>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Civic Points</p>
            <p className="text-lg font-black text-slate-800">{userPoints} Points</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-xs border border-slate-100/80 flex items-center gap-3">
          <span className="rounded-lg bg-blue-50 p-2.5 text-blue-700 font-extrabold"><Flame className="h-5 w-5" /></span>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Weekly Streak</p>
            <p className="text-lg font-black text-slate-800">4 Weeks</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-xs border border-slate-100/80 flex items-center gap-3">
          <span className="rounded-lg bg-indigo-50 p-2.5 text-indigo-700 font-extrabold"><TrendingUp className="h-5 w-5" /></span>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Reputation</p>
            <p className="text-lg font-black text-slate-800">{reputation}% Positive</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Awarded Badges + Ward Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Awarded Badges */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 md:p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2"><Medal className="h-5 w-5 text-emerald-600" /> Awarded Badges</h3>
          
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-center gap-3">
              <span className="text-2xl shrink-0">🛡️</span>
              <div>
                <p className="font-extrabold text-xs text-slate-700">Active Citizen Badge</p>
                <p className="text-[11px] text-slate-500">Earned by submitting your first validated issue on a road block.</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-center gap-3">
              <span className="text-2xl shrink-0">🚧</span>
              <div>
                <p className="font-extrabold text-xs text-slate-700">Pothole Patrol Badge</p>
                <p className="text-[11px] text-slate-500">Awarded for successfully reporting more than three asphalt hazards.</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100/40 opacity-60 flex items-center gap-3">
              <span className="text-2xl shrink-0 filter grayscale">💧</span>
              <div>
                <p className="font-extrabold text-xs text-slate-400">Water Conservationist (Locked)</p>
                <p className="text-[11px] text-slate-400 font-normal">Requires 1 report on storm drains or municipal water pipelines.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard list */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 md:p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2"><Users className="h-5 w-5 text-emerald-600" /> Emerald Ward Leaderboard</h3>
          
          <div className="space-y-2.5 overflow-y-auto max-h-72">
            {leaderboard.map((user, index) => {
              const isMe = user.name === savedUser.name;
              return (
                <div 
                  key={index}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                    isMe 
                      ? 'bg-emerald-50 border-emerald-500/30 font-bold' 
                      : 'bg-slate-50/50 border-slate-100 hover:bg-slate-550'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-xs text-slate-400 w-4 shrink-0 text-center">#{user.rank}</span>
                    {user.avatar ? (
  <img
    src={user.avatar}
    alt={user.name}
    className="h-9 w-9 rounded-full object-cover border border-slate-200"
  />
) : (
  <div className="h-9 w-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
    {user.name.charAt(0)}
  </div>
)}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{user.name} {isMe && ' (You) '}</h4>
                      <p className="text-[10px] text-slate-400">Impact rating: {user.impactScore}%</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-extrabold text-slate-800">{user.points} pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
