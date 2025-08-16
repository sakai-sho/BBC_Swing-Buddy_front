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
  Send,
  Plus
} from 'lucide-react';
import { VideoCanvas } from '../../components/review/VideoCanvas';
import { Timeline } from '../../components/review/Timeline';
import { loadDraft, saveDraft, createDefaultDraft, deleteDraft } from '../../store/reviewStore';
import type { ReviewDraft, Tool, Annotation, ReviewClip } from '../../types/review';

export type CoachReviewScreenProps = {
  requestId: string;
  onBack: () => void;
  onSubmitted: (id: string) => void;
};

export const CoachReviewScreen: React.FC<CoachReviewScreenProps> = ({
  requestId,
  onBack,
  onSubmitted
}) => {
  // Mock video URL for the request
  const videoUrl = '/videos/sample.mp4';
  
  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [undoStack, setUndoStack] = useState<Annotation[][]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[][]>([]);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Initialize draft
  useEffect(() => {
    let loadedDraft = loadDraft(requestId);
    if (!loadedDraft) {
      loadedDraft = createDefaultDraft(requestId, videoUrl);
      saveDraft(loadedDraft);
    }
    setDraft(loadedDraft);
    setSelectedClip(loadedDraft.clips[0]?.id || null);
  }, [requestId, videoUrl]);

  // Auto-save draft
  useEffect(() => {
    if (draft) {
      saveDraft(draft);
    }
  }, [draft]);

  const getCurrentClip = useCallback(() => {
    if (!draft || !selectedClip) return null;
    return draft.clips.find(c => c.id === selectedClip) || null;
  }, [draft, selectedClip]);

  const addAnnotation = useCallback((annotation: Annotation) => {
    if (!draft || !selectedClip) return;

    const currentClip = getCurrentClip();
    if (!currentClip) return;

    // Save current state for undo
    setUndoStack(prev => [...prev, currentClip.annotations]);
    setRedoStack([]);

    const updatedClip: ReviewClip = {
      ...currentClip,
      annotations: [...currentClip.annotations, annotation]
    };

    setDraft(prev => {
      if (!prev) return prev;
      const newDraft = {
        ...prev,
        clips: prev.clips.map(c => c.id === selectedClip ? updatedClip : c)
      };
      return newDraft;
    });
  }, [draft, selectedClip, getCurrentClip]);

  const updateAnnotation = useCallback((annotation: Annotation) => {
    if (!draft || !selectedClip) return;

    const currentClip = getCurrentClip();
    if (!currentClip) return;

    const updatedClip: ReviewClip = {
      ...currentClip,
      annotations: currentClip.annotations.map(a => a.id === annotation.id ? annotation : a)
    };

    setDraft(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: prev.clips.map(c => c.id === selectedClip ? updatedClip : c)
      };
    });
  }, [draft, selectedClip, getCurrentClip]);

  const deleteAnnotation = useCallback((annotationId: string) => {
    if (!draft || !selectedClip) return;

    const currentClip = getCurrentClip();
    if (!currentClip) return;

    // Save current state for undo
    setUndoStack(prev => [...prev, currentClip.annotations]);
    setRedoStack([]);

    const updatedClip: ReviewClip = {
      ...currentClip,
      annotations: currentClip.annotations.filter(a => a.id !== annotationId)
    };

    setDraft(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: prev.clips.map(c => c.id === selectedClip ? updatedClip : c)
      };
    });
  }, [draft, selectedClip, getCurrentClip]);

  const handleUndo = () => {
    if (!draft || !selectedClip || undoStack.length === 0) return;

    const currentClip = getCurrentClip();
    if (!currentClip) return;

    const previousAnnotations = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, currentClip.annotations]);
    setUndoStack(prev => prev.slice(0, -1));

    const updatedClip: ReviewClip = {
      ...currentClip,
      annotations: previousAnnotations
    };

    setDraft(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: prev.clips.map(c => c.id === selectedClip ? updatedClip : c)
      };
    });
  };

  const handleRedo = () => {
    if (!draft || !selectedClip || redoStack.length === 0) return;

    const currentClip = getCurrentClip();
    if (!currentClip) return;

    const nextAnnotations = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, currentClip.annotations]);
    setRedoStack(prev => prev.slice(0, -1));

    const updatedClip: ReviewClip = {
      ...currentClip,
      annotations: nextAnnotations
    };

    setDraft(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: prev.clips.map(c => c.id === selectedClip ? updatedClip : c)
      };
    });
  };

  const handleMicTool = async () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording and create text annotation
      const mockTranscription = "音声文字起こしのサンプルテキストです。実際の実装では Web Speech API を使用します。";
      
      const annotation: Annotation = {
        id: crypto.randomUUID(),
        tool: 'mic',
        time: currentTime,
        note: mockTranscription
      };
      
      addAnnotation(annotation);
      return;
    }

    // Start recording
    setIsRecording(true);
    
    // Mock recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
    }, 3000);
  };

  const handleAddClip = () => {
    if (!draft) return;

    const newClip: ReviewClip = {
      id: crypto.randomUUID(),
      label: `${String(draft.clips.length + 1).padStart(2, '0')} 新しいクリップ`,
      time: currentTime,
      annotations: []
    };

    setDraft(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: [...prev.clips, newClip]
      };
    });

    setSelectedClip(newClip.id);
  };

  const handleUpdateClip = (updatedClip: ReviewClip) => {
    if (!draft) return;

    setDraft(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clips: prev.clips.map(c => c.id === updatedClip.id ? updatedClip : c)
      };
    });
  };

  const handleDeleteClip = (clipId: string) => {
    if (!draft) return;

    setDraft(prev => {
      if (!prev) return prev;
      const newClips = prev.clips.filter(c => c.id !== clipId);
      return {
        ...prev,
        clips: newClips
      };
    });

    if (selectedClip === clipId) {
      setSelectedClip(draft.clips.find(c => c.id !== clipId)?.id || null);
    }
  };

  const handleSaveDraft = () => {
    if (draft) {
      saveDraft(draft);
      // Show toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = '下書きを保存しました';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 2000);
    }
  };

  const handleSubmit = () => {
    if (!draft) return;

    console.log('submit', {
      id: draft.id,
      clips: draft.clips
    });

    // Delete draft
    deleteDraft(draft.id);

    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = '添削を提出しました';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
      onSubmitted(requestId);
    }, 2000);
  };

  const tools: { tool: Tool; icon: React.ReactNode; label: string }[] = [
    { tool: 'select', icon: <div className="w-4 h-4 border border-current"></div>, label: '選択' },
    { tool: 'circle', icon: <Circle size={20} />, label: '円' },
    { tool: 'line', icon: <Minus size={20} />, label: '線' },
    { tool: 'angle', icon: <Triangle size={20} />, label: '角度' },
    { tool: 'mic', icon: <Mic size={20} />, label: '音声' },
    { tool: 'text', icon: <Type size={20} />, label: 'テキスト' },
    { tool: 'erase', icon: <Eraser size={20} />, label: '消去' }
  ];

  if (!draft) {
    return (
      <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/bg.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90 pointer-events-none" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-100dvh">
          <div className="text-white">読み込み中...</div>
        </div>
      </div>
    );
  }

  const currentClip = getCurrentClip();

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-gray-900/95 pointer-events-none" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-safe pt-2 pb-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-white text-lg font-medium">添削ワークスペース</h1>
          <div className="w-10" />
        </div>

        {/* Video Canvas Area */}
        <div className="relative px-4 mb-4">
          <VideoCanvas
            videoUrl={videoUrl}
            currentTime={currentTime}
            tool={selectedTool}
            annotations={currentClip?.annotations || []}
            onTimeChange={setCurrentTime}
            onAdd={addAnnotation}
            onUpdate={updateAnnotation}
            onDelete={deleteAnnotation}
          />

          {/* Tool Bar */}
          <div className="absolute right-6 top-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 space-y-2">
            {tools.map(({ tool, icon, label }) => (
              <button
                key={tool}
                onClick={() => {
                  if (tool === 'mic') {
                    handleMicTool();
                  } else {
                    setSelectedTool(tool);
                  }
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedTool === tool
                    ? 'bg-purple-600 text-white'
                    : isRecording && tool === 'mic'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title={label}
              >
                {icon}
              </button>
            ))}
            
            {/* Undo/Redo */}
            <div className="border-t border-white/20 pt-2 space-y-2">
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="w-10 h-10 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50 flex items-center justify-center"
                title="元に戻す"
              >
                <Undo2 size={20} />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="w-10 h-10 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50 flex items-center justify-center"
                title="やり直し"
              >
                <Redo2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-hidden">
          <Timeline
            clips={draft.clips}
            currentTime={currentTime}
            onSeek={setCurrentTime}
            onAddClip={handleAddClip}
            onUpdateClip={handleUpdateClip}
            onDeleteClip={handleDeleteClip}
          />
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 p-4 pb-safe">
          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <Save size={20} />
              下書き保存
            </button>
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Send size={20} />
              提出
            </button>
          </div>
        </div>

        {/* Submit Confirmation */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm w-full border border-white/20">
              <h3 className="text-white font-medium text-lg mb-2">添削を提出</h3>
              <p className="text-white/70 text-sm mb-6">
                この添削を提出しますか？提出後は編集できません。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 py-3 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  提出
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            録音中...
          </div>
        )}
      </div>
    </div>
  );
};