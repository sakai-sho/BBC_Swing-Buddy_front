// src/screens/review/ReviewTimelineScreen.tsx
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

// ここを差し替え先に固定
const DEMO_VIDEO = '/media/demo.mp4';
const TOP_THUMB  = '/media/thumbs/1.jpg';

// ステップごとのサムネ画像マッピング
// ファイルは public/media/steps/ 配下に配置してください（後述）
const STEP_THUMBS: Record<string, string> = {
  address:    '/media/steps/address.jpg',
  takeaway:   '/media/steps/takeaway.jpg',   // 「テイクバック」
  top:        '/media/steps/top.jpg',
  impact:     '/media/steps/impact.jpg',
  follow:     '/media/steps/follow.jpg',
};

export const ReviewTimelineScreen: React.FC<ReviewTimelineScreenProps> = ({
  review,
  onNavigate,
}) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 上部プレビュー枠：サムネ→同枠インライン再生
  const [inlinePlaying, setInlinePlaying] = useState(false);
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

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((p) => (next ? p + 1 : p - 1));
    localStorage.setItem(`sb:review-liked:${review.id}`, String(next));
  };

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const startInlinePlay = () => {
    setInlinePlaying(true);
    requestAnimationFrame(async () => {
      try {
        await videoRef.current?.play();
      } catch {
        /* 自動再生ブロック時はユーザーが再度再生 */
      }
    });
  };

  const StepItem: React.FC<{ step: ReviewStep; isLast: boolean }> = ({ step, isLast }) => {
    const isExpanded = expandedStep === step.id;
    const thumbSrc =
      STEP_THUMBS[step.id] ?? step.thumb ?? '/media/steps/fallback.jpg';

    return (
      <div className="relative">
        {/* Timeline Line */}
        {!isLast && (
          <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-purple-400 to-purple-600" />
        )}

        {/* Step Content */}
        <div className="flex items-start gap-4 pb-6">
          {/* Timeline Dot */}
          <div className="relative z-10 w-12 h-12 bg-white rounded-full border-4 border-purple-400 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 font-bold text-sm">{step.index}</span>
          </div>

          {/* Step Card */}
          <div className="flex-1">
            <button
              onClick={() => toggleStep(step.id)}
              className="w-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <img
                  src={thumbSrc}
                  alt={step.title}
                  className="w-16 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-white font-medium text-base mb-1">{step.title}</h3>
                  <p className="text-white/70 text-sm">
                    {isExpanded ? 'タップして閉じる' : 'タップして詳細を見る'}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className={`text-white/70 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 p-4">
                <p className="text-white/90 text-sm leading-relaxed">{step.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-4">
          <BackButton onClick={() => onNavigate('review-detail')} />
          <h1 className="text-white text-lg font-medium">スイング分析</h1>
          <div className="w-10" />
        </div>

        {/* Video Preview（サムネ→同枠インライン再生） */}
        <div className="px-4 mb-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            {inlinePlaying ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
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
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={startInlinePlay}
                  className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Review Info */}
        <div className="px-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={review.author.avatar}
                  alt={review.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-white font-medium">{review.author.name}</h3>
                  <p className="text-white/70 text-sm">@{review.author.handle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Chip variant="primary" size="md">
                  {review.club}
                </Chip>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {review.tags.map((tag, i) => (
                  <Chip key={i} variant="secondary" size="sm">
                    {tag}
                  </Chip>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Stat type="like" count={likeCount} active={liked} onClick={toggleLike} />
                <Stat type="comment" count={review.commentCount} />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <h2 className="text-white font-medium text-lg mb-6">スイング分析タイムライン</h2>

            <div className="space-y-0">
              {review.steps.map((step, index) => (
                <StepItem
                  key={step.id}
                  step={{
                    ...step,
                    // Review の step.thumb を上書き（定義されていれば優先）
                    thumb: STEP_THUMBS[step.id] ?? step.thumb,
                  }}
                  isLast={index === review.steps.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 p-4 pb-safe">
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('review-player')}
              className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              動画に戻る
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
