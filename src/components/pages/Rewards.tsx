import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Ticket, 
  AlertCircle, 
  ChevronRight, 
  CornerDownRight, 
  Info,
  Gift,
  Coins
} from 'lucide-react';
import { RewardItem } from '../../types';

interface RewardsProps {
  onRedeemReward: (rewardId: string) => Promise<{ claimedItem: any; userPoints: number; reward: any } | null>;
  userPoints: number;
}

export default function Rewards({ onRedeemReward, userPoints }: RewardsProps) {
  const [catalog, setCatalog] = useState<RewardItem[]>([]);
  const [claimed, setClaimed] = useState<any[]>([]);
  const [points, setPoints] = useState(userPoints);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sync state points
  useEffect(() => {
    setPoints(userPoints);
  }, [userPoints]);

  const fetchCatalogData = async () => {
    try {
      const res = await fetch('/api/rewards');
      if (res.ok) {
        const data = await res.json();
        setCatalog(data.catalog);
        setClaimed(data.claimed);
        setPoints(data.userPoints);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const handleRedeem = async (rewardId: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoadingId(rewardId);

    const re = catalog.find(r => r.id === rewardId);
    if (re && points < re.cost) {
      setErrorMsg(`You have ${points} points, which is insufficient. This reward costs ${re.cost} points.`);
      setLoadingId(null);
      return;
    }

    try {
      const response = await onRedeemReward(rewardId);
      if (response) {
        setPoints(response.userPoints);
        setSuccessMsg(`Success! You successfully redeemed "${response.reward.title}". Check your active vouchers below.`);
        // Reload list
        fetchCatalogData();
      } else {
        setErrorMsg('Failed to process. Please check connection and try again.');
      }
    } catch (e) {
      setErrorMsg('Redemption error occured.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6" id="rewards-platform">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Civic Rewards <Award className="h-6 w-6 text-emerald-800" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Redeem your logged reporting and vetting contributions for real-world ward services.
          </p>
        </div>

        {/* Big gamified purse */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-4 flex items-center gap-4 shadow-sm shrink-0 border border-emerald-900">
          <div className="rounded-xl bg-white/10 p-2.5 text-emerald-300">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-emerald-200 font-extrabold uppercase tracking-wide">Available Balance</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{points}</span>
              <span className="text-xs text-emerald-300 font-semibold uppercase">civic pts</span>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-xs font-bold text-rose-800">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-210 p-4 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Catalog layout */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-800">Available Redemptions Catalog</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {catalog.map((reward) => {
            const hasEnough = points >= reward.cost;

            return (
              <div 
                key={reward.id}
                className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col justify-between hover:border-emerald-200 transition shadow-xs space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-slate-50 text-slate-500 font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded">
                      {reward.category}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Provided by {reward.provider}</span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                    {reward.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                    <Coins className="h-4.5 w-4.5 text-emerald-700" />
                    <span className="text-xs">{reward.cost} pts</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward.id)}
                    disabled={loadingId !== null}
                    className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-1 transition shrink-0 cursor-pointer ${
                      hasEnough 
                        ? 'bg-slate-900 border border-slate-800 text-white hover:bg-slate-950 hover:shadow-xs' 
                        : 'bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {loadingId === reward.id ? 'Processing...' : 'Redeem Coupon'} <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active claimed Coupon drawer */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5"><Ticket className="h-5 w-5 text-emerald-600" /> My Active Vouchers</h3>
        
        {claimed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {claimed.map((claim) => {
              const matchedReward = catalog.find(r => r.id === claim.rewardId);
              if (!matchedReward) return null;

              return (
                <div 
                  key={claim.id}
                  className="bg-[#f0f9ff] border-2 border-dashed border-[#bae6fd] rounded-xl p-4 flex flex-col justify-between hover:bg-[#e0f2fe] transition relative overflow-hidden"
                >
                  {/* Coupon scallop decoration */}
                  <div className="absolute top-1/2 -left-3 h-6 w-6 rounded-full bg-white border-r border-[#bae6fd]" />
                  <div className="absolute top-1/2 -right-3 h-6 w-6 rounded-full bg-white border-l border-[#bae6fd]" />

                  <div className="space-y-2">
                    <span className="text-[9px] bg-sky-200/50 text-sky-800 font-extrabold tracking-widest uppercase px-2 py-0.5 rounded">
                      🎟️ ACTIVE COUPON
                    </span>
                    <h5 className="font-extrabold text-slate-800 text-xs md:text-sm leading-tight pt-1">
                      {matchedReward.title}
                    </h5>
                    <p className="text-[10px] text-slate-400">Claimed {new Date(claim.redeemedAt).toLocaleDateString()}</p>
                  </div>

                  <div className="mt-4 bg-white rounded-lg p-2.5 border border-sky-100/60 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Coupon Code:</span>
                    <span className="text-xs font-black text-sky-800 select-all tracking-wider font-mono">{claim.discountCode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No claimed coupons yet. File reports or help verify neighbors' issues to accumulate point points!</p>
        )}
      </div>

      {/* Footnotes */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 font-normal text-xs flex gap-2">
        <Info className="h-4 w-4 text-emerald-600 shrink-0" />
        <span className="text-slate-500">All vouchers generated on ActiWard AI are sponsored by local governmental authorities and associated eco-partners to promote clean civic duties. Use municipal codes at physical bus depots or utility desk bills.</span>
      </div>
    </div>
  );
}
