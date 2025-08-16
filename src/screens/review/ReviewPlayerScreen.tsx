import React, { useRef, useState } from 'react';
import { BackButton } from '../../components/BackButton';
import type { Review } from '../../types/review';

interface ReviewPlayerScreenProps {
  review: Review;
  onNavigate: (screen: string) => void;
}

export const ReviewPlayerScreen: React.FC<ReviewPlayerScreenProps> = ({ review, onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const changeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  return (
    <div className="relative max-w-[430px] mx-auto w-full h-[100dvh] bg-black overflow-hidden">
      {/* Video full screen */}
      <video
        ref={videoRef}
        src={review.videoUrl}
        poster={review.thumbUrl}
        controls
        playsInline
        className="w-full h-full object-contain pb-[100px]" // 下に余白追加してUI重なり回避
      />

      {/* Back + Title */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        <BackButton onClick={() => onNavigate('review-detail')} />
        <h1 className="text-white text-lg font-medium">動画再生</h1>
        <div className="w-10" />
      </div>

      {/* Slow motion buttons */}
      <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex space-x-4 z-10">
        {[0.25, 0.5, 1].map((r) => (
          <button
            key={r}
            onClick={() => changeRate(r)}
            className={`px-4 py-2 rounded-md font-medium text-sm ${
              playbackRate === r ? 'bg-purple-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            ×{r}
          </button>
        ))}
      </div>
    </div>
  );
};
