export type User = {
  id: string;
  displayName: string;
  avatarUrl?: string; // ない場合は ImageWithFallback のプレースホルダが出ます
};

export type Video = {
  id: string;
  userId: string;        // ← この関連が肝（動画がどのユーザーのものか）
  title?: string;
  createdAt?: string;    // ISO文字列
};
