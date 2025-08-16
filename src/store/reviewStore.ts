// src/store/reviewStore.ts
// ———————————————————————————————————————
// Review draft storage (localStorage) + helpers
// ———————————————————————————————————————

export type ReviewId = string;

export type Point = { x: number; y: number };

export type Annotation =
  | { id: string; tool: 'circle'; center: Point; radius: number; time: number }
  | { id: string; tool: 'line'; from: Point; to: Point; time: number }
  | { id: string; tool: 'text'; at: Point; text: string; time: number };

export type ReviewClip = {
  id: string;
  label: string;
  time: number;
  annotations: Annotation[];
};

export type ReviewDraft = {
  id: ReviewId;
  videoUrl: string;
  createdAt: number;
  clips: ReviewClip[];
};

const KEY_PREFIX = 'sb:review:draft:';

export function loadDraft(id: ReviewId): ReviewDraft | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + id);
    return raw ? (JSON.parse(raw) as ReviewDraft) : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft: ReviewDraft): void {
  try {
    localStorage.setItem(KEY_PREFIX + draft.id, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function deleteDraft(id: ReviewId): void {
  try {
    localStorage.removeItem(KEY_PREFIX + id);
  } catch {
    // ignore
  }
}

// ←←← ここが今回の重複箇所。定義はこの1つだけにします。
export function createDefaultDraft(id: ReviewId, videoUrl: string): ReviewDraft {
  return {
    id,
    videoUrl,
    createdAt: Date.now(),
    clips: [
      { id: 'c1', label: '01 アドレス', time: 0, annotations: [] },
      { id: 'c2', label: '02 テイクバック', time: 0, annotations: [] },
      { id: 'c3', label: '03 ハーフウェイバック', time: 0, annotations: [] },
      { id: 'c4', label: '04 トップ', time: 0, annotations: [] },
    ],
  };
}