import type { RequestItem, RequestFilters, RequestsResponse } from '../types/requests';

// Mock data for development
const MOCK_REQUESTS: RequestItem[] = [
  {
    id: '1',
    userHandle: 'sara',
    userAvatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
    level: 'beginner',
    club: 'driver',
    tags: ['スライス', '飛距離不足'],
    createdAt: '2025-01-10T20:13:00Z',
    durationSec: 45,
    reward: { kind: 'ticket', amount: 1 },
    thumbnailUrl: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=400',
    commentsCount: 20,
    status: 'new',
    unread: true,
    description: 'ドライバーでスライスが出てしまいます。飛距離も伸び悩んでいます。',
    environment: 'outdoor',
    handedness: 'right'
  },
  {
    id: '2',
    // ▼ ここを @satoshi → @koji に変更
    userHandle: 'koji',
    // ▼ アバターを public 配下の静止画に変更（例）
    userAvatar: '/media/users/u001.jpg',
    level: 'intermediate',
    club: 'iron',
    tags: ['フック', 'ミート率'],
    createdAt: '2025-01-10T23:34:00Z',
    durationSec: 60,
    reward: { kind: 'yen', amount: 3000 },
    // ▼ 上部サムネイルも public 配下に変更（例）
    thumbnailUrl: '/media/users/u001_thumb.jpg',
    commentsCount: 60,
    status: 'new',
    isFavorite: true,
    description: '7番アイアンでフックが強く出ます。ミート率を上げたいです。',
    environment: 'indoor',
    handedness: 'right'
  },
  {
    id: '3',
    userHandle: 'taro',
    userAvatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
    level: 'beginner',
    club: 'driver',
    tags: ['ダフリ', '弾道の高さ'],
    createdAt: '2025-01-10T13:07:00Z',
    durationSec: 38,
    reward: { kind: 'ticket', amount: 1 },
    thumbnailUrl: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=400',
    commentsCount: 2,
    status: 'accepted',
    description: 'ドライバーでダフリが多く、弾道が低いです。',
    environment: 'outdoor',
    handedness: 'left',
    deadline: '2025-01-12T13:07:00Z'
  },
  {
    id: '4',
    userHandle: 'keiji',
    userAvatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
    level: 'advanced',
    club: 'wedge',
    tags: ['トップ', 'リズム'],
    createdAt: '2025-01-09T09:37:00Z',
    durationSec: 52,
    reward: { kind: 'yen', amount: 5000 },
    thumbnailUrl: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=400',
    commentsCount: 2,
    status: 'completed',
    description: 'ウェッジでトップが出やすく、リズムが安定しません。',
    environment: 'outdoor',
    handedness: 'right'
  },
  {
    id: '5',
    userHandle: 'keiji',
    userAvatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
    level: 'intermediate',
    club: 'utility',
    tags: ['スライス', '方向性'],
    createdAt: '2025-01-08T15:22:00Z',
    durationSec: 41,
    reward: { kind: 'ticket', amount: 2 },
    thumbnailUrl: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=400',
    commentsCount: 8,
    status: 'new',
    description: '3番ユーティリティで方向性が安定しません。',
    environment: 'outdoor',
    handedness: 'right'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchRequests(filters: Partial<RequestFilters> = {}): Promise<RequestsResponse> {
  await delay(800); // Simulate network delay
  
  let filtered = [...MOCK_REQUESTS];
  
  // Apply filters
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(item => item.status === filters.status);
  }
  
  if (filters.club && filters.club !== 'all') {
    filtered = filtered.filter(item => item.club === filters.club);
  }
  
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(item => 
      filters.tags!.some(tag => item.tags.includes(tag))
    );
  }
  
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.userHandle.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query)) ||
      item.description?.toLowerCase().includes(query)
    );
  }
  
  if (filters.period && filters.period !== 'all') {
    const now = new Date();
    const cutoff = new Date();
    
    switch (filters.period) {
      case '24h':
        cutoff.setHours(now.getHours() - 24);
        break;
      case '3d':
        cutoff.setDate(now.getDate() - 3);
        break;
      case '7d':
        cutoff.setDate(now.getDate() - 7);
        break;
    }
    
    filtered = filtered.filter(item => new Date(item.createdAt) >= cutoff);
  }
  
  // Apply sorting
  switch (filters.sort) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'most_requests':
      filtered.sort((a, b) => b.commentsCount - a.commentsCount);
      break;
    case 'highest_reward':
      filtered.sort((a, b) => b.reward.amount - a.reward.amount);
      break;
    default:
      // Favorites first, then by newest
      filtered.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  return {
    items: filtered,
    hasMore: false // For simplicity, no pagination in mock
  };
}

export async function acceptRequest(id: string): Promise<void> {
  await delay(500);
  
  const request = MOCK_REQUESTS.find(r => r.id === id);
  if (request) {
    request.status = 'accepted';
    request.deadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hours from now
  }
}

export async function declineRequest(id: string): Promise<void> {
  await delay(500);
  
  const request = MOCK_REQUESTS.find(r => r.id === id);
  if (request) {
    request.status = 'declined';
  }
}

export async function toggleFavorite(id: string): Promise<void> {
  await delay(300);
  
  const request = MOCK_REQUESTS.find(r => r.id === id);
  if (request) {
    request.isFavorite = !request.isFavorite;
  }
}

export async function markAsRead(id: string): Promise<void> {
  await delay(200);
  
  const request = MOCK_REQUESTS.find(r => r.id === id);
  if (request) {
    request.unread = false;
  }
}

export async function getRequestById(id: string): Promise<RequestItem | null> {
  await delay(300);
  
  return MOCK_REQUESTS.find(r => r.id === id) || null;
}
