'use client';
import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, Save, Send, Mic, Play, Pause, Loader2, Camera, Eye, X
} from 'lucide-react';
import StepSidebar, { SWING_STEPS, SwingStepKey } from 'src/components/advice/StepSidebar';
import VoiceRecorder from 'src/components/advice/VoiceRecorder';
import SnapshotAnnotator from 'src/components/advice/SnapshotAnnotator';

type Props = {
  videoId?: string;
  onNavigate: (screen: string, params?: any) => void;
};

const DUMMY_VIDEO = '/videos/dummy.mp4';   // public/videos/dummy.mp4 を配置してください
const DUMMY_THUMB = '/images/dummy.jpg';   // public/images/dummy.jpg を配置してください

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const AdviceNew: React.FC<Props> = ({ videoId, onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  // ステップごとの入力
  const [activeStep, setActiveStep] = useState<SwingStepKey>('setup');
  const [notes, setNotes] = useState<Record<SwingStepKey, string>>({
    setup: '', backswing: '', top: '', transition: '', downswing: '', impact: '', follow: ''
  });
  const [voiceNotes, setVoiceNotes] = useState<Record<SwingStepKey, string | null>>({
    setup: null, backswing: null, top: null, transition: null, downswing: null, impact: null, follow: null
  });

  // キャプチャ（静止画）を複数保持（★どの工程の画像か step を持たせる）
  type Shot = { id: string; url: string; time: number; step: SwingStepKey };
  const [shots, setShots] = useState<Shot[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // プレビュー表示制御
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const stepMeta = useMemo(() => SWING_STEPS[activeStep], [activeStep]);
  const stepOrder = Object.keys(SWING_STEPS) as SwingStepKey[];

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrent(v.currentTime || 0);
  };

  // スライダーでシーク
  const seek = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setCurrent(val);
  };

  // 現在フレームを静止画として保存（★現在の工程 activeStep を付与）
  const captureFrame = async () => {
    const v = videoRef.current;
    if (!v) return;

    const w = v.videoWidth;
    const h = v.videoHeight;
    if (!w || !h) return;

    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.drawImage(v, 0, 0, w, h);

    const url = canvas.toDataURL('image/jpeg', 0.95);
    setShots(prev => [
      { id: `${Date.now()}`, url, time: v.currentTime, step: activeStep },
      ...prev
    ]);
  };

  const handleSaveDraft = async () => {
    const payload = { videoId, notes, voiceNotes, shots, when: new Date().toISOString() };
    localStorage.setItem(`advice-draft-${videoId ?? 'dummy'}`, JSON.stringify(payload));
    alert('下書きを保存しました（ローカル）');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200)); // ダミー送信
    setSubmitting(false);
    alert('添削を送信しました！（ダミー送信）');
    onNavigate('coach-home');
  };

  // プレビュー構築（★各工程ごとに自分のショットだけを抽出）
  const previewItems = stepOrder.map((k) => ({
    key: k,
    label: SWING_STEPS[k].label,
    note: notes[k],
    hasVoice: !!voiceNotes[k],
    stepShots: shots.filter(s => s.step === k)
  }));

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* 背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${DUMMY_THUMB})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90" />
      </div>

      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3">
          <button onClick={() => onNavigate('coach-home')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-white font-medium">添削（{stepMeta.label}）</h1>
          <div className="w-10" />
        </div>

        {/* 本文 */}
        <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-4">
          {/* ステップ切替 */}
          <StepSidebar active={activeStep} onChange={setActiveStep} />

          {/* 動画＋スライダー＋キャプチャ */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full aspect-video bg-black"
                poster={DUMMY_THUMB}
                src={DUMMY_VIDEO}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
                controls={false}
              />
              {/* 再生/一時停止 & キャプチャ */}
              <div className="absolute left-3 bottom-3 flex gap-2">
                <button
                  onClick={togglePlay}
                  className="px-3 py-2 rounded-full bg-black/60 text-white backdrop-blur flex items-center gap-2"
                >
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                  <span className="text-sm">{playing ? '一時停止' : '再生'}</span>
                </button>
                <button
                  onClick={captureFrame}
                  className="px-3 py-2 rounded-full bg-black/60 text-white backdrop-blur flex items-center gap-2"
                >
                  <Camera size={18} />
                  <span className="text-sm">フレーム保存</span>
                </button>
              </div>
            </div>

            {/* タイムラインスライダー */}
            <div className="p-3 border-t border-white/10 text-white">
              <div className="flex items-center gap-3">
                <span className="text-xs w-10 text-white/80">{formatTime(current)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.01}
                  value={current}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="flex-1 accent-purple-500"
                />
                <span className="text-xs w-10 text-right text-white/80">{formatTime(duration)}</span>
              </div>
            </div>

            {/* ステップのガイド（ダミー） */}
            <div className="p-3 text-white/80 text-sm border-t border-white/10">
              <div className="font-medium mb-1">{stepMeta.label} のチェックポイント</div>
              <ul className="list-disc ml-5 space-y-1">
                {stepMeta.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>

          {/* テキストコメント & 音声 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2 text-white/80">
              <Mic size={18} />
              <span className="text-sm">{stepMeta.label} のコメント</span>
            </div>
            <textarea
              value={notes[activeStep]}
              onChange={(e) => setNotes(prev => ({ ...prev, [activeStep]: e.target.value }))}
              placeholder="このステップでの気づき、直し方、Drillなどを書いてください。"
              className="w-full min-h-[96px] rounded-xl bg-black/30 text-white placeholder-white/60 p-3 outline-none border border-white/20"
            />
            <div className="mt-3">
              <VoiceRecorder
                value={voiceNotes[activeStep]}
                onChange={(url) => setVoiceNotes(prev => ({ ...prev, [activeStep]: url }))}
                label={`${stepMeta.label} の音声メモ（任意）`}
              />
            </div>
          </div>

          {/* 直近キャプチャ一覧（必要なら工程別UIに変更可） */}
          {shots.length > 0 && (
            <div className="space-y-3">
              <div className="text-white/90 text-sm">保存したフレーム（タップで編集）</div>
              <div className="space-y-3">
                {shots.map((s) => (
                  <SnapshotAnnotator
                    key={s.id}
                    src={s.url}
                    time={s.time}
                    onChange={(exportedUrl) => {
                      setShots(prev => prev.map(p => p.id === s.id ? { ...p, url: exportedUrl ?? p.url } : p));
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* アクションバー */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 p-3 pb-safe">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSaveDraft}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/20 text-white hover:bg-white/30"
            >
              <Save size={18} />
              下書き保存
            </button>

            {/* 送信 → プレビュー */}
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700"
            >
              <Eye size={18} />
              プレビュー
            </button>
          </div>
        </div>
      </div>

      {/* プレビューモーダル（工程ごとのサマリー＋その工程の画像だけ表示） */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setPreviewOpen(false)}
          />
          <div className="absolute inset-x-4 bottom-4 top-14 bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden max-w-[640px] mx-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2 text-slate-700">
                <Eye size={18} />
                <span className="font-medium">送信前の最終確認</span>
              </div>
              <button className="p-2 rounded hover:bg-slate-100" onClick={() => setPreviewOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-112px)] space-y-3">
              <div className="text-sm text-slate-600">
                内容に問題なければ「送信する」を押してください。
              </div>

              {previewItems.map((item) => (
                <div key={item.key} className="border rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-slate-500">
                      {item.hasVoice ? '音声メモあり' : '音声メモなし'}
                    </div>
                  </div>

                  {/* コメント */}
                  <div className="text-sm text-slate-700 whitespace-pre-wrap mb-2">
                    {item.note || '（コメントなし）'}
                  </div>

                  {/* ★ この工程のキャプチャだけを表示 */}
                  {item.stepShots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {item.stepShots.map((s) => (
                        <div key={s.id} className="relative">
                          <img src={s.url} className="w-full h-20 object-cover rounded border" />
                          <div className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white px-1 rounded">
                            {formatTime(s.time)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">（この工程のキャプチャなし）</div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t p-3 flex gap-2 justify-end bg-white">
              <button
                className="px-4 py-2 rounded-lg border hover:bg-slate-50"
                onClick={() => setPreviewOpen(false)}
              >
                編集に戻る
              </button>
              <button
                onClick={async () => {
                  try {
                    await handleSubmit();
                    setPreviewOpen(false);
                  } catch (e) {
                    console.error(e);
                    alert('送信に失敗しました');
                  }
                }}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                送信する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdviceNew;
