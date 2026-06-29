import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Vote, 
  Award, 
  Info, 
  AlertTriangle, 
  Camera, 
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';
import { Issue } from '../../types';

interface VerifyReportsProps {
  issues: Issue[];
  onVerifyIssue: (id: string) => Promise<void>;
  userPoints: number;
}

export default function VerifyReports({ issues, onVerifyIssue, userPoints }: VerifyReportsProps) {
  // We want issues that are 'reported' (not yet fully verified/resolved), especially with lower verification counts
  const pendingVerifyIssues = issues.filter(i => i.status === 'reported');
  const [successNotif, setSuccessNotif] = useState<string | null>(null);

  const handleVerifyAction = async (issueId: string) => {
    try {
      await onVerifyIssue(issueId);
      const isNowVerified = issues.find(i => i.id === issueId)?.isVerifiedByUser;
      
      if (!isNowVerified) {
        setSuccessNotif(`Successfully updated verification rating. You earned rewards!`);
        setTimeout(() => setSuccessNotif(null), 4000);
      } else {
        setSuccessNotif(`Verification removed.`);
        setTimeout(() => setSuccessNotif(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6" id="verify-reports-panel">
      {/* Welcome header badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Verify Local Reports <ShieldCheck className="h-6 w-6 text-emerald-800 animate-pulse" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Validate nearby flags to ensure municipality staff receive accurate, actionable data.
          </p>
        </div>

        {/* Gamified score widget */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 flex items-center gap-3 shrink-0">
          <Award className="h-5 w-5 text-amber-600" />
          <div className="text-xs">
            <p className="text-[10px] text-amber-700 tracking-wider font-extrabold uppercase">Inspector Level 2</p>
            <p className="text-slate-700 font-medium">Verify 3 more for a <span className="font-extrabold text-[#744210]">+50 pts voucher</span></p>
          </div>
        </div>
      </div>

      {successNotif && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successNotif}</span>
        </div>
      )}

      {/* Intro info card resembling step 3 of report workflow */}
      <div className="rounded-xl bg-slate-900 text-white p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-8 space-y-2">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded">
            🛡️ Safe Ward Inspector Bylaw
          </span>
          <h2 className="text-lg md:text-xl font-bold">How Citizen Verification Works</h2>
          <p className="text-slate-300 text-xs leading-relaxed max-w-xl">
            To prevent spam and false reporting, municipal repairs are only dispatched after three separate local citizens confirm the issue exists. Check the listings below, visit the spot during your commute (if safe), and vote!
          </p>
        </div>
        <div className="md:col-span-4 grid grid-cols-2 gap-2 text-center">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-[#38bdf8] font-black text-xl">+10</p>
            <p className="text-[10px] text-slate-400 mt-1">Verification Points</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-emerald-400 font-black text-xl">5+</p>
            <p className="text-[10px] text-slate-400 mt-1">Dispatches Council</p>
          </div>
        </div>
      </div>

      {/* Main verification card list view */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Reports Awaiting Verification</h3>
          <span className="text-xs text-slate-400">{pendingVerifyIssues.length} tickets pending check</span>
        </div>

        {pendingVerifyIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingVerifyIssues.map((issue) => (
              <div 
                key={issue.id}
                className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col justify-between hover:border-emerald-250 transition-all shadow-xs space-y-4"
              >
                <div className="space-y-3">
                  {/* Category top bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded capitalize">
                      {issue.category.replace('_', ' ')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {issue.ward}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-base leading-tight">
                    {issue.title}
                  </h4>

                  {/* Photo file representation if available */}
                  {issue.image ? (
                    <img 
                      src={issue.image} 
                      alt={issue.title}
                      className="w-full h-36 object-cover rounded-lg border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 text-center text-slate-400 space-y-1">
                      <Camera className="h-5 w-5 mx-auto text-slate-300" />
                      <p className="text-[10px] font-semibold text-slate-550">No evidence photo uploaded yet</p>
                      <p className="text-[9px] text-slate-400 font-normal">Physical spot inspection highly recommended for water leaks or road cracks.</p>
                    </div>
                  )}

                  {/* Descriptions block */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-550 line-clamp-3 leading-relaxed">
                      “{issue.description}”
                    </p>
                    <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-50">
                      Reported by <strong className="text-slate-600">{issue.reportedBy}</strong> • {new Date(issue.reportedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Confirm buttons drawer */}
                <div className="pt-3 border-t border-emerald-50/50 flex items-center justify-between gap-4">
                  <div className="text-xs font-semibold text-slate-400">
                    Confidence: <span className="text-amber-600">{issue.verifiedCount}/5 validations</span>
                  </div>

                  <button
                    onClick={() => handleVerifyAction(issue.id)}
                    className={`py-2 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                      issue.isVerifiedByUser 
                        ? 'bg-emerald-800 text-white border border-emerald-800' 
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {issue.isVerifiedByUser ? 'Verified ✓ (+10 pts)' : 'I Verify This exists'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-emerald-200 p-12 text-center max-w-md mx-auto space-y-3">
            <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-600" />
            <p className="font-extrabold text-slate-800 text-sm">Perfect Score! All files validated</p>
            <p className="text-xs text-slate-400">There are no outstanding reported issues waiting for validation in Emerald Ward. Exceptional civic stewardship!</p>
          </div>
        )}
      </div>

      {/* Helpful safety warnings */}
      <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 shrink-0 text-xs flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-800 uppercase tracking-wider text-[10px]">⚠️ Safety Guidelines for Citizen Inspectors</p>
          <p className="text-slate-600 leading-relaxed">
            Never walk into active lanes, climb restricted boundaries, or approach heavy construction machinery to check reports. Your physical safety is paramount. Keep validation calls strictly bounded to walking-safe sidewalks.
          </p>
        </div>
      </div>
    </div>
  );
}
