import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { Chip } from '../../components/Chip';
import { Stat } from '../../components/Stat';
import type { Review, ReviewStep } from '../../types/review';

interface ReviewTimelineScreenProps {
  review: Review | null;
  onNavigate: (screen: string) => void;
}

// 上部で表示する動画サムネ
const DEMO_VIDEO = '/media/demo.mp4';
const TOP_THUMB = '/media/thumbs/1.jpg';

// 8ステップ
const STEP_THUMBS: Record<string, string> = {
  address: '/media/steps/address.jpg',
  takeaway: '/media/steps/takeaway.jpg',
  top: '/media/steps/top.jpg',
  transition: '/media/steps/transition.jpg',
  downswing: '/media/steps/downswing.jpg',
  impact: '/media/steps/impact.jpg',
  follow: '/media/steps/follow.jpg',
  finish: '/media/steps/finish.jpg',
};

export const ReviewTimelineScreen: React.FC<ReviewTimelineScreenProps> = ({
  review,
  onNavigate,
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [inlinePlaying, setInlinePlaying] = useState(false);
  const [activeStep, setActiveStep] = useState<ReviewStep | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!review) {
      onNavigate('home');
      return;
    }
    const savedLiked = localStorage.getItem(`sb:review-liked:${review.id}`) === 'true';
    setLiked(savedLiked);
    setLikeCount(
      review.likeCount +
        (savedLiked && !review.liked ? 1 : 0) -
        (!savedLiked && review.liked ? 1 : 0),
    );
  }, [review, onNavigate]);

  if (!review) return null;

  const startInlinePlay = () => {
    setInlinePlaying(true);
    requestAnimationFrame(async () => {
      try {
        await videoRef.current?.play();
      } catch {}
    });
  };

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((p) => (next ? p + 1 : p - 1));
    localStorage.setItem(`sb:review-liked:${review.id}`, String(next));
  };

  const StepItem: React.FC<{ step: ReviewStep }> = ({ step }) => (
    <div className="flex items-start gap-4 pb-6">
      <div className="relative z-10 w-12 h-12 bg-white rounded-full border-4 border-purple-400 flex items-center justify-center">
        <span className="text-purple-600 font-bold text-sm">{step.index}</span>
      </div>
      <div className="flex-1">
        <button
          onClick={() => setActiveStep(step)}
          className="w-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:bg-white/15 transition-all"
        >
          <div className="flex items-center gap-3">
            <img
              src={STEP_THUMBS[step.id] ?? step.thumb}
              alt={step.title}
              className="w-16 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 text-left">
              <h3 className="text-white font-medium text-base mb-1">{step.title}</h3>
              <p className="text-white/70 text-sm">タップして表示</p>
            </div>
            <ChevronRight size={20} className="text-white/70" />
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/bg.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90" />
      </div>

      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-4">
          <BackButton onClick={() => onNavigate('review-detail')} />
          <h1 className="text-white text-lg font-medium">スイング分析</h1>
          <div className="w-10" />
        </div>

        {/* Top Preview Area */}
        <div className="px-4 mb-4">
          {activeStep ? (
            <>
              <img
                src={STEP_THUMBS[activeStep.id] ?? activeStep.thumb}
                alt={activeStep.title}
                className="w-full rounded-xl object-contain h-[250px] bg-black mb-3"
              />
              <div className="text-white text-sm leading-relaxed px-1">
                {activeStep.note}
              </div>
            </>
          ) : (
            <div className="relative w-full h-[250px] rounded-2xl overflow-hidden bg-black">
              {inlinePlaying ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  src={DEMO_VIDEO}
                  poster={TOP_THUMB}
                  controls
                  playsInline
                  muted
                />
              ) : (
                <>
                  <img
                    src={TOP_THUMB}
                    alt="動画サムネイル"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={startInlinePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                    </div>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h2 className="text-white font-medium text-lg mb-6">スイング分析タイムライン</h2>
            <div className="space-y-0">
              {review.steps.map((s) => (
                <StepItem key={s.id} step={s} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('review-player')}
              className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              動画を見る
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
