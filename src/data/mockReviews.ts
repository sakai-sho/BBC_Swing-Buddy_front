import type { Review } from '../types/review';

export const mockReviews: Review[] = [
  {
    id: '1',
    videoUrl: '/media/users/u001.mp4',
    thumbUrl: '/media/users/u001_thumb.jpg',
    club: 'Driver',
    tags: ['スライス', '飛距離不足'],
    createdAt: '2025/08/03',
    author: {
      name: '田中プロ',
      handle: 'tanaka_pro',
      avatar: '/media/users/u001_avatar.jpg',
    },
    liked: false,
    likeCount: 24,
    commentCount: 8,
    summary: 'ドライバーでのスライスと飛距離不足について詳しく分析しました。',
    steps: [
      { id: 'address',    index: 1, title: 'アドレス',       note: 'スタンス幅が狭すぎます。肩幅より少し広めに構えましょう。',   thumb: '/media/steps/address.jpg' },
      { id: 'takeaway',   index: 2, title: 'テイクバック',   note: '手首が早く返りすぎています。体の回転と同調させてください。', thumb: '/media/steps/takeaway.jpg' },
      { id: 'top',        index: 3, title: 'トップ',         note: 'トップでの左腕の位置が理想的です。',                         thumb: '/media/steps/top.jpg' },
      { id: 'transition', index: 4, title: '切り返し',       note: '切り返しのタイミングを改善しましょう。',                     thumb: '/media/steps/transition.jpg' },
      { id: 'downswing',  index: 5, title: 'ダウンスイング', note: 'クラブが寝ないように注意してください。',                     thumb: '/media/steps/downswing.jpg' },
      { id: 'impact',     index: 6, title: 'インパクト',     note: '体重移動が不十分です。左足に体重を乗せましょう。',           thumb: '/media/steps/impact.jpg' },
      { id: 'follow',     index: 7, title: 'フォロー',       note: 'フィニッシュまで振り切れています。',                         thumb: '/media/steps/follow.jpg' },
      { id: 'finish',     index: 8, title: 'フィニッシュ',   note: 'バランス良く立てています。',                               thumb: '/media/steps/finish.jpg' },
    ],
  }
];
