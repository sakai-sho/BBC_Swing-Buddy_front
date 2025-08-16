export type ReviewId = string;

export type Tool = 'select' | 'circle' | 'line' | 'angle' | 'mic' | 'text' | 'erase';

export type Point = { x: number; y: number };
export type TimeSec = number;

export type AnnotationBase = {
  id: string;
  tool: Tool;
  time: TimeSec;          // 動画上の秒
  color?: string;
  note?: string;          // テキストメモ（音声文字起こし含む）
};

export type CircleAnno = AnnotationBase & { tool: 'circle'; center: Point; radius: number };
export type LineAnno   = AnnotationBase & { tool: 'line';   from: Point;   to: Point };
export type AngleAnno  = AnnotationBase & { tool: 'angle';  a: Point; b: Point; c: Point; degrees: number };
export type TextAnno   = AnnotationBase & { tool: 'text';   at: Point; text: string };

export type Annotation = CircleAnno | LineAnno | AngleAnno | TextAnno | (AnnotationBase & { tool: 'mic' });

export type ReviewClip = {
  id: string;
  label: string;   // 01 アドレス 等
  time: TimeSec;
  thumbUrl?: string;
  annotations: Annotation[];
};

export type ReviewDraft = {
  id: ReviewId;
  videoUrl: string;
  createdAt: number;
  clips: ReviewClip[];
};

export type SubmitPayload = {
  id: ReviewId;
  clips: ReviewClip[];
};

// Legacy types for existing review system
export type ReviewStep = {
  id: string;            // 'address' | 'takeback' など
  index: number;         // 1..n
  title: string;         // 'アドレス'
  thumb: string;         // サムネURL
  note: string;          // そのステップのメモ
};

export type Review = {
  id: string;
  videoUrl: string;
  thumbUrl: string;
  club: 'Driver' | 'Iron' | 'Putter';
  tags: string[];        // ['スライス','飛距離不足']
  createdAt: string;     // '2025/08/03'
  author: { name: string; handle: string; avatar: string };
  liked: boolean;
  likeCount: number;
  commentCount: number;
  summary: string;       // 詳細セクション冒頭に表示する本文
  steps: ReviewStep[];   // タイムライン用
};