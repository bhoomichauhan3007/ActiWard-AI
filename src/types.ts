export type IssueStatus = 'reported' | 'verified' | 'dispatched' | 'resolved';
export type IssuePriority = 'low' | 'medium' | 'high';
export type IssueCategory = 'pothole' | 'garbage' | 'water_leakage' | 'streetlight' | 'drainage' | 'other';

export interface Comment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  upvotes: number;
  verifiedCount: number;
  reportedBy: string;
  reportedAt: string;
  image?: string;
  comments: Comment[];
  ward: string;
  isUpvotedByUser?: boolean;
  isVerifiedByUser?: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  category: string;
  description: string;
  provider: string;
  discountCode?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'status_change' | 'reward_unlocked' | 'verification_alert' | 'announcement';
  read: boolean;
  issueId?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  impactScore: number;
  avatar: string;
  badges: string[];
}
