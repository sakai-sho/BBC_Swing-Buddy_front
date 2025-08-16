import React from 'react';
import { BackButton } from '../../components/BackButton';
import { Chip } from '../../components/Chip';
import type { Review } from '../../types/review';

interface ReviewDetailScreenProps {
  review: Review;
  onNavigate: (screen: string) => void;
}

export const ReviewDetailScreen: React.FC<ReviewDetailScreenProps> = ({ review, onNavigate }) => {
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

      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh overflow-y-auto pt-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-4">
          <BackButton onClick={() => onNavigate('home')} />
          <h1 className="text-white text-lg font-medium">添削詳細</h1>
          <div className="w-10" />
        </div>

        {/* Top Video with full view */}
        <div className="px-4 mb-6">
          <div className="relative w-full h-[250px] rounded-2xl overflow-hidden bg-black">
            <video
              className="w-full h-full object-contain"
              src={review.videoUrl}
              poster={review.thumbUrl}
              controls
              playsInline
              muted
            />
          </div>
        </div>
        {/* Review Summary */}
        <div className="px-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img src={review.author.avatar} alt={review.author.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="text-white font-medium">{review.author.name}</h3>
                  <p className="text-white/70 text-sm">@{review.author.handle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Chip variant="primary" size="md">{review.club}</Chip>
                <p className="text-white/70 text-sm">{review.createdAt}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              {review.tags.map((tag,i)=>(
                <Chip key={i} variant="secondary" size="sm">{tag}</Chip>
              ))}
            </div>
            <p className="text-white text-sm leading-relaxed mb-4">{review.summary}</p>

            <button
              onClick={() => onNavigate('review-timeline')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              詳細タイムラインを見る
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <h2 className="font-medium text-white mb-4">アクション</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
                練習メモ
              </button>
              <button className="bg-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
                コーチに質問
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
