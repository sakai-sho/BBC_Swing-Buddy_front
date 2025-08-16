import React, { useState, useEffect } from 'react';
import {
  Search,
  Settings as SettingsIcon,
} from 'lucide-react';

export type RequestClubProps = { 
  onNavigate: (screen: string) => void;
};

type Club = 'Driver' | 'Wood' | 'Utility' | 'Iron' | 'Wedge' | 'Patter';

export const RequestClubScreen: React.FC<RequestClubProps> = ({ onNavigate }) => {
  const [club, setClub] = useState<Club | ''>(() => {
    const saved = localStorage.getItem('sb:req:club');
    return (saved && ['Driver', 'Wood', 'Utility', 'Iron', 'Wedge', 'Patter'].includes(saved))
      ? saved as Club 
      : '';
  });

  const handleClubSelect = (selectedClub: Club) => {
    setClub(selectedClub);
    localStorage.setItem('sb:req:club', selectedClub);
  };

  const handleNext = () => {
    if (club) {
      onNavigate('request-problem');
    }
  };

  const clubs: Club[] = ['Driver', 'Wood', 'Utility', 'Iron', 'Wedge', 'Patter'];

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Background - クリックを奪わない */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 pt-safe pb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pt-4">
            {/* Avatar */}
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <img
                src="https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            
            {/* Search Bar */}
            <div className="flex-1 mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={18} />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-10 pl-10 pr-4 bg-black/35 text-white placeholder-white/70 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
            
            {/* Settings */}
            <button
              onClick={() => onNavigate('settings')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <SettingsIcon className="text-white" size={20} />
            </button>
          </div>

          {/* Title with Blob - クリックを奪わない */}
          <div className="relative mb-12">
            <h1 
              className="text-white font-light leading-none tracking-wide"
              style={{ 
                fontFamily: 'cursive',
                fontSize: 'clamp(32px, 8vw, 48px)'
              }}
            >
              Club
            </h1>
            
            {/* Purple Blob */}
            <div 
              className="absolute right-[-10%] top-[-20%] w-[75%] aspect-[0.8] bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 blur-[1px] opacity-90 pointer-events-none -z-10"
              style={{
                borderRadius: '40% 60% 45% 55% / 50% 40% 60% 50%'
              }}
            />
          </div>

          {/* Club Selection Grid - 全6項目選択可能 */}
          <div className="mb-8">
            <p className="text-white/90 text-base mb-6">
              使用したクラブを選択してください
            </p>
            
            <div className="grid grid-cols-3 gap-x-3 gap-y-4 justify-items-center">
              {clubs.map((clubName) => (
                <button
                  key={clubName}
                  type="button"
                  aria-pressed={club === clubName}
                  onClick={() => handleClubSelect(clubName)}
                  className={`px-4 py-2 h-11 rounded-full text-[14px] font-medium transition-all duration-200 min-w-[100px] ${
                    club === clubName
                      ? 'bg-white text-purple-600 shadow-lg' 
                      : 'bg-purple-500/80 text-white border border-purple-400/50 hover:bg-purple-500/90 hover:scale-105'
                  }`}
                >
                  {clubName}
                </button>
              ))}
            </div>
          </div>

          {/* Page Indicators - 4 dots with 2nd active */}
          <div className="flex justify-center gap-3 mb-8 mt-8">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  index === 1 
                    ? 'bg-purple-400 opacity-100 scale-110'
                    : 'bg-white opacity-40'
                }`}
              />
            ))}
          </div>
        </main>

        {/* Next Button - クラブ選択時のみ有効 */}
        <div className="sticky bottom-0 px-6 pb-6 pt-4">
          <button
            onClick={handleNext}
            disabled={!club}
            className={`w-full h-[54px] rounded-full font-medium transition-all duration-200 ${
              club
                ? 'bg-white text-purple-600 shadow-lg hover:shadow-xl active:scale-95'
                : 'bg-white/70 text-purple-600 opacity-60 cursor-not-allowed'
            }`}
          >
            次へ
          </button>
        </div>

        {/* Tab Bar */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 rounded-t-3xl">
          <div className="flex justify-around py-3 pb-safe">
            <button
              onClick={() => onNavigate('home')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs">ホーム</span>
            </button>
            <button
              onClick={() => onNavigate('request')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <span className="text-xs font-medium">添削依頼</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              <span className="text-xs">マイページ</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
              </svg>
              <span className="text-xs">設定</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};