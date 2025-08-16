import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Star, ChevronDown } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type FavoritesProps = {
  onNavigate: (screen: string) => void;
};

type Coach = {
  id: string;
  name: string;
  rating: number;
  club: string;
  avatar: string;
  addedAt: string;
};

type SortOption = 'recent' | 'name' | 'rating';

export const FavoritesScreen: React.FC<FavoritesProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  
  const [coaches, setCoaches] = useState<Coach[]>(() => {
    try {
      const saved = localStorage.getItem('sb:favoriteCoaches');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          name: '田中プロ',
          rating: 4.8,
          club: 'Driver',
          avatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
          addedAt: '2025-01-10'
        },
        {
          id: '2',
          name: '佐藤コーチ',
          rating: 4.9,
          club: 'Iron',
          avatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
          addedAt: '2025-01-08'
        },
        {
          id: '3',
          name: '山田先生',
          rating: 4.7,
          club: 'Putter',
          avatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
          addedAt: '2025-01-05'
        }
      ];
    } catch {
      return [];
    }
  });

  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem('sb:favoriteCoaches', JSON.stringify(coaches));
  }, [coaches]);

  const removeFavorite = (coachId: string) => {
    setCoaches(prev => prev.filter(coach => coach.id !== coachId));
  };

  const sortedCoaches = [...coaches].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'recent': return '最近追加';
      case 'name': return '名前順';
      case 'rating': return '評価順';
    }
  };

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
            {t('settings.favoritesCoaches')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Sort Controls */}
        <div className="px-6 mb-4">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-white"
            >
              <span className="text-sm">並び替え: {getSortLabel(sortBy)}</span>
              <ChevronDown size={16} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden z-10">
                {(['recent', 'name', 'rating'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setShowSortMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors ${
                      sortBy === option ? 'bg-white/20' : ''
                    }`}
                  >
                    {getSortLabel(option)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          {sortedCoaches.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="mx-auto mb-4 text-white/50" size={48} />
              <p className="text-white/70">お気に入りのコーチがいません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCoaches.map((coach) => (
                <div
                  key={coach.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10">
                      <img
                        src={coach.avatar}
                        alt={coach.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg mb-1">{coach.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span className="text-white/70 text-sm">{coach.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded-full">
                          {coach.club}
                        </span>
                        <span className="text-white/50 text-xs">
                          {new Date(coach.addedAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFavorite(coach.id)}
                      className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                      aria-label={`${coach.name}をお気に入りから削除`}
                    >
                      <Heart className="text-red-400 fill-current" size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};