import React, { useState } from 'react';
import { analyzeIssue } from "../../services/gemini";
import { 
  Camera, 
  MapPin, 
  AlertTriangle, 
  Sparkles, 
  Send, 
  Check, 
  ArrowRight,
  Info
} from 'lucide-react';
import { IssueCategory, IssuePriority } from '../../types';

interface ReportIssueProps {
  onSubmitIssue: (issueData: {
    title: string;
    description: string;
    category: IssueCategory;
    priority: IssuePriority;
    location: { address: string; lat?: number; lng?: number };
    image?: string;
    aiSeverity?: string;
aiDepartment?: string;
aiSummary?: string;
aiConfidence?: number;
aiRecommendedAction?: string;
  }) => Promise<{ pointsEarned: number } | null>;
  setActiveTab: (tab: string) => void;
}

const CATEGORIES: { value: IssueCategory; label: string; placeholder: string; icon: string }[] = [
  { value: 'pothole', label: 'Pothole & Road Damage', placeholder: 'e.g., Massive pothole stretching 2ft wide in middle lane', icon: '🚧' },
  { value: 'garbage', label: 'Garbage & Waste Dump', placeholder: 'e.g., Uncleaned street garbage bin rotting for the past 3 days', icon: '🗑️' },
  { value: 'water_leakage', label: 'Water Leakage', placeholder: 'e.g., Main pipe bursting, clean water flooding the pavement', icon: '💧' },
  { value: 'streetlight', label: 'Broken Streetlight', placeholder: 'e.g., Dark unlit streetlight near transit signal #SL-41', icon: '💡' },
  { value: 'drainage', label: 'Clogged Drainage', placeholder: 'e.g., Blockings in street storm drain causing instant sidewalk floods', icon: '🌪️' },
  { value: 'other', label: 'Other Civic Defect', placeholder: 'e.g., Missing public manhole cover, collapsed public fence', icon: '📍' }
];

const SAMPLE_PHOTO_PRESETS = [
  { name: 'Pothole', url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600', cat: 'pothole' },
  { name: 'Garbage heap', url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600', cat: 'garbage' },
  { name: 'Water Pipe leak', url: 'https://images.unsplash.com/photo-1542013936693-8848e574047a?auto=format&fit=crop&q=80&w=600', cat: 'water_leakage' },
  { name: 'Broken streetlight', url: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=600', cat: 'streetlight' },
];

const mapDepartmentToCategory = (department: string | undefined): IssueCategory | undefined => {
  if (!department) return undefined;
  const normalized = department.toString().toLowerCase();

  if (normalized.includes('pothole') || normalized.includes('road') || normalized.includes('asphalt') || normalized.includes('street damage')) {
    return 'pothole';
  }
  if (normalized.includes('garbage') || normalized.includes('waste') || normalized.includes('sanitation') || normalized.includes('dump')) {
    return 'garbage';
  }
  if (normalized.includes('water') || normalized.includes('leak') || normalized.includes('sewer') || normalized.includes('drainage')) {
    return 'water_leakage';
  }
  if (normalized.includes('light') || normalized.includes('streetlight') || normalized.includes('lamp') || normalized.includes('electric')) {
    return 'streetlight';
  }
  if (normalized.includes('drain') || normalized.includes('storm') || normalized.includes('flood') || normalized.includes('sewer')) {
    return 'drainage';
  }

  return 'other';
};

export default function ReportIssue({ onSubmitIssue, setActiveTab }: ReportIssueProps) {
  const [category, setCategory] = useState<IssueCategory>('pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successPoints, setSuccessPoints] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
const [aiLoading, setAiLoading] = useState(false);


  // Auto-get current position
  const [locating, setLocating] = useState(false);
  const handleGetLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  setLat(latitude);
  setLng(longitude);

  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  )
    .then((res) => res.json())
    .then((data) => {
      setAddress(data.display_name);
      setLocating(false);
    })
    .catch(() => {
      setAddress(`${latitude}, ${longitude}`);
      setLocating(false);
    });
},
        () => {
          // Fallback simulation
          setLat(12.9730 + (Math.random() - 0.5) * 0.01);
          setLng(77.5950 + (Math.random() - 0.5) * 0.01);
          setAddress('Emerald Main St, Zone 4, Bangalore');
          setLocating(false);
        }
      );
    } else {
      setAddress('Emerald Main St, Zone 4, Bangalore');
      setLocating(false);
    }
  };

  const handlePresetSelect = (presetUrl: string, presetCat: string) => {
    setImageUrl(presetUrl);
    setCategory(presetCat as IssueCategory);
    // Autofill structured titles occasionally
    if (!title) {
      setTitle(`Severe ${presetCat} reported next to key utility zone`);
    }
  };

  const currentCategoryPlaceholder = CATEGORIES.find(c => c.value === category)?.placeholder || '';

  const handleAIAnalysis = async () => {

  if (!title.trim()) {
  alert("Please enter the issue title first.");
  return;
}


  setAiLoading(true);

  try {
const result = await analyzeIssue(category, description);
    
    setAiResult(result);

    setDescription(result.summary);
    
    if (result.severity) {
      const severity = result.severity.toLowerCase();
      if (severity === "high") {
        setPriority("high");
      } else if (severity === "medium") {
        setPriority("medium");
      } else {
        setPriority("low");
      }
    }

    if (result.department) {
      const departmentCategory = mapDepartmentToCategory(result.department);
      if (departmentCategory) {
        setCategory(departmentCategory);
      }
    }

    if (result.summary) {
      setDescription(result.summary);
    }

    if (result.severity) {
      if (result.severity.toLowerCase() === "high") {
        setPriority("high");
      } else if (result.severity.toLowerCase() === "medium") {
        setPriority("medium");
      } else {
        setPriority("low");
      }
    }

  } catch (err: any) {

  console.error("Gemini Error:", err);

  alert(
    "AI Analysis failed.\n\n" +
    (err?.message || JSON.stringify(err))
  );

}

  setAiLoading(false);

};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !description.trim() || !address.trim()) {
      setErrorMsg('Please prefill all required fields (title, description, and location).');
      return;
    }

    setLoading(true);
    try {
      console.log("AI RESULT:", aiResult);
      const existingReports = JSON.parse(
localStorage.getItem("actiwardReports") || "[]"
);

const duplicate = existingReports.find((report:any)=>

report.category===category &&

report.location.toLowerCase()===address.toLowerCase()

);

if(duplicate){

const proceed=window.confirm(

"⚠ A similar issue has already been reported at this location.\n\nDo you still want to submit?"

);

if(!proceed){

setLoading(false);

return;

}

}
      const result = await onSubmitIssue({
  title,
  description,
  category,
  priority,

  location: {
    address,
    lat,
    lng
  },

  image: imageUrl || undefined,

  aiSeverity: aiResult?.severity,
  aiDepartment: aiResult?.department,
  aiSummary: aiResult?.summary,
  aiConfidence: aiResult?.confidence,
  aiRecommendedAction: aiResult?.recommendedAction
});

      if (result) {
        setIsSuccess(true);
        setSuccessPoints(result.pointsEarned);
        // Clear forms
        setTitle('');
        setDescription('');
        setAddress('');
        setImageUrl('');
        setLat(undefined);
        setLng(undefined);
      } else {
        setErrorMsg('Failed to submit. Please try again.');
      }
    } catch (e: any) {
      setErrorMsg('Server connection failed. Could not log your action.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center max-w-md mx-auto" id="report-success-panel">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 border-4 border-emerald-50">
          <Check className="h-8 w-8" />
        </div>
        
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin" /> +{successPoints} Points Earned
        </span>

        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Report Logged Successfully!
        </h1>
        
        <p className="text-slate-500 text-sm mt-3 leading-relaxed">
          Your civic ticket has been routed straight to our dispatching councilor team and local citizens for validation. You are shaping your ward!
        </p>

        <div className="mt-8 grid grid-cols-1 gap-2 w-full">
          <button 
            onClick={() => setActiveTab('nearby')}
            className="w-full py-3 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition flex items-center justify-center gap-2"
          >
            Track in Nearby Issues <ArrowRight className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => setIsSuccess(false)}
            className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold bg-white hover:bg-slate-50 transition"
          >
            File Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="report-form-container">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          File Civic Report <AlertTriangle className="h-6 w-6 text-emerald-700" />
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Provide accurate hyperlocal details. Verified reports trigger rapid crew repairs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xs border border-slate-100 p-6 md:p-8 space-y-6">
        {errorMsg && (
          <div className="rounded-lg bg-rose-50 p-4 border border-rose-100 flex items-start gap-3">
            <Info className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-800">{errorMsg}</p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 block">1. Select Civic Category <span className="text-rose-500">*</span></label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition cursor-pointer ${
                  category === cat.value 
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold ring-2 ring-emerald-500/10' 
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-slate-600'
                }`}
              >
                <span className="text-2xl mb-1.5">{cat.icon}</span>
                <span className="text-xs leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Details */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-bold text-slate-700 block mb-1.5">
              2. Title / Quick Summary <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Deep asphalt crack outside school sidewalk junction"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-800 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label htmlFor="desc" className="text-sm font-bold text-slate-700 block mb-1.5">
              3. Description of Public Hazard <span className="text-rose-500">*</span>
            </label>
            <textarea 
              id="desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={currentCategoryPlaceholder}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-800 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              required
            />
          </div>
        </div>

        {/* Location Selection */}
        <div className="space-y-3">
          <label htmlFor="loc" className="text-sm font-bold text-slate-700 block">
            4. Ward Location / Address <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              id="loc"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., 5th Cross Road, opposite Public Library, Emerald Ward"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-slate-800 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              required
            />
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className="px-4 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-semibold text-xs shrink-0 transition"
            >
              <MapPin className={`h-4 w-4 text-emerald-700 ${locating ? 'animate-bounce' : ''}`} />
              {locating ? 'Locating...' : 'Tag GPS'}
            </button>
          </div>
          <span className="text-[11px] text-slate-400 block"><span className="font-semibold text-emerald-800">Auto-Ward Router:</span> System automatically routes reports based on boundary inputs.</span>
        </div>

        {/* Priority Level */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">5. Estimated Risk Priority</label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as IssuePriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`py-2 px-3 border rounded-lg text-xs font-semibold uppercase tracking-wider capitalize cursor-pointer transition ${
                  priority === p 
                    ? p === 'high' ? 'bg-rose-50 border-rose-600 text-rose-800' : 
                      p === 'medium' ? 'bg-amber-50 border-amber-600 text-amber-800' :
                      'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {p} Priority
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Image Prefiller */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 block mb-1">
            6. Add a Proof Photo <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Custom Input URL or Mock Area */}
            <div className="md:col-span-8 space-y-2">
              <input 
                type="url" 
                placeholder="Paste any photo URL here..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-800 text-xs focus:border-emerald-600 focus:outline-hidden"
              />
              <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center flex flex-col items-center justify-center cursor-default">
                <Camera className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Simulate Camera Upload</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Simply click any preset on the right to simulate tagging real photo evidence.</p>
              </div>
            </div>

            {/* Presets Slider */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-600 block mb-2">Simulated Presets</span>
              <div className="grid grid-cols-2 gap-2 flex-1">
                {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset.url, preset.cat)}
                    className="relative rounded-lg overflow-hidden border border-slate-200 h-16 group hover:border-emerald-500 text-left transition"
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1 text-center">
                      <span className="text-[8px] text-white font-bold block">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trigger Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 max-w-sm">
            <Info className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Contributions are logged securely under Ward policy rules. Misuse triggers point penalty.</span>
          </div>

          <button
  type="button"
  onClick={handleAIAnalysis}
  className="w-full bg-purple-700 text-white py-3 rounded-xl font-bold mb-4"
>
  {aiLoading ? "Analyzing..." : "🤖 Analyze with AI"}
</button>
{aiResult && (

<div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 mb-5">

<h3 className="font-bold text-lg text-emerald-800">
🤖 AI Analysis
</h3>

<p>
<b>Severity:</b> {aiResult.severity}
</p>

<p>
<b>Department:</b> {aiResult.department}
</p>

<p>
<b>Summary:</b> {aiResult.summary}
</p>

<p>
<b>Confidence:</b> {aiResult.confidence}
</p>

<p className="mt-3">
  <strong>Recommended Action:</strong>
</p>

<p className="text-sm">
  {aiResult?.recommendedAction}
</p>

</div>

)}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-950 shadow-sm hover:shadow-md transition shrink-0 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Report'} <Send className="h-4 w-4" />
          </button>
          
        </div>
      </form>
    </div>
  );
}
function setDepartment(department: any) {
  throw new Error('Function not implemented.');
}

