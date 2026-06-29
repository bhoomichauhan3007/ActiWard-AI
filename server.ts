import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { Issue, Comment, RewardItem, NotificationItem, LeaderboardUser } from './src/types';

dotenv.config();

// In-memory Database state
let issues: Issue[] = [
  {
    id: '1',
    title: 'Deep pothole dangerously close to Hill Road junction',
    description: 'This is a massive pothole in the middle lane, right after the transit signal. Several motorbikes have swerved sharply to avoid it. Urgently needs asphalt patching before it causes a major accident.',
    category: 'pothole',
    status: 'reported',
    priority: 'high',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Hill Road, Near Signal Junction, Emerald Ward'
    },
    upvotes: 24,
    verifiedCount: 2,
    reportedBy: 'Devon Carter',
    reportedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    comments: [
      {
        id: 'c1',
        author: 'Sarah Jenkins',
        message: 'Almost hit this last night. It is hard to see in the dark!',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ],
    ward: 'Emerald Ward',
    image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'Overflowing garbage bin and plastic waste accumulation',
    description: 'Civic garbage bins have not been cleared for three days. Stray animals are scattering plastic and food waste onto the walkable pavement, blocking the pedestrian pathway and emitting a terrible stench.',
    category: 'garbage',
    status: 'verified',
    priority: 'medium',
    location: {
      lat: 12.9750,
      lng: 77.6000,
      address: '4th Cross Street, Lane 12, Emerald Ward'
    },
    upvotes: 42,
    verifiedCount: 6,
    reportedBy: 'Kofi Larsson',
    reportedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    comments: [
      {
        id: 'c2',
        author: 'Arjun Mehta',
        message: 'I have raised this with the local sweeping contractor too, but no action yet.',
        timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
      },
      {
        id: 'c3',
        author: 'Civic Bot',
        message: 'Automated Status: This issue has been verified by 5+ local citizens and forwarded to the Sanitation Department.',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
      }
    ],
    ward: 'Emerald Ward',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    title: 'Water pipeline leak spreading on the main sidewalk',
    description: 'Clean drinking water is continuously bubbling up from beneath the sidewalk pavements of Sector 3. It has started pool-flooding the driveway of neighboring houses and wasting tons of clean water.',
    category: 'water_leakage',
    status: 'dispatched',
    priority: 'high',
    location: {
      lat: 12.9692,
      lng: 77.5873,
      address: 'Main Entrance Road, Sector 3, Emerald Ward'
    },
    upvotes: 56,
    verifiedCount: 12,
    reportedBy: 'Mei Lin',
    reportedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), // 2 days ago
    comments: [
      {
        id: 'c4',
        author: 'Water Dept Admin',
        message: 'Maintenance team dispatched. Repair scheduled for Monday morning.',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
      }
    ],
    ward: 'Emerald Ward',
    image: 'https://images.unsplash.com/photo-1542013936693-8848e574047a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    title: 'Broken streetlight has left the dark alleyway unsafe',
    description: 'The streetlamp pole #SL-304 next to the community pre-school is completely dead. As there are no other surrounding lights, this lane is pitch black from 6 PM onwards and has become a safety hazard.',
    category: 'streetlight',
    status: 'resolved',
    priority: 'medium',
    location: {
      lat: 12.9800,
      lng: 77.5910,
      address: 'Greenwood Alleyway, Block C, Slate Ward'
    },
    upvotes: 18,
    verifiedCount: 8,
    reportedBy: 'Yasmin Al-Fayed',
    reportedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), // 3 days ago
    comments: [
      {
        id: 'c5',
        author: 'Yasmin Al-Fayed',
        message: 'This has been repaired perfectly! The alleyway is bright and safe now. Thank you, ActiWard!',
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
      }
    ],
    ward: 'Slate Ward',
    image: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '5',
    title: 'Clogged storm drain choking street rainwater flow',
    description: 'During yesterday\'s brief shower, the whole street intersection was flooded under 6 inches of water because plastic bags and leaves have completely choked the storm drain grates. Needs debris excavation.',
    category: 'drainage',
    status: 'reported',
    priority: 'high',
    location: {
      lat: 12.9640,
      lng: 77.5990,
      address: 'Near Pioneer Academy, Emerald Ward'
    },
    upvotes: 15,
    verifiedCount: 1,
    reportedBy: 'Kofi Larsson',
    reportedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    comments: [],
    ward: 'Emerald Ward'
  }
];

let notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Issue Dispatched',
    message: 'Your report on "Water pipeline leak spreading" has been assigned to Ward Crew #12.',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    type: 'status_change',
    read: false,
    issueId: '3'
  },
  {
    id: 'n2',
    title: 'Action Resolved!',
    message: 'Outstanding job! "Broken streetlight on Greenwood Alleyway" is now RESOLVED.',
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    type: 'status_change',
    read: true,
    issueId: '4'
  },
  {
    id: 'n3',
    title: 'Rewards Unlocked 🏆',
    message: 'You unlocked the "Pothole Patrol" badge! Go to your Rewards tab to view municipal store vouchers.',
    timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    type: 'reward_unlocked',
    read: false
  },
  {
    id: 'n4',
    title: 'Community Alert',
    message: 'A new high-priority issue: "Clogged storm drain near Pioneer Academy" was reported in your Emerald Ward.',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    type: 'verification_alert',
    read: false,
    issueId: '5'
  }
];

const rewardsList: RewardItem[] = [
  {
    id: 'r1',
    title: '1-Month Electric Bus Pass',
    cost: 150,
    category: 'Transit',
    description: 'Unlimited rides on green municipal electric shuttles and feeder buses.',
    provider: 'Department of Public Transit'
  },
  {
    id: 'r2',
    title: '$10 Clean Hydro Utility Discount',
    cost: 100,
    category: 'Utility',
    description: 'Redeemable on your monthly water or hydroelectric municipal bill.',
    provider: 'City Power & Water Corp'
  },
  {
    id: 'r3',
    title: 'Free Botanical Garden Entry Pair',
    cost: 50,
    category: 'Leisure',
    description: 'Includes regular weekend entrance slot for two adults.',
    provider: 'Parks & Recreation Division'
  },
  {
    id: 'r4',
    title: 'Biodegradable Ward Compost Bin',
    cost: 120,
    category: 'Home Eco',
    description: 'Heavy duty, premium high-aeration compost bucket with charcoal filters.',
    provider: 'Green Ward Waste Authority'
  }
];

let claimedRewards: { id: string; rewardId: string; redeemedAt: string; discountCode: string }[] = [];

let userPoints = 185;

let leaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Siddharth Nair', points: 450, impactScore: 92, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', badges: ['Eco Guardian', 'Master Verifier', 'Pothole Patrol'] },
  { rank: 2, name: 'Clarissa Santos', points: 390, impactScore: 84, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', badges: ['Sanitation Champion', 'Top Reporter'] },
  { rank: 3, name: 'Anita Sen', points: 280, impactScore: 78, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', badges: ['Water Saver'] },
  { rank: 4, name: 'Devon Carter', points: 185, impactScore: 65, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', badges: ['Active Citizen', 'Pothole Patrol'] }, // matches the mock active user
  { rank: 5, name: 'Mei Lin', points: 150, impactScore: 50, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', badges: ['Water Saver'] }
];

async function main() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get('/api/issues', (req: Request, res: Response) => {
    res.json(issues);
  });

  app.post('/api/issues', (req: Request, res: Response) => {
    const { title, description, category, priority, location, image } = req.body;
    if (!title || !description || !category || !priority || !location?.address) {
      return res.status(400).json({ error: 'Missing required issue properties' });
    }

    const newIssue: Issue = {
      id: String(issues.length + 1),
      title,
      description,
      category,
      status: 'reported',
      priority,
      location: {
        lat: location.lat || (12.9716 + (Math.random() - 0.5) * 0.02),
        lng: location.lng || (77.5946 + (Math.random() - 0.5) * 0.02),
        address: location.address
      },
      upvotes: 1,
      verifiedCount: 0,
      reportedBy: 'Devon Carter', // simulated active user
      reportedAt: new Date().toISOString(),
      comments: [],
      ward: 'Emerald Ward',
      image: image || undefined
    };

    issues.unshift(newIssue);

    // Create automated notification for Emerald Ward residents
    const newNotif: NotificationItem = {
      id: `n_auto_${Date.now()}`,
      title: 'New Issue Nearby 📍',
      message: `A new ${category.replace('_', ' ')} issue: "${title}" has been reported in Emerald Ward.`,
      timestamp: new Date().toISOString(),
      type: 'verification_alert',
      read: false,
      issueId: newIssue.id
    };
    notifications.unshift(newNotif);

    // Give points to user for reporting
    userPoints += 15;
    const userIndex = leaderboard.findIndex(u => u.name === 'Devon Carter');
    if (userIndex !== -1) {
      leaderboard[userIndex].points = userPoints;
      leaderboard[userIndex].impactScore += 5;
    }

    res.status(201).json({ issue: newIssue, pointsEarned: 15 });
  });

  app.post('/api/issues/:id/upvote', (req: Request, res: Response) => {
    const issueId = req.params.id;
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    if (issue.isUpvotedByUser) {
      issue.upvotes -= 1;
      issue.isUpvotedByUser = false;
    } else {
      issue.upvotes += 1;
      issue.isUpvotedByUser = true;
      // Award 2 points for contributing to a local issue upvote
      userPoints += 2;
    }

    // sync leaderboard user points
    const userIndex = leaderboard.findIndex(u => u.name === 'Devon Carter');
    if (userIndex !== -1) {
      leaderboard[userIndex].points = userPoints;
    }

    res.json({ issue, userPoints });
  });

  app.post('/api/issues/:id/verify', (req: Request, res: Response) => {
    const issueId = req.params.id;
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    if (issue.isVerifiedByUser) {
      issue.verifiedCount -= 1;
      issue.isVerifiedByUser = false;
    } else {
      issue.verifiedCount += 1;
      issue.isVerifiedByUser = true;

      // if verifiedCount goes past 5, automatically set state to 'verified'
      if (issue.status === 'reported' && issue.verifiedCount >= 5) {
        issue.status = 'verified';
        
        // Notify original reporter
        notifications.unshift({
          id: `n_status_${Date.now()}`,
          title: 'Citizen Verified ✅',
          message: `Your report "${issue.title}" has received sufficient community verifications and is now verified!`,
          timestamp: new Date().toISOString(),
          type: 'status_change',
          read: false,
          issueId: issue.id
        });
      }

      // Award 10 dynamic civic contribution points for validating neighbors' claims
      userPoints += 10;
    }

    // sync leaderboard
    const userIndex = leaderboard.findIndex(u => u.name === 'Devon Carter');
    if (userIndex !== -1) {
      leaderboard[userIndex].points = userPoints;
      leaderboard[userIndex].impactScore += 2;
    }

    res.json({ issue, userPoints });
  });

  app.post('/api/issues/:id/comment', (req: Request, res: Response) => {
    const issueId = req.params.id;
    const { author, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Comment message is blank' });

    const issue = issues.find(i => i.id === issueId);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: author || 'Devon Carter',
      message,
      timestamp: new Date().toISOString()
    };

    issue.comments.push(newComment);
    res.json(issue);
  });

  app.post('/api/issues/:id/status', (req: Request, res: Response) => {
    const issueId = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Missing status' });

    const issue = issues.find(i => i.id === issueId);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    const oldStatus = issue.status;
    issue.status = status;

    // Create audit comment
    issue.comments.push({
      id: `audit_${Date.now()}`,
      author: 'Municipal Council System',
      message: `Status updated from "${oldStatus}" to "${status}" by Authority administrator.`,
      timestamp: new Date().toISOString()
    });

    // Notify the reporter
    notifications.unshift({
      id: `n_status_${Date.now()}`,
      title: `Issue ${status.toUpperCase()} 🔔`,
      message: `The reported issue "${issue.title}" has progressed to ${status}.`,
      timestamp: new Date().toISOString(),
      type: 'status_change',
      read: false,
      issueId: issue.id
    });

    res.json(issue);
  });

  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(notifications);
  });

  app.post('/api/notifications/read-all', (req: Request, res: Response) => {
    notifications = notifications.map(n => ({ ...n, read: true }));
    res.json({ success: true, count: notifications.length });
  });

  app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
    const id = req.params.id;
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
    }
    res.json({ success: true });
  });

  app.get('/api/rewards', (req: Request, res: Response) => {
    res.json({
      catalog: rewardsList,
      userPoints,
      claimed: claimedRewards
    });
  });

  app.post('/api/rewards/redeem', (req: Request, res: Response) => {
    const { rewardId } = req.body;
    const reward = rewardsList.find(r => r.id === rewardId);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });

    if (userPoints < reward.cost) {
      return res.status(400).json({ error: 'Insufficient civic points' });
    }

    userPoints -= reward.cost;

    // Generate simulated discount code
    const randomCode = 'ACTI-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const claimedItem = {
      id: `claim_${Date.now()}`,
      rewardId,
      redeemedAt: new Date().toISOString(),
      discountCode: randomCode
    };

    claimedRewards.push(claimedItem);

    // Sync leaderboard
    const userIndex = leaderboard.findIndex(u => u.name === 'Devon Carter');
    if (userIndex !== -1) {
      leaderboard[userIndex].points = userPoints;
    }

    // Add notification
    notifications.unshift({
      id: `n_rew_${Date.now()}`,
      title: 'Reward Redeemed 🎉',
      message: `You successfully redeemed "${reward.title}". Your coupon is ready: ${randomCode}`,
      timestamp: new Date().toISOString(),
      type: 'reward_unlocked',
      read: false
    });

    res.json({ claimedItem, userPoints, reward });
  });

  app.get('/api/leaderboard', (req: Request, res: Response) => {
    res.json(leaderboard);
  });

  app.post('/api/ai-chat', (req: Request, res: Response) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing prompt' });

    let responseText = '';
    const query = message.toLowerCase();

    if (query.includes('pothole')) {
      responseText = `To report potholes effectively using ActiWard AI:
1. Go to **Report an Issue** page.
2. Select **Pothole** as the category.
3. Snap or upload a clear photo displaying the pothole relative to adjacent structures so inspectors can easily locate it.
4. Set the exact street spot using the map.
5. Provide details on depth (e.g., "more than 3 inches deep") and lane positioning.

*Impact note:* Repairing a high-traffic pothole saves local drivers valuable fuel, improves lane alignment stability, and prevents expensive suspension repairs!`;
    } else if (query.includes('reward') || query.includes('point')) {
      responseText = `You can earn **Civic Points** by actively contributing to the welfare of your ward:
- **Report an Issue:** Earn **+15 Points** per valid report.
- **Verify Issues:** Earn **+10 Points** for checking and confirming issues reported by other citizens.
- **Upvote Local Reports:** Earn **+2 Points** for voting on active concerns to show local significance.

Points can be redeemed in the **Rewards** panel for municipal benefits like discounts on electricity utility bills, botanical garden passes, compost bins, or electric public transit rides.`;
    } else if (query.includes('waste') || query.includes('garbage') || query.includes('litter')) {
      responseText = `Under municipal Waste Bylaw Sec 18-A:
- Solid household trash must be segregated into wet compostable organic waste (green bin) and dry recyclables (blue bin).
- Dumping public waste outside municipal bins can attract structural fines.
- If public bins are filled to capacity, report them immediately under the **Garbage** category. These are directed straight to the sanitation sweeps supervisor for emerald ward.`;
    } else if (query.includes('ward') || query.includes('emerald')) {
      responseText = `You are registered under **Emerald Ward** (Zone 4 of the metropolitan area).
- **Ward Councilor:** Hon. Elizabeth Sterling
- **Active Crew Teams:** 3 Sanitation Sweepers, 2 Road Patching Crews, and 1 Water Utility repair van.
- **Average Resolution Time:** 32 hours last month (12% faster than metropolis average!).
- **Top Issue This Week:** Trash heap overflow near Sector 4 and Water pipeline leakage outside Greenfield corridor.`;
    } else {
      responseText = `Hello! I am ActiWard's AI Civic Assistant. I help you with local bylaws, safety rules, reporting guides, and ward-specific details.

Here are topics you can ask me:
- *"How can I report a persistent pothole?"*
- *"Tell me about waste segregation rules in my ward"*
- *"How do I earn and redeem Civic Points?"*
- *"Tell me about the authorities in Emerald Ward"*

Feel free to ask anyway, and I will try my best to answer with ward-specific civic knowledge!`;
    }

    res.json({
      message: responseText,
      timestamp: new Date().toISOString(),
      author: 'ActiWard AI'
    });
  });

  // Serve static assets in production, otherwise mount Vite in dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
});
