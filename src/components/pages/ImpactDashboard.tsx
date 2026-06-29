import React from 'react';
import { 
  TrendingUp, 
  Leaf, 
  MapPin, 
  Smile, 
  Activity, 
  Calendar,
  ThumbsUp,
  Droplet,
  Trash2,
  Tv,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function ImpactDashboard() {
  // Stat values
  const totalWaterSavedGallons = 12400;
  const carbonOffsetKg = 180;
  const potholesPatched = 14;

  return (
    <div className="space-y-6" id="impact-dashboard-panel">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          Impact Realized <Activity className="h-6 w-6 text-emerald-800" />
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Historical overview of collective citizen efforts lowering carbon, water waste, and hazard densities.
        </p>
      </div>

      {/* Primary Highlights row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Water leakage saved */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl text-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-white/10 text-blue-100 font-extrabold px-2.5 py-0.5 rounded upper">
              Conservation Metric
            </span>
            <Droplet className="h-6 w-6 text-blue-300 animate-bounce" style={{ animationDuration: '4s' }} />
          </div>
          <div className="py-4">
            <p className="text-3xl font-black">{totalWaterSavedGallons.toLocaleString()} Gal</p>
            <p className="text-xs text-blue-200 mt-1">Clean drinking water prevented from spilling on sidewalks through swift leakage reporting.</p>
          </div>
          <div className="pt-3 border-t border-white/10 text-xs font-semibold text-blue-100 flex justify-between">
            <span>Emerald Ward Goal: 20k Gal</span>
            <span>62% Done</span>
          </div>
        </div>

        {/* Card 2: Environment carbon offset */}
        <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-2xl text-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-white/10 text-emerald-200 font-extrabold px-2.5 py-0.5 rounded upper">
              Debris & Trash Removal
            </span>
            <Leaf className="h-6 w-6 text-emerald-300" />
          </div>
          <div className="py-4">
            <p className="text-3xl font-black">{carbonOffsetKg} Kg</p>
            <p className="text-xs text-emerald-150 mt-1">Organic wastes properly routed to ward recycle compost heaps instead of uncleaned gutters.</p>
          </div>
          <div className="pt-3 border-t border-white/10 text-xs font-semibold text-emerald-200 flex justify-between">
            <span>CO2 Offset Equivalent</span>
            <span>9 Trees planted 🌳</span>
          </div>
        </div>

        {/* Card 3: Traffic road safety safety */}
        <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl text-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-white/10 text-amber-100 font-extrabold px-2.5 py-0.5 rounded upper">
              Hazard Isolation
            </span>
            <CheckCircle className="h-6 w-6 text-amber-200" />
          </div>
          <div className="py-4">
            <p className="text-3xl font-black">{potholesPatched} Projects</p>
            <p className="text-xs text-amber-150 mt-1">Deep road potholes completely patched and streetlights restored protecting nightly motorbike traffic.</p>
          </div>
          <div className="pt-3 border-t border-white/10 text-xs font-semibold text-amber-100 flex justify-between">
            <span>Accidents Mitigated</span>
            <span>Est. 12+ incidents</span>
          </div>
        </div>

      </div>

      {/* Graphic charts: SVG representation of monthly performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Resolution performance bar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight">Monthly Tickets Resolved</h3>
            <p className="text-xs text-slate-450">Comparing Average resolution hours month over month.</p>
          </div>

          <div className="relative pt-6">
            {/* Custom SVG Column layout */}
            <div className="flex items-end justify-between h-44 border-b border-l border-slate-100 pl-2 pb-1 text-slate-400">
              <div className="flex flex-col items-center gap-1.5 w-1/4">
                <div className="bg-slate-300 w-8 h-32 rounded-t-lg transition hover:bg-emerald-600 cursor-default"></div>
                <span className="text-[10px] font-bold">Jan (48 Hr)</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-1/4">
                <div className="bg-slate-300 w-8 h-28 rounded-t-lg transition hover:bg-emerald-600 cursor-default"></div>
                <span className="text-[10px] font-bold">Feb (42 Hr)</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-1/4">
                <div className="bg-slate-300 w-8 h-24 rounded-t-lg transition hover:bg-emerald-600 cursor-default"></div>
                <span className="text-[10px] font-bold">Mar (36 Hr)</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 w-1/4">
                <div className="bg-emerald-800 w-8 h-20 rounded-t-lg transition hover:bg-emerald-950 cursor-default"></div>
                <span className="text-[10px] font-extrabold text-emerald-800">Apr (32 Hr) ★</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 block text-center">Lower bars signify faster repair times. The introduction of ActiWard AI dramatically boosted dispatch velocity by 34%.</span>
        </div>

        {/* Chart 2: Category distribution breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight">Civic Issues Category Distribution</h3>
            <p className="text-xs text-slate-450">Emerald Ward current pending logs categorization ratios.</p>
          </div>

          {/* Graphical custom meters layout */}
          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                <span>🚧 Potholes & Roads</span>
                <span>38%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                <span>🗑️ Garbage & Sanitary bin heaps</span>
                <span>28%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#b7791f] h-full rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                <span>💧 Sidewalk Water Leakages</span>
                <span>18%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                <span>💡 Dark streetlamps & drainage blockages</span>
                <span>16%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Helpful quote footnote */}
      <div className="bg-[#e6fffa] rounded-2xl border border-emerald-100 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Smile className="h-8 w-8 text-emerald-800 shrink-0" />
          <div className="text-xs">
            <h4 className="font-bold text-emerald-900">ActiWard Environmental Stewardship Pledge</h4>
            <p className="text-emerald-700/80 leading-relaxed mt-0.5">By coordinating verification routes and cleaning public hazards promptly, our community prevents structural road damage from multiplying. Early reporting lowers maintenance expenses by over 40%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
