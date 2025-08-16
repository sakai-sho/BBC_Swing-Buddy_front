'use client';
import React, { useState, useCallback } from 'react';
import { Search, Bell, Loader2 } from 'lucide-react';
import { RequestCard } from '../../components/requests/RequestCard';
import { FilterBar } from '../../components/requests/FilterBar';
import { useCoachRequests } from '../../state/coachRequests';
import { acceptRequest, declineRequest, toggleFavorite, markAsRead } from '../../services/requests';
import type { RequestStatus } from '../../types/requests';

const HOME_BG_IMG = '/images/bg.jpg';                 // => public/images/bg.jpg
const PROFILE_AVATAR_IMG = '/media/coach/avatar_dummy.jpg'; // => public/media/coach/avatar_dummy.jpg

interface CoachHomeProps {
  onNavigate: (screen: string, params?: any) => void;
}

const TABS: { value: RequestStatus | 'all'; label: string }[] = [
  { value: 'new', label: '新着' },
  { value: 'accepted', label: '受諾中' },
  { value: 'completed', label: '完了' }
];

export const CoachHome: React.FC<CoachHomeProps> = ({ onNavigate }) => {
  const {
    requests,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshRequests
  } = useCoachRequests();

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(filters.search);

  const handleTabChange = useCallback((status: RequestStatus) => {
    updateFilters({ status });
  }, [updateFilters]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    updateFilters({ search: query });
  }, [updateFilters]);

  const handleAccept = useCallback(async (id: string) => {
    setActionLoading(id);
    try {
      await acceptRequest(id);
      await refreshRequests();
      updateFilters({ status: 'accepted' });
    } catch (e) {
      console.error('Failed to accept request:', e);
    } finally {
      setActionLoading(null);
    }
  }, [refreshRequests, updateFilters]);

  const handleDecline = useCallback(async (id: string) => {
    setActionLoading(id);
    try {
      await declineRequest(id);
      await refreshRequests();
    } catch (e) {
      console.error('Failed to decline request:', e);
    } finally {
      setActionLoading(null);
    }
  }, [refreshRequests]);

  const handleToggleFavorite = useCallback(async (id: string) => {
    try {
      await toggleFavorite(id);
      await refreshRequests();
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
  }, [refreshRequests]);

  /**
   * 詳細クリック時の遷移
   */
  const handleViewDetail = useCallback(async (id: string) => {
    const req: any = requests.find(r => r.id === id);

    // videoId を広めに探索（実データ名に合わせて調整可）
    const videoId: string | undefined =
      req?.video_id ?? req?.videoId ?? req?.video?.id ?? req?.review?.video_id;

    try {
      await markAsRead(id);
    } catch {
      /* 失敗しても遷移は続行 */
    }

    if (req?.status === 'accepted' && videoId) {
      onNavigate('coach-advice-new', { videoId });  // 受諾中 → 直接 添削作成へ
      return;
    }

    if (videoId) {
      onNavigate('video-detail', { videoId });      // 受諾前 → 動画詳細
    } else {
      onNavigate('request-detail', { id });         // videoId 不明 → 従来詳細
    }
  }, [onNavigate, requests]);

  const unreadCount = requests.filter(r => r.unread).length;

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HOME_BG_IMG})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-4">
          {/* Profile */}
          <button
            onClick={() => onNavigate('mypage')}
            className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="マイページを開く"
          >
            <img src={PROFILE_AVATAR_IMG} alt="Profile" className="w-full h-full object-cover" />
          </button>

          {/* Search */}
          <div className="flex-1 mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
              <input
                type="text"
                placeholder="依頼を検索..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-black/35 text-white placeholder-white/70 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="依頼を検索"
              />
            </div>
          </div>

          {/* Notifications */}
          <button
            onClick={() => onNavigate('notifications')}
            className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="通知を開く"
          >
            <Bell className="text-white" size={20} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </div>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-4">
          <div className="flex bg-white/10 rounded-full p-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value as RequestStatus)}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filters.status === tab.value ? 'bg-white text-purple-600 shadow-sm' : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4">
              <p className="text-red-200 mb-4">{error}</p>
              <button
                onClick={refreshRequests}
                className="px-4 py-2 bg白/20 text白 rounded-lg hover:bg白/30 transition-colors"
              >
                再試行
              </button>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-white text-lg font-medium mb-2">
                {filters.status === 'new' ? '新着依頼がありません' :
                 filters.status === 'accepted' ? '受諾中の依頼がありません' :
                 '完了した依頼がありません'}
              </h3>
              <p className="text-white/70 text-sm mb-4">フィルターを変更して他の依頼を確認してみてください</p>
              <div className="space-y-3">
                <button onClick={resetFilters} className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                  フィルターをリセット
                </button>
                {filters.status === 'accepted' && (
                  <button onClick={() => onNavigate('coach-jobs')} className="block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    添削ワークスペースを開く
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onToggleFavorite={handleToggleFavorite}
                  onViewDetail={handleViewDetail}
                  loading={actionLoading === request.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Tab Bar */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 rounded-t-3xl">
          <div className="flex justify-around py-3 pb-safe">
            <button
              onClick={() => onNavigate('coach-home')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              <span className="text-xs font-medium">ホーム</span>
            </button>
            <button
              onClick={() => onNavigate('request')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
              <span className="text-xs">添削依頼</span>
            </button>
            <button
              onClick={() => onNavigate('mypage')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/></svg>
              <span className="text-xs">マイページ</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27Z"/></svg>
              <span className="text-xs">設定</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
