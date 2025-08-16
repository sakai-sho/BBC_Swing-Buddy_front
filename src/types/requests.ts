export type RequestStatus = 'new' | 'accepted' | 'completed' | 'declined';
export type Club = 'driver' | 'iron' | 'wedge' | 'putter' | 'utility' | 'wood';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type RewardType = 'ticket' | 'yen';

export type RequestItem = {
  id: string;
  userHandle: string;
  userAvatar: string;
  level: Level;
  club: Club;
  tags: string[];
  createdAt: string; // ISO string
  durationSec: number;
  reward: { 
    kind: RewardType; 
    amount: number; 
  };
  thumbnailUrl: string;
  videoUrl?: string;
  commentsCount: number;
  status: RequestStatus;
  isFavorite?: boolean;
  unread?: boolean;
  description?: string;
  environment?: 'outdoor' | 'indoor';
  handedness?: 'right' | 'left';
  deadline?: string; // ISO string
};

export type RequestFilters = {
  status: RequestStatus | 'all';
  club: Club | 'all';
  tags: string[];
  period: '24h' | '3d' | '7d' | 'all';
  sort: 'newest' | 'most_requests' | 'highest_reward';
  search: string;
};

export type RequestsResponse = {
  items: RequestItem[];
  hasMore: boolean;
  cursor?: string;
};