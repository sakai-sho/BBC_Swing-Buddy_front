import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { RequestFilters, Club } from '../../types/requests';

interface FilterBarProps {
  filters: RequestFilters;
  onFiltersChange: (filters: Partial<RequestFilters>) => void;
  onReset: () => void;
}

const CLUBS: { value: Club | 'all'; label: string }[] = [
  { value: 'all', label: '全て' },
  { value: 'driver', label: 'ドライバー' },
  { value: 'wood', label: 'ウッド' },
  { value: 'utility', label: 'ユーティリティ' },
  { value: 'iron', label: 'アイアン' },
  { value: 'wedge', label: 'ウェッジ' },
  { value: 'putter', label: 'パター' }
];

const TAGS = [
  'スライス', 'フック', 'トップ', 'ダフリ', '方向性', '弾道の高さ', 
  'リズム', 'ミート率', '飛距離不足', 'スピン量'
];

const PERIODS = [
  { value: 'all', label: '全期間' },
  { value: '24h', label: '24時間' },
  { value: '3d', label: '3日間' },
  { value: '7d', label: '7日間' }
] as const;

const SORTS = [
  { value: 'newest', label: '新着順' },
  { value: 'most_requests', label: '依頼数多い' },
  { value: 'highest_reward', label: '報酬高い' }
] as const;

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const [showClubDropdown, setShowClubDropdown] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ tags: newTags });
  };

  const hasActiveFilters = 
    filters.club !== 'all' || 
    filters.tags.length > 0 || 
    filters.period !== 'all' || 
    filters.sort !== 'newest' ||
    filters.search !== '';

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-4 space-y-3">
      {/* Filter buttons row */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {/* Club filter */}
        <div className="relative">
          <button
            onClick={() => setShowClubDropdown(!showClubDropdown)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filters.club !== 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {CLUBS.find(c => c.value === filters.club)?.label}
            <ChevronDown size={16} className={showClubDropdown ? 'rotate-180' : ''} />
          </button>
          
          {showClubDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-1 z-10 min-w-[120px]">
              {CLUBS.map(club => (
                <button
                  key={club.value}
                  onClick={() => {
                    onFiltersChange({ club: club.value });
                    setShowClubDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${
                    filters.club === club.value ? 'text-purple-400' : 'text-white'
                  }`}
                >
                  {club.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags filter */}
        <div className="relative">
          <button
            onClick={() => setShowTagsDropdown(!showTagsDropdown)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filters.tags.length > 0
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            課題タグ {filters.tags.length > 0 && `(${filters.tags.length})`}
            <ChevronDown size={16} className={showTagsDropdown ? 'rotate-180' : ''} />
          </button>
          
          {showTagsDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 z-10 w-64">
              <div className="grid grid-cols-2 gap-1">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-left px-2 py-1 text-xs rounded transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Period filter */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filters.period !== 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {PERIODS.find(p => p.value === filters.period)?.label}
            <ChevronDown size={16} className={showPeriodDropdown ? 'rotate-180' : ''} />
          </button>
          
          {showPeriodDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-1 z-10 min-w-[100px]">
              {PERIODS.map(period => (
                <button
                  key={period.value}
                  onClick={() => {
                    onFiltersChange({ period: period.value });
                    setShowPeriodDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${
                    filters.period === period.value ? 'text-purple-400' : 'text-white'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort filter */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filters.sort !== 'newest'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {SORTS.find(s => s.value === filters.sort)?.label}
            <ChevronDown size={16} className={showSortDropdown ? 'rotate-180' : ''} />
          </button>
          
          {showSortDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-1 z-10 min-w-[120px]">
              {SORTS.map(sort => (
                <button
                  key={sort.value}
                  onClick={() => {
                    onFiltersChange({ sort: sort.value });
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${
                    filters.sort === sort.value ? 'text-purple-400' : 'text-white'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors whitespace-nowrap"
          >
            <X size={16} />
            リセット
          </button>
        )}
      </div>

      {/* Active tags display */}
      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
            >
              {tag}
              <button
                onClick={() => toggleTag(tag)}
                className="hover:bg-white/20 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};