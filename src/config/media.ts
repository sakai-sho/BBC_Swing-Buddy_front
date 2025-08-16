// 画像パスを一元管理。実ファイルが無い場合は ImageWithFallback の fallback が効きます。
export const BG_IMG = '/images/bg.jpg';           // 既存の bg.jpg をここに配置（public/images/bg.jpg）
export const AVATAR_IMG = '/media/avatar.jpg';    // 無ければ fallback 表示
export const DEMO_IMG = '/media/demo.jpg';        // 無ければ fallback 表示

// 必須ではないが、将来の差し替えやCDN切替を楽にするためのエイリアス
export const PLACEHOLDER = '/placeholder.svg';


// ★IDごとのサムネ差し替えマップ（無いIDは DEMO_THUMB が使われます）
export const VIDEO_THUMBS: Record<string, string> = {
  '1': '/media/thumbs/1.jpg',
  '2': '/media/thumbs/2.jpg',
  '3': '/media/thumbs/3.jpg',
  '4': '/media/thumbs/4.jpg',
  '5': '/media/thumbs/5.jpg',
  '6': '/media/thumbs/6.jpg',
  // 追加したくなったらここに増やすだけ
};
