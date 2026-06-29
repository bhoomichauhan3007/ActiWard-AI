import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  CheckSquare, 
  FileText, 
  Sparkles, 
  Activity, 
  Award, 
  Bell, 
  User, 
  Settings, 
  Layers, 
  Menu, 
  X,
  Target,
  Search,
  CheckCircle2,
  Calendar,
  Compass,
  AlertTriangle,
  Heart,
  Droplet
} from 'lucide-react';
import { Issue, IssueStatus, IssueCategory, IssuePriority } from './types';

// Page components imports
import Dashboard from './components/pages/Dashboard';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import ReportIssue from './components/pages/ReportIssue';
import CommunityMap from './components/pages/CommunityMap';
import NearbyIssues from './components/pages/NearbyIssues';
import VerifyReports from './components/pages/VerifyReports';
import MyReports from './components/pages/MyReports';
import AICivicAssistant from './components/pages/AICivicAssistant';
import ImpactDashboard from './components/pages/ImpactDashboard';
import Rewards from './components/pages/Rewards';
import Notifications from './components/pages/Notifications';
import Profile from './components/pages/Profile';
import AdminDashboard from './components/pages/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authPage, setAuthPage] = useState<'register' | 'login'>('register');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [issues, setIssues] = useState<Issue[]>([]);
  const [userPoints, setUserPoints] = useState(185);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  // Mobile sidebar states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch central issues data and notifications state initially
  const fetchData = async () => {
    try {
      const issuesRes = await fetch('/api/issues');
      if (issuesRes.ok) {
        const data = await issuesRes.json();
        setIssues(data);
      }

      const notifsRes = await fetch('/api/notifications');
      if (notifsRes.ok) {
        const notifs = await notifsRes.json();
        setUnreadNotifs(notifs.filter((n: any) => !n.read).length);
      }

      const rewardsRes = await fetch('/api/rewards');
      if (rewardsRes.ok) {
        const rewardsData = await rewardsRes.json();
        setUserPoints(rewardsData.userPoints);
      }
    } catch (e) {
      console.error('Failed to sync master datasets:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);


  useEffect(() => {
  const savedLogin = localStorage.getItem('isLoggedIn');
  const savedUser = localStorage.getItem('actiwardUser');

  if (savedLogin === 'true' && savedUser) {
    setCurrentUser(JSON.parse(savedUser));
    setIsLoggedIn(true);
  }
}, []);


  // Handle post issue
  const handleSubmitIssue = async (newIssueData: {
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
  
}) => {

  const savedUser = JSON.parse(
    localStorage.getItem('actiwardUser') || '{}'
  );

  const existingReports = JSON.parse(
    localStorage.getItem('actiwardReports') || '[]'
  );

  const newReport = {
    id: Date.now(),
    user: savedUser.name,
    email: savedUser.email,

    title: newIssueData.title,
    description: newIssueData.description,

    category: newIssueData.category,
    priority: newIssueData.priority,

    location: newIssueData.location.address,
    image: newIssueData.image,

    aiSeverity: newIssueData.aiSeverity,
    aiDepartment: newIssueData.aiDepartment,
    aiSummary: newIssueData.aiSummary,
    aiConfidence: newIssueData.aiConfidence,
    aiRecommendedAction: newIssueData.aiRecommendedAction,
    status: "Pending",

    createdAt: new Date().toLocaleString()
};

console.log("NEW REPORT:", newReport);



  existingReports.push(newReport);

  localStorage.setItem(
    'actiwardReports',
    JSON.stringify(existingReports)
  );

  const notifications = JSON.parse(
  localStorage.getItem("actiwardNotifications") || "[]"
);

notifications.unshift({
  id: Date.now(),
  type: "status_change",
  timestamp: new Date().toISOString(),
  read: false
});

localStorage.setItem(
  "actiwardNotifications",
  JSON.stringify(notifications)
);

notifications.unshift({
  id: Date.now(),
  title: "Report Deleted",
  message: "Your report has been removed.",
  type: "status_change",
  timestamp: new Date().toISOString(),
  read: false
});

  return {
    pointsEarned: 15
  };
};

  const handleRegister = (user: {
  name: string;
  email: string;
  phone: string;
  area: string;
  password: string;
}) => {
  localStorage.setItem('actiwardUser', JSON.stringify(user));
  alert('Registration Successful! Please Login.');
  setAuthPage('login');
};

const handleLogin = (email: string, password: string) => {
  const savedUser = localStorage.getItem('actiwardUser');

  if (!savedUser) {
    alert('No user found. Please register first.');
    return;
  }

  const user = JSON.parse(savedUser);

  if (
    user.email === email &&
    user.password === password
  ) {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  } else {
    alert('Invalid email or password');
  }
};

  // Upvote project
  const handleUpvoteIssue = async (issueId: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/upvote`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Verify project
  const handleVerifyIssue = async (issueId: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/verify`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
    const notifications = JSON.parse(
      localStorage.getItem("actiwardNotifications") || "[]"
    );

    notifications.unshift({
      id: Date.now(),
      title: "Issue Verified",
      message: "A citizen has verified your report.",
      type: "verification_alert",
      timestamp: new Date().toISOString(),
      read: false
    });

    notifications.unshift({
      id: Date.now(),
      title: "Issue Resolved",
      message: "Great news! Your reported issue has been resolved.",
      type: "status_change",
      timestamp: new Date().toISOString(),
      read: false
    });

    notifications.unshift({
      id: Date.now(),
      title: "Badge Unlocked",
      message: "Congratulations! You earned the Active Citizen Badge.",
      type: "reward_unlocked",
      timestamp: new Date().toISOString(),
      read: false
    });

    localStorage.setItem("actiwardNotifications", JSON.stringify(notifications));

  };

  
  // Dispatch comment
  const handleAddComment = async (issueId: string, author: string, message: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, message })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Admin direct status updating
  const handleUpdateStatus = async (issueId: string, status: IssueStatus) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Redeem reward voucher points
  const handleRedeemReward = async (rewardId: string) => {
    try {
      const response = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId })
      });
      if (response.ok) {
        const data = await response.json();
        fetchData();
        return data;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Mark single read
  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Main vertical sidebar navigator list matching modern dashboard expectations
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'report', label: 'Report an Issue', icon: FileText, highlight: true },
    { id: 'map', label: 'Community Map', icon: Layers },
    { id: 'nearby', label: 'Nearby Issues', icon: MapPin },
    { id: 'verify', label: 'Verify Reports', icon: CheckSquare },
    { id: 'my-reports', label: 'My Reports', icon: Target },
    { id: 'assistant', label: 'AI Civic Assistant', icon: Sparkles },
    { id: 'impact', label: 'Impact Dashboard', icon: Activity },
    { id: 'rewards', label: 'Rewards Hub', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell, badgeCount: unreadNotifs },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'admin', label: 'Admin Dispatcher', icon: Settings }
  ];

  const currentTabLabel = NAV_ITEMS.find(n => n.id === activeTab)?.label || 'Platform';

  
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  setCurrentUser(null);
  setIsLoggedIn(false);
  setAuthPage('login');
};

if (!isLoggedIn) {
  return authPage === 'register' ? (
    <Register
      onRegister={handleRegister}
      goToLogin={() => setAuthPage('login')}
    />
  ) : (
    <Login
      onLogin={handleLogin}
      goToRegister={() => setAuthPage('register')}
    />
  );
}


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="actiward-root">
      
      {/* Top Header bar matching image spec */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-white shadow-sm font-black text-lg">
            A
          </span>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">ActiWard AI</h1>
            <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">Hyperlocal Civic Portal</span>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setActiveTab('notifications'); handleMarkAllRead(); }}
            className="p-2 text-slate-550 hover:text-slate-800 hover:bg-slate-50 rounded-xl relative transition cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-white" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 p-1 px-2.5 hover:bg-slate-50 rounded-xl transition cursor-pointer border border-slate-100"
          >
            <div className="h-8 w-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold">
  {currentUser?.name?.charAt(0).toUpperCase() || 'C'}
</div>
            <span className="text-xs font-bold text-slate-700 hidden md:inline">
              {currentUser?.name || 'Citizen'}
            </span>
          </button>

          {/* Mobile open drawer menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-550 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>
      </header>

      {/* Main layout splitting into sidebar (desktop) + dynamic views */}
      <div className="flex-1 flex" id="actiward-stage">
        
        {/* Desktop Navigation Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-100/80 p-5 space-y-6 hidden lg:block shrink-0">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pl-2">Navigation Menu</div>
          
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-bold text-xs transition cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-800 to-emerald-950 text-white shadow-xs' 
                      : item.highlight 
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`h-4.5 w-4.5 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Environmental carbon saver counter */}
          <div className="rounded-xl bg-[#ecfdf5] border border-emerald-100 p-4 shrink-0 text-center space-y-1.5">
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold uppercase px-2 py-0.5 rounded-full inline-block">🐾 Carbon Saved</span>
            <p className="text-xs text-slate-650 mt-1 leading-relaxed">
              Your reporting prevented <strong className="text-emerald-900 font-bold">180 Kg CO2</strong> from escaping in Emerald Ward this month!
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Sidebar Drawer (overlapped) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm" id="mobile-sidebar-drawer">
            <div className="w-72 bg-white h-full p-5 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 bg-emerald-800 text-white text-base font-black rounded-lg flex items-center justify-center">A</span>
                    <span className="font-extrabold text-sm">ActiWard AI Menu</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-50"><X className="h-5 w-5" /></button>
                </div>

                <nav className="space-y-1 pt-4">
                  {NAV_ITEMS.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-bold text-xs transition cursor-pointer ${
                          isActive 
                            ? 'bg-emerald-800 text-white' 
                            : item.highlight 
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'text-slate-550 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className="h-4.5 w-4.5 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badgeCount !== undefined && item.badgeCount > 0 && (
                          <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded-full">{item.badgeCount}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500">
                Log concerns promptly to keep citizens and councils safe.
              </div>
            </div>
            
            {/* Click blank space to close */}
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Dynamic page container */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto" id="actiward-viewport">
          {activeTab === 'dashboard' && (
            <Dashboard 
              issues={issues} 
              userPoints={userPoints} 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'report' && (
            <ReportIssue 
              onSubmitIssue={handleSubmitIssue} 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'map' && (
            <CommunityMap 
              issues={issues} 
              onUpvoteIssue={handleUpvoteIssue} 
              onVerifyIssue={handleVerifyIssue} 
            />
          )}

          {activeTab === 'nearby' && (
            <NearbyIssues 
              issues={issues} 
              onUpvoteIssue={handleUpvoteIssue} 
              onVerifyIssue={handleVerifyIssue} 
              onAddComment={handleAddComment} 
            />
          )}

          {activeTab === 'verify' && (
            <VerifyReports 
              issues={issues} 
              onVerifyIssue={handleVerifyIssue} 
              userPoints={userPoints} 
            />
          )}

          {activeTab === 'my-reports' && (
            <MyReports 
              issues={issues} 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'assistant' && (
            <AICivicAssistant />
          )}

          {activeTab === 'impact' && (
            <ImpactDashboard />
          )}

          {activeTab === 'rewards' && (
            <Rewards 
              onRedeemReward={handleRedeemReward} 
              userPoints={userPoints} 
            />
          )}

          {activeTab === 'notifications' && (
            <Notifications 
              onMarkAllRead={handleMarkAllRead} 
              onMarkRead={handleMarkRead} 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'profile' && (
            <Profile />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard 
              issues={issues} 
              onUpdateStatus={handleUpdateStatus} 
            />
          )}
        </main>

      </div>

      {/* Mobile Sticky Navigation tabs */}
      <footer className="sticky bottom-0 bg-white border-t border-slate-100 lg:hidden py-2 px-3 flex justify-around items-center text-[10px] text-slate-500 z-40 select-none">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === 'dashboard' ? 'text-emerald-850 font-bold' : ''}`}
        >
          <Activity className="h-4.5 w-4.5" />
          <span>Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === 'report' ? 'text-emerald-850 font-bold' : ''}`}
        >
          <FileText className="h-4.5 w-4.5" />
          <span>Report</span>
        </button>

        <button 
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === 'map' ? 'text-emerald-850 font-bold' : ''}`}
        >
          <Layers className="h-4.5 w-4.5" />
          <span>Map</span>
        </button>

        <button 
          onClick={() => setActiveTab('rewards')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === 'rewards' ? 'text-emerald-850 font-bold' : ''}`}
        >
          <Award className="h-4.5 w-4.5" />
          <span>Rewards</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === 'profile' ? 'text-emerald-850 font-bold' : ''}`}
        >
          <User className="h-4.5 w-4.5" />
          <span>Profile</span>
        </button>
      </footer>

    </div>
  );
}
