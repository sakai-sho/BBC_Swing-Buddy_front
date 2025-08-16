// src/screens/review/ReviewDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Share, Bookmark, Play } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { Chip } from '../../components/Chip';
import { Stat } from '../../components/Stat';
import type { Review } from '../../types/review';

interface ReviewDetailScreenProps {
  review: Review | null;
  onNavigate: (screen: string) => void;
}

// 差し替え先（必要なら拡張子を .png に変更）
const DEMO_VIDEO = '/media/demo.mp4';
const THUMB_IMG  = '/media/thumbs/1.jpg';

export const ReviewDetailScreen: React.FC<ReviewDetailScreenProps> = ({
  review,
  onNavigate
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  // サムネ枠でのインライン再生フラグ
  const [inlinePlaying, setInlinePlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!review) {
      onNavigate('home');
      return;
    }
    
    const likedKey = `sb:review-liked:${review.id}`;
    const bookmarkedKey = `sb:review-bookmarked:${review.id}`;
    const isLiked = localStorage.getItem(likedKey) === 'true';
    const isBookmarked = localStorage.getItem(bookmarkedKey) === 'true';
    setLiked(isLiked);
    setBookmarked(isBookmarked);
    setLikeCount(review.likeCount + (isLiked && !review.liked ? 1 : 0));
  }, [review, onNavigate]);

  if (!review) return null;

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => (newLiked ? prev + 1 : prev - 1));
    localStorage.setItem(`sb:review-liked:${review.id}`, String(newLiked));
  };

  const toggleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    localStorage.setItem(`sb:review-bookmarked:${review.id}`, String(next));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${review.author.name}の${review.club}添削`,
        text: review.summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const startInlinePlay = async () => {
    setInlinePlaying(true);
    // 再レンダリング後に play
    requestAnimationFrame(async () => {
      if (!videoRef.current) return;
      try {
        await videoRef.current.play();
      } catch {
        /* 自動再生がブロックされたらユーザー操作で再生してもらう */
      }
    });
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
          <BackButton onClick={() => onNavigate('review-player')} />
          <h1 className="text-white text-lg font-medium">添削詳細</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <Bookmark
                size={20}
                className={bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-white'}
              />
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <Share className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Top Thumbnail / Inline Video */}
        <div className="px-4 mb-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            {inlinePlaying ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={DEMO_VIDEO}
                poster={THUMB_IMG}
                controls
                playsInline
                muted
                // 自動再生が通れば onPlay で何もしない、止まればユーザー操作で続行
              />
            ) : (
              <>
                <img
                  src={THUMB_IMG}
                  alt="動画サムネイル"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={startInlinePlay}     // ← 遷移させず同枠で再生
                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Play className="text-white ml-1" size={24} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {/* Author Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={review.author.avatar}
                alt={review.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-white font-medium text-lg">{review.author.name}</h3>
                <p className="text-white/70 text-sm">@{review.author.handle}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-4">
                  <Stat type="like" count={likeCount} active={liked} onClick={toggleLike} />
                  <Stat type="comment" count={review.commentCount} />
                </div>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-lg">添削内容</h3>
              <div className="flex items-center gap-2">
                <Chip variant="primary" size="md">{review.club}</Chip>
                <span className="text-white/70 text-sm">{review.createdAt}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {review.tags.map((tag, index) => (
                <Chip key={index} variant="secondary" size="sm">
                  {tag}
                </Chip>
              ))}
            </div>

            {/* Summary */}
            <div className="text-white/90 text-sm leading-relaxed mb-4">
              {review.summary}
            </div>

            {/* Timeline Button */}
            <button
              onClick={() => onNavigate('review-timeline')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
            >
              <span className="text-white font-medium">詳細タイムラインを見る</span>
              <ChevronDown className="text-white" size={20} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <h3 className="text-white font-medium text-base mb-3">アクション</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <span className="text-white text-sm">練習メモ</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <span className="text-white text-sm">コーチに質問</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
