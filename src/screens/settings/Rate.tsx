import React, { useState } from 'react';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type RateProps = {
  onNavigate: (screen: string) => void;
};

export const RateScreen: React.FC<RateProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      // Simulate submission
      setSubmitted(true);
      setTimeout(() => {
        onNavigate('settings');
      }, 2000);
    }
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1: return '改善が必要です';
      case 2: return 'まあまあです';
      case 3: return '良いです';
      case 4: return 'とても良いです';
      case 5: return '素晴らしいです！';
      default: return 'タップして評価してください';
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[430px] mx-auto bg-gray-900 min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/bg.jpg)' }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-gray-900/95"
            style={{ backgroundColor: `rgba(0,0,0,var(--bg-dim))` }}
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-100dvh h-100dvh px-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Star className="text-white fill-current" size={32} />
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">ありがとうございます！</h2>
            <p className="text-white/70 text-base mb-8">
              貴重なご意見をいただき、ありがとうございました。<br />
              今後のサービス向上に活用させていただきます。
            </p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={`${
                    star <= rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[430px] mx-auto bg-gray-900 min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/bg.jpg)' }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-gray-900/95"
          style={{ backgroundColor: `rgba(0,0,0,var(--bg-dim))` }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-safe pt-4 pb-6">
          <button
            onClick={() => onNavigate('settings')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={t('settings.back')}
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          
          <h1 
            className="text-white text-2xl font-light"
            style={{ fontFamily: 'cursive' }}
          >
            {t('settings.rate')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-white font-medium text-xl mb-2">
                SWING BUDDYはいかがですか？
              </h3>
              <p className="text-white/70 text-sm">
                あなたの評価とご意見をお聞かせください
              </p>
            </div>

            {/* Star Rating */}
            <div className="text-center mb-6">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-white/30'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-white/80 text-base">
                {getRatingText(hoveredRating || rating)}
              </p>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-white/90 text-sm font-medium mb-3">
                コメント（任意）
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="アプリの良い点や改善点があれば教えてください..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className={`w-full h-12 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                rating > 0
                  ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
              評価を送信
            </button>

            {/* App Store Links */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-white/70 text-sm text-center mb-4">
                アプリストアでも評価をお願いします
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('https://apps.apple.com', '_blank')}
                  className="flex-1 h-12 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <span className="text-sm font-medium">App Store</span>
                </button>
                <button
                  onClick={() => window.open('https://play.google.com', '_blank')}
                  className="flex-1 h-12 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <span className="text-sm font-medium">Google Play</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};