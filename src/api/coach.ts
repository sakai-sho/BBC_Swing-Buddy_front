import { CoachPayload, CoachLocationPayload } from '../types/coach';

// Mock locations data
export const MOCK_LOCATIONS = [
  { id: '1', name: '東京ゴルフクラブ', prefecture: '東京都', city: '港区' },
  { id: '2', name: '大阪カントリークラブ', prefecture: '大阪府', city: '大阪市' },
  { id: '3', name: '名古屋ゴルフ場', prefecture: '愛知県', city: '名古屋市' },
  { id: '4', name: '福岡ゴルフリゾート', prefecture: '福岡県', city: '福岡市' },
  { id: '5', name: '札幌ゴルフクラブ', prefecture: '北海道', city: '札幌市' },
];

export async function uploadImage(file: File): Promise<{ url: string }> {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Validate file
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('ファイルサイズは5MB以下にしてください');
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('JPG、PNG、WebP形式のファイルのみアップロード可能です');
  }
  
  // Create mock URL (in real implementation, this would be S3/Azure Blob URL)
  const mockUrl = URL.createObjectURL(file);
  
  return { url: mockUrl };
}

export async function createCoach(payload: CoachPayload): Promise<{ coach_id: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // Check if email already exists
    const existingCoaches = JSON.parse(localStorage.getItem('sb:coaches') || '[]');
    if (existingCoaches.some((coach: any) => coach.email === payload.email)) {
      throw new Error('このメールアドレスは既に登録されています');
    }
    
    // Generate coach ID
    const coach_id = `coach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save to localStorage (mock database)
    const coachData = {
      ...payload,
      coach_id,
      created_at: new Date().toISOString(),
      status: 'pending' // pending, approved, rejected
    };
    
    existingCoaches.push(coachData);
    localStorage.setItem('sb:coaches', JSON.stringify(existingCoaches));
    
    console.log('Coach created:', coachData);
    
    return { coach_id };
  } catch (error) {
    console.error('Failed to create coach:', error);
    throw error;
  }
}

export async function createCoachLocations(items: CoachLocationPayload[]): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Save to localStorage (mock database)
    const existingLocations = JSON.parse(localStorage.getItem('sb:coach-locations') || '[]');
    
    const newLocations = items.map(item => ({
      ...item,
      id: `cl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    }));
    
    existingLocations.push(...newLocations);
    localStorage.setItem('sb:coach-locations', JSON.stringify(existingLocations));
    
    console.log('Coach locations created:', newLocations);
  } catch (error) {
    console.error('Failed to create coach locations:', error);
    throw error;
  }
}

export async function getLocations() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_LOCATIONS;
}