import type { Review } from '../types/review';

export const mockReviews: Review[] = [
  {
    id: '1',
    videoUrl: '/media/users/u001.mp4', // 動画パス
    thumbUrl: '/media/users/u001_thumb.jpg', // 動画サムネイル画像
    club: 'Driver',
    tags: ['スライス', '飛距離不足'],
    createdAt: '2025/08/03',
    author: {
      name: '田中プロ',
      handle: 'tanaka_pro',
      avatar: '/media/users/u001_avatar.jpg' // 静止画アバター
    },
    liked: false,
    likeCount: 24,
    commentCount: 8,
    summary: 'ドライバーでのスライスと飛距離不足について詳しく分析しました。',
    steps: [
      {
        id: 'address',
        index: 1,
        title: 'アドレス',
        thumb: '/media/users/u001_step1.jpg',
        note: 'スタンス幅が狭すぎます。肩幅より少し広めに構えましょう。'
      },
      {
        id: 'takeback',
        index: 2,
        title: 'テイクバック',
        thumb: '/media/users/u001_step2.jpg',
        note: '手首が早く返りすぎています。体の回転と同調させてください。'
      },
      {
        id: 'top',
        index: 3,
        title: 'トップ',
        thumb: '/media/users/u001_step3.jpg',
        note: 'トップでの左腕の位置が理想的です。'
      },
      {
        id: 'impact',
        index: 4,
        title: 'インパクト',
        thumb: '/media/users/u001_step4.jpg',
        note: '体重移動が不十分です。左足に体重を乗せましょう。'
      },
      {
        id: 'follow',
        index: 5,
        title: 'フォロー',
        thumb: '/media/users/u001_step5.jpg',
        note: 'フィニッシュまで振り切れています。'
      }
    ]
  },
  {
    id: '2',
    videoUrl: '/media/users/u002.mp4',
    thumbUrl: '/media/users/u002_thumb.jpg',
    club: 'Iron',
    tags: ['フック', 'ミート率'],
    createdAt: '2025/08/03',
    author: {
      name: '佐藤コーチ',
      handle: 'sato_coach',
      avatar: '/media/users/u002_avatar.jpg'
    },
    liked: true,
    likeCount: 18,
    commentCount: 12,
    summary: '7番アイアンでのフック傾向とミート率向上について分析しました。',
    steps: [
      {
        id: 'address',
        index: 1,
        title: 'アドレス',
        thumb: '/media/users/u002_step1.jpg',
        note: 'ボールポジションが右寄りです。中央よりボール1個分左へ。'
      },
      {
        id: 'takeback',
        index: 2,
        title: 'テイクバック',
        thumb: '/media/users/u002_step2.jpg',
        note: '軌道が良好です。このまま上げましょう。'
      },
      {
        id: 'downswing',
        index: 3,
        title: 'ダウンスイング',
        thumb: '/media/users/u002_step3.jpg',
        note: 'クラブが寝すぎています。立ててインパクトへ。'
      },
      {
        id: 'impact',
        index: 4,
        title: 'インパクト',
        thumb: '/media/users/u002_step4.jpg',
        note: 'ハンドファーストができています。'
      }
    ]
  },
  {
    id: '3',
    videoUrl: '/media/users/u003.mp4',
    thumbUrl: '/media/users/u003_thumb.jpg',
    club: 'Putter',
    tags: ['方向性', 'パット数'],
    createdAt: '2025/08/03',
    author: {
      name: '山田先生',
      handle: 'yamada_sensei',
      avatar: '/media/users/u003_avatar.jpg'
    },
    liked: false,
    likeCount: 15,
    commentCount: 5,
    summary: 'パッティングの方向性とパット数改善について分析しました。',
    steps: [
      {
        id: 'setup',
        index: 1,
        title: 'セットアップ',
        thumb: '/media/users/u003_step1.jpg',
        note: 'ライ角が適正です。目線はボールの真上に。'
      },
      {
        id: 'stroke',
        index: 2,
        title: 'ストローク',
        thumb: '/media/users/u003_step2.jpg',
        note: 'ストロークが安定しています。'
      },
      {
        id: 'follow',
        index: 3,
        title: 'フォロー',
        thumb: '/media/users/u003_step3.jpg',
        note: 'パターヘッドが目標方向に向いています。'
      }
    ]
  }
];
