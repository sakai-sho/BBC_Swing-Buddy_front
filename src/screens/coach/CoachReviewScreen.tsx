// << 以下、貼り替え用フルコード >>

import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Circle,
  Minus,
  Triangle,
  Mic,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Save,
  Send
} from 'lucide-react';
import { VideoCanvas } from '../../components/review/VideoCanvas';
import { Timeline } from '../../components/review/Timeline';
import {
  loadDraft,
  saveDraft,
  createDefaultDraft,
  deleteDraft
} from '../../store/reviewStore';
import type {
  ReviewDraft,
  Tool,
  Annotation,
  ReviewClip
} from '../../types/review';

export type CoachReviewScreenProps = {
  requestId: string;
  onBack: () => void;
  onSubmitted: (id: string) => void;
};

// 8ステップの定義
const STEPS = [
  { key: 'address', label: 'アドレス' },
  { key: 'backswing', label: 'バックスイング' },
  { key: 'top', label: 'トップ' },
  { key: 'transition', label: '切り返し' },
  { key: 'downswing', label: 'ダウンスイング' },
  { key: 'impact', label: 'インパクト' },
  { key: 'follow_through', label: 'フォロースルー' },
  { key: 'finish', label: 'フィニッシュ' }
] as const;
type StepKey = (typeof STEPS)[number]['key'];

export const CoachReviewScreen: React.FC<CoachReviewScreenProps> = ({
  requestId,
  onBack,
  onSubmitted
}) => {
  const videoUrl = '/videos/sample.mp4';

  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [undoStack, setUndoStack] = useState<Annotation[][]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[][]>([]);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // ▼ 追加：ステップ管理
  const [currentStep, setCurrentStep] = useState<StepKey>('address');
  const initialSteps = Object.fromEntries(
    STEPS.map((s) => [s.key, { frameUrl: '', comment: '' }])
  ) as Record<StepKey, { frameUrl: string; comment: string }>;

  const [stepsData, setStepsData] = useState(initialSteps);

  useEffect(() => {
    let loadedDraft = loadDraft(requestId);
    if (!loadedDraft) {
      loadedDraft = createDefaultDraft(requestId, videoUrl);
      saveDraft(loadedDraft);
    }
    setDraft(loadedDraft);
    setSelectedClip(loadedDraft.clips[0]?.id || null);
  }, [requestId, videoUrl]);

  useEffect(() => {
    if (draft) {
      saveDraft(draft);
    }
  }, [draft]);

  const getCurrentClip = useCallback(() => {
    if (!draft || !selectedClip) return null;
    return draft.clips.find((c) => c.id === selectedClip) || null;
  }, [draft, selectedClip]);

  // ▼ ステップ：フレーム保存
  const handleSaveFrame = (step: StepKey, url: string) => {
    setStepsData((prev) => ({
      ...prev,
      [step]: { ...prev[step], frameUrl: url }
    }));
  };

  // ▼ ステップ：コメント入力
  const handleChangeComment = (step: StepKey, value: string) => {
    setStepsData((prev) => ({
      ...prev,
      [step]: { ...prev[step], comment: value }
    }));
  };

  const addAnnotation = useCallback(
    (annotation: Annotation) => {
      if (!draft || !selectedClip) return;
      const currentClip = getCurrentClip();
      if (!currentClip) return;

      setUndoStack((prev) => [...prev, currentClip.annotations]);
      setRedoStack([]);

      const updatedClip: ReviewClip = {
        ...currentClip,
        annotations: [...currentClip.annotations, annotation]
      };
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          clips: prev.clips.map((c) =>
            c.id === selectedClip ? updatedClip : c
          )
        };
      });
    },
    [draft, selectedClip, getCurrentClip]
  );

  const updateAnnotation = useCallback(
    (annotation: Annotation) => {
      if (!draft || !selectedClip) return;
      const currentClip = getCurrentClip();
      if (!currentClip) return;

      const updatedClip: ReviewClip = {
        ...currentClip,
        annotations: currentClip.annotations.map((a) =>
          a.id === annotation.id ? annotation : a
        )
      };
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          clips: prev.clips.map((c) =>
            c.id === selectedClip ? updatedClip : c
          )
        };
      });
    },
    [draft, selectedClip, getCurrentClip]
  );

  const deleteAnnotation = useCallback(
    (annotationId: string) => {
      if (!draft || !selectedClip) return;
      const currentClip = getCurrentClip();
      if (!currentClip) return;

      setUndoStack((prev) => [...prev, currentClip.annotations]);
      setRedoStack([]);

      const updatedClip: ReviewClip = {
        ...currentClip,
        annotations: currentClip.annotations.filter(
          (a) => a.id !== annotationId
        )
      };
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          clips: prev.clips.map((c) =>
            c.id === selectedClip ? updatedClip : c
          )
        };
      });
    },
    [draft, selectedClip, getCurrentClip]
  );

  const handleUndo = () => {
    if (!draft || !selectedClip || undoStack.length === 0) return;
    const currentClip = getCurrentClip();
    if (!currentClip) return;

    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, currentClip.annotations]);
    setUndoStack((prev) => prev.slice(0, -1));

    const updatedClip: ReviewClip = {
      ...currentClip,
      annotations: previous
    };
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: prev.clips.map((c) =>
          c.id === selectedClip ? updatedClip : c
        )
      };
    });
  };

  const handleRedo = () => {
    if (!draft || !selectedClip || redoStack.length === 0) return;
    const currentClip = getCurrentClip();
    if (!currentClip) return;

    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, currentClip.annotations]);
    setRedoStack((prev) => prev.slice(0, -1));

    const updatedClip: ReviewClip = {
      ...currentClip,
      annotations: next
    };
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: prev.clips.map((c) =>
          c.id === selectedClip ? updatedClip : c
        )
      };
    });
  };

  const handleMicTool = async () => {
    if (isRecording) {
      setIsRecording(false);
      const mockTranscription =
        '音声文字起こしのサンプルテキストです。';
      const annotation: Annotation = {
        id: crypto.randomUUID(),
        tool: 'mic',
        time: currentTime,
        note: mockTranscription
      };
      addAnnotation(annotation);
      return;
    }
    setIsRecording(true);
    setTimeout(() => setIsRecording(false), 3000);
  };

  const handleAddClip = () => {
    if (!draft) return;
    const newClip: ReviewClip = {
      id: crypto.randomUUID(),
      label: `${String(draft.clips.length + 1).padStart(2, '0')} 新しいクリップ`,
      time: currentTime,
      annotations: []
    };
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: [...prev.clips, newClip]
      };
    });
    setSelectedClip(newClip.id);
  };

  const handleUpdateClip = (updated: ReviewClip) => {
    if (!draft) return;
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: prev.clips.map((c) =>
          c.id === updated.id ? updated : c
        )
      };
    });
  };

  const handleDeleteClip = (clipId: string) => {
    if (!draft) return;
    setDraft((prev) => {
      if (!prev) return prev;
      const filtered = prev.clips.filter((c) => c.id !== clipId);
      return {
        ...prev,
        clips: filtered
      };
    });
    if (selectedClip === clipId) {
      setSelectedClip(
        draft.clips.find((c) => c.id !== clipId)?.id || null
      );
    }
  };

  const handleSaveDraft = () => {
    if (!draft) return;
    saveDraft(draft);
    const toast = document.createElement('div');
    toast.className =
      'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = '下書きを保存しました';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
  };

  const handleSubmit = () => {
    if (!draft) return;
    deleteDraft(draft.id);
    console.log('submit', {
      id: draft.id,
      clips: draft.clips,
      steps: stepsData // ← ステップ添削内容
    });
    const toast = document.createElement('div');
    toast.className =
      'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = '添削を提出しました';
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) document.body.removeChild(toast);
      onSubmitted(requestId);
    }, 2000);
  };

  const tools = [
    { tool: 'select', icon: <div className="w-4 h-4 border" />, label: '選択' },
    { tool: 'circle', icon: <Circle size={20} />, label: '円' },
    { tool: 'line', icon: <Minus size={20} />, label: '線' },
    { tool: 'angle', icon: <Triangle size={20} />, label: '角度' },
    { tool: 'mic', icon: <Mic size={20} />, label: '音声' },
    { tool: 'text', icon: <Type size={20} />, label: 'テキスト' },
    { tool: 'erase', icon: <Eraser size={20} />, label: '消去' }
  ] as const;

  if (!draft) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        読み込み中...
      </div>
    );
  }

  const currentClip = getCurrentClip();

  return (
    <div className="max-w-[430px] mx-auto bg-white h-full shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* STEP TAB */}
      <div className="flex overflow-x-auto gap-1 p-2 bg-gray-900 text-white">
        {STEPS.map((s) => (
          <button
            key={s.key}
            className={`px-3 py-1 rounded-full text-sm ${
              currentStep === s.key
                ? 'bg-purple-600'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            onClick={() => setCurrentStep(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm">添削ワークスペース</h1>
        <div className="w-8" />
      </div>

      {/* VIDEO + TOOLBAR */}
      <div className="p-4 relative">
        <VideoCanvas
          videoUrl={videoUrl}
          currentTime={currentTime}
          tool={selectedTool}
          annotations={currentClip?.annotations || []}
          onTimeChange={setCurrentTime}
          onAdd={addAnnotation}
          onUpdate={updateAnnotation}
          onDelete={deleteAnnotation}
          // ▼ フレーム保存時はURLを取得して保存
          onSaveFrame={(url: string) => handleSaveFrame(currentStep, url)}
        />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg space-y-2">
          {tools.map((t) => (
            <button
              key={t.tool}
              onClick={() => {
                if (t.tool === 'mic') handleMicTool();
                else setSelectedTool(t.tool);
              }}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                selectedTool === t.tool
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
          <div className="border-t border-white/20 pt-2 space-y-2">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="w-8 h-8 flex items-center justify-center rounded bg-white/20 disabled:opacity-40"
            >
              <Undo2 size={18} />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="w-8 h-8 flex items-center justify-center rounded bg-white/20 disabled:opacity-40"
            >
              <Redo2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* コメント入力欄 */}
      <div className="px-4 pb-4">
        <textarea
          className="w-full border rounded-lg p-2"
          rows={3}
          placeholder="コメントを入力してください"
          value={stepsData[currentStep].comment}
          onChange={(e) =>
            handleChangeComment(currentStep, e.target.value)
          }
        />
      </div>

      {/* TIMELINE */}
      <div className="flex-1">
        <Timeline
          clips={draft.clips}
          currentTime={currentTime}
          onSeek={setCurrentTime}
          onAddClip={handleAddClip}
          onUpdateClip={handleUpdateClip}
          onDeleteClip={handleDeleteClip}
        />
      </div>

      {/* ACTIONS */}
      <div className="p-4 flex gap-2">
        <button
          onClick={handleSaveDraft}
          className="flex items-center gap-2 px-4 py-3 bg-white/20 text-white rounded-lg flex-none"
        >
          <Save size={20} /> 下書き保存
        </button>
        <button
          onClick={() => setShowSubmitConfirm(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg"
        >
          <Send size={20} /> 提出
        </button>
      </div>

      {/* SUBMIT MODAL */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-medium text-lg mb-2">添削を提出</h3>
            <p className="text-white/70 text-sm mb-6">
              この添削を提出しますか？提出後は編集できません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-3 px-4 bg-white/10 text-white rounded-lg"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg"
              >
                提出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORDING BANNER */}
      {isRecording && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          録音中...
        </div>
      )}
    </div>
  );
};
