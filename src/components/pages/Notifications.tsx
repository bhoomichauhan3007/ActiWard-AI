import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  MapPin, 
  Award, 
  ShieldAlert, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsProps {
  onMarkAllRead: () => Promise<void>;
  onMarkRead: (id: string) => Promise<void>;
  setActiveTab: (tab: string) => void;
}

export default function Notifications({ onMarkAllRead, onMarkRead, setActiveTab }: NotificationsProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = () => {
  const notifications = JSON.parse(
    localStorage.getItem("actiwardNotifications") || "[]"
  );

  setItems(notifications);
};

  useEffect(() => {
    fetchNotifs();
  }, []);

  
  const handleMarkAll = async () => {

  const updated = items.map(item => ({
    ...item,
    read: true
  }));

  localStorage.setItem(
    "actiwardNotifications",
    JSON.stringify(updated)
  );

  setItems(updated);
};

  

  const handleRead = async (id: string) => {

  const updated = items.map(item =>
    item.id === id
      ? { ...item, read: true }
      : item
  );

  localStorage.setItem(
    "actiwardNotifications",
    JSON.stringify(updated)
  );

  setItems(updated);
};

  const getIconClass = (type: string) => {
    switch (type) {
      case 'status_change': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'reward_unlocked': return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'verification_alert': return 'bg-blue-50 text-blue-800 border-blue-100';
      default: return 'bg-slate-50 text-slate-800 border-slate-100';
    }
  };

  const getNotifIconNode = (type: string) => {
    switch (type) {
      case 'status_change': return <Sparkles className="h-4.5 w-4.5" />;
      case 'reward_unlocked': return <Award className="h-4.5 w-4.5" />;
      case 'verification_alert': return <ShieldAlert className="h-4.5 w-4.5" />;
      default: return <Bell className="h-4.5 w-4.5" />;
    }
  };

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="notifications-deck">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Civic Notifications <Bell className="h-6 w-6 text-emerald-800" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Stay in sync with active ward repairs, rewards unlocking logs, and verification requests.
          </p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAll}
            disabled={loading}
            className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-700 flex items-center gap-1.5 transition shrink-0 cursor-pointer disabled:bg-slate-100"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {items.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => handleRead(notif.id)}
              className={`p-5 flex gap-4 md:gap-5 items-start transition cursor-pointer ${
                notif.read ? 'bg-white opacity-80' : 'bg-emerald-50/15'
              }`}
            >
              {/* Icon box indicating category type */}
              <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${getIconClass(notif.type)}`}>
                {getNotifIconNode(notif.type)}
              </div>

              {/* Main message */}
              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className={`font-extrabold ${notif.read ? 'text-slate-700' : 'text-slate-800 font-black'}`}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(notif.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-slate-550 leading-relaxed max-w-2xl">{notif.message}</p>

                {/* Subheading meta action if notification tied to an active issue */}
                {notif.issueId && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRead(notif.id);
                      setActiveTab('nearby');
                    }}
                    className="mt-2 text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1 hover:underline"
                  >
                    Diagnose issue card <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Unread dot indicator helper */}
              {!notif.read && (
                <div className="h-2 w-2 rounded-full bg-emerald-700 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center text-slate-400 max-w-sm mx-auto space-y-2">
          <Bell className="h-10 w-10 mx-auto text-slate-300" />
          <p className="font-bold text-slate-600 text-sm">Inbox Cleared</p>
          <p className="text-xs text-slate-400">You are completely caught up with all local reports and community alerts.</p>
        </div>
      )}
    </div>
  );
}
