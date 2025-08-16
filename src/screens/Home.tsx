'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Heart,
  Home as HomeIcon,
  FileText as FileTextIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  Cog,
} from 'lucide-react';
import { mockReviews } from '../data/mockReviews';
import type { Review } from '../types/review';
import { DEMO_THUMB, AVATAR_IMG, VIDEO_THUMBS } from '../config/media';

type VideoItem = {
  id: string;
  category: 'driver' | 'wood' | 'utility' | 'iron' | 'wedge' | 'putter';
  date: string;
  tags: string[];
  thumb: string;
  status: '未添削' | '添削済';
  advice: string;
  updatedAt: number;
};

export type HomeProps = {
  onNavigate: (screen: string) => void;
  onOpenReview: (review: Review) => void;
};

const thumbFor = (id: string) => VIDEO_THUMBS[id] ?? DEMO_THUMB;

export const HomeScreen: React.FC<HomeProps> = ({ onNavigate, onOpenReview }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const videoItems: VideoItem[] = [
    { id: '1', category: 'driver', date: '2025/08/03', tags: ['スライス'], thumb: thumbFor('1'), status: '未添削', advice: '拳1.5個分の距離を保つ', updatedAt: Date.now() - 1000 },
    { id: '2', category: 'wood', date: '2025/08/03', tags: ['フック'], thumb: thumbFor('2'), status: '未添削', advice: 'グリップの握り方を見直す', updatedAt: Date.now() - 2000 },
    { id: '3', category: 'iron', date: '2025/08/03', tags: ['スライス'], thumb: thumbFor('3'), status: '未添削', advice: 'ボールの位置を左足寄りに', updatedAt: Date.now() - 3000 },
    { id: '4', category: 'utility', date: '2025/08/03', tags: ['トップ'], thumb: thumbFor('4'), status: '未添削', advice: '体重移動のタイミング改善', updatedAt: Date.now() - 4000 },
    { id: '5', category: 'wedge', date: '2025/08/03', tags: ['スライス'], thumb: thumbFor('5'), status: '未添削', advice: '手元を低く使う', updatedAt: Date.now() - 5000 },
    { id: '6', category: 'putter', date: '2025/08/03', tags: ['方向性'], thumb: thumbFor('6'), status: '未添削', advice: 'ストロークの安定性向上', updatedAt: Date.now() - 6000 }
  ];

  // お気に入り復元
  useEffect(() => {
    const raw = localStorage.getItem('sb:favorites');
    if (raw) {
      try {
        setFavorites(new Set(JSON.parse(raw)));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, []);

  const toggleFavorite = (videoId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(videoId) ? next.delete(videoId) : next.add(videoId);
      localStorage.setItem('sb:favorites', JSON.stringify(Array.from(next)));
      return next;
    });
    const idx = videoItems.findIndex(v => v.id === videoId);
    if (idx >= 0) videoItems[idx].updatedAt = Date.now();
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return videoItems;
    return videoItems.filter(item =>
      item.tags.some(tag => tag.includes(searchQuery)) ||
      item.category.includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, videoItems]);

  const favoriteAdvices = useMemo(
    () => videoItems
      .filter(v => favorites.has(v.id) && v.advice)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 2),
    [favorites]
  );

  const groupedItems = useMemo(() => ({
    driverWood: filteredItems.filter(item => item.category === 'driver' || item.category === 'wood'),
    ironUtilWedge: filteredItems.filter(item =>
      item.category === 'iron' || item.category === 'utility' || item.category === 'wedge'
    ),
    putter: filteredItems.filter(item => item.category === 'putter')
  }), [filteredItems]);


  const PinDrillCard: React.FC = () => {
    if (favoriteAdvices.length === 0) return null;
    const latestFavId = favoriteAdvices[0]?.id;
    return (
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-white text-3xl font-light mb-2" style={{ fontFamily: 'cursive' }}>
            Pin Drill
          </h2>
        </div>
        <div className="relative bg-violet-600 rounded-3xl p-5 shadow-[0_8px_24px_rgba(0,0,0,.25)]">
          <button
            onClick={(e) => { e.stopPropagation(); if (latestFavId) toggleFavorite(latestFavId); }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
          >
            <Heart size={16} className="fill-red-500 text-red-500" />
          </button>
          <div className="space-y-4 mb-4">
            {favoriteAdvices.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-600 font-bold text-lg">{index + 1}</span>
                </div>
                <div className="flex-1 text-white truncate">{item.advice}</div>
              </div>
            ))}
          </div>
          <div className="text-white/80 text-sm">{favoriteAdvices[0]?.date}</div>
        </div>
      </div>
    );
  };

  const VideoCard: React.FC<{ item: VideoItem }> = ({ item }) => {
    const isFavorite = favorites.has(item.id);
    const review = mockReviews.find(r => r.id === item.id);
    return (
      <button
        onClick={() => {
          if (review) onOpenReview(review);
        }}
        className="relative rounded-2xl overflow-hidden bg-white/10 border border-white/15 shadow-[0_1px_12px_rgba(0,0,0,.25)] w-full text-left focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <div className="relative aspect-video">
          <img src={item.thumb} alt={item.category} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs text-white bg-purple-500/85 rounded-full">{item.status}</span>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center transition-all duration-200 pointer-events-auto ${isFavorite ? 'scale-110' : 'hover:scale-105'}`}
          >
            <Heart size={16} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <div className="text-white text-sm mb-1">{item.date}</div>
            <div className="flex gap-1 flex-wrap">
              {item.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 text-xs text-purple-600 bg-white rounded-full border border-purple-200">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </button>
    );
  };

  const CategorySection: React.FC<{ title: string; items: VideoItem[] }> = ({ title, items }) => (
    <div className="mb-12">
      <h2 className="text-white text-3xl font-light mb-2" style={{ fontFamily: 'cursive' }}>
        {title}
      </h2>
      <div className="h-px bg-white/40 w-full mb-4"></div>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6">
          {items.map((item) => (
            <VideoCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-white/70">該当する動画がありません</div>
      )}
    </div>
  );

  return (
    <div className="max-w-[430px] mx-auto bg-white shadow-2xl rounded-[28px] overflow-hidden min-h-100dvh h-100dvh relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${DEMO_THUMB})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button onClick={() => onNavigate('profile')} className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
            <img src={AVATAR_IMG} alt="Profile" className="w-full h-full object-cover" />
          </button>
          <div className="flex-1 mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search"
                className="w-full h-10 pl-10 bg-black/35 text-white rounded-full placeholder-white/70 focus:outline-none"
              />
            </div>
          </div>
          <button onClick={() => onNavigate('settings')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <SettingsIcon className="text-white" size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 pb-4 space-y-8">
          <PinDrillCard />
          <CategorySection title="Driver / Wood" items={groupedItems.driverWood} />
          <CategorySection title="Iron / Utility / Wedge" items={groupedItems.ironUtilWedge} />
          <CategorySection title="Putter" items={groupedItems.putter} />
        </main>

        {/* Bottom Tabs */}
        <nav className="bg-black/60 backdrop-blur-sm border-t border-white/10 rounded-t-3xl">
          <div className="flex justify-around py-3">
            <button onClick={() => onNavigate('home')} className="flex flex-col items-center space-y-1 text-purple-400">
              <HomeIcon size={24} /><span className="text-xs">ホーム</span>
            </button>
            <button onClick={() => onNavigate('request')} className="flex flex-col items-center space-y-1 text-white/70 hover:text-white">
              <FileTextIcon size={24} /><span className="text-xs">添削依頼</span>
            </button>
            <button onClick={() => onNavigate('profile')} className="flex flex-col items-center space-y-1 text-white/70 hover:text-white">
              <UserIcon size={24} /><span className="text-xs">マイページ</span>
            </button>
            <button onClick={() => onNavigate('settings')} className="flex flex-col items-center space-y-1 text-white/70 hover:text-white">
              <Cog size={24} /><span className="text-xs">設定</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};
