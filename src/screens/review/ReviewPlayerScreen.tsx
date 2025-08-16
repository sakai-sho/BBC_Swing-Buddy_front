// src/screens/review/ReviewPlayerScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { Chip } from '../../components/Chip';
import { Stat } from '../../components/Stat';
import type { Review } from '../../types/review';

interface ReviewPlayerScreenProps {
  review: Review | null;
  onNavigate: (screen: string) => void;
}

// 必ず public/media/demo.mp4 を使う
const DEMO_VIDEO = '/media/demo.mp4';

export const ReviewPlayerScreen: React.FC<ReviewPlayerScreenProps> = ({
  review,
  onNavigate
}) => {
  const [showUI, setShowUI] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!review) {
      onNavigate('home');
      return;
    }
    const likedKey = `sb:review-liked:${review.id}`;
    const isLiked = localStorage.getItem(likedKey) === 'true';
    setLiked(isLiked);
    setLikeCount(review.likeCount + (isLiked && !review.liked ? 1 : 0));
  }, [review, onNavigate]);

  // マウント時に demo.mp4 を強制ロード（リクエストが必ず発生）
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // 既存の src を上書き
    el.src = DEMO_VIDEO;
    // 自動再生（muted ならモバイルでも大抵許可されます）
    el.load();
    const tryPlay = async () => {
      try {
        await el.play();
        setIsPlaying(true);
      } catch {
        // 自動再生がブロックされた場合は停止状態で待つ
        setIsPlaying(false);
      }
    };
    tryPlay();
  }, []); // 一度だけ

  if (!review) return null;

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => (newLiked ? prev + 1 : prev - 1));
    localStorage.setItem(`sb:review-liked:${review.id}`, String(newLiked));
  };

  const handleVideoClick = () => setShowUI(v => !v);

  const handlePlayClick = async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch {}
  };

  return (
    <div className="max-w-[430px] mx-auto bg-black min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Video Player */}
      <div className="relative w-full h-full">
        <video
          key={DEMO_VIDEO}           // キャッシュされても強制更新
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay                   // 可能なら自動再生
          onClick={handleVideoClick}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          poster={review.thumbUrl}
        />
        
        {/* Play Button Overlay（自動再生がブロックされた時だけ表示） */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayClick}
              className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Play className="text-white ml-2" size={32} />
            </button>
          </div>
        )}

        {/* UI Overlay */}
        {showUI && (
          <>
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 pt-safe bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <BackButton onClick={() => onNavigate('home')} />
                <div className="flex items-center gap-2">
                  <Chip variant="primary">{review.club}</Chip>
                </div>
              </div>
            </div>

            {/* Bottom Info Card */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.author.avatar}
                      alt={review.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium text-sm">@{review.author.handle}</p>
                      <p className="text-white/70 text-xs">{review.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Stat type="like" count={likeCount} active={liked} onClick={toggleLike} />
                    <Stat type="comment" count={review.commentCount} />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  {review.tags.map((tag, index) => (
                    <Chip key={index} variant="secondary" size="sm">
                      {tag}
                    </Chip>
                  ))}
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => onNavigate('review-detail')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <span className="text-white font-medium">詳細を見る</span>
                  <ChevronDown className="text-white" size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
