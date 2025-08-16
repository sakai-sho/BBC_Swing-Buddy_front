import React, { useState, useEffect } from 'react';
import { ArrowLeft, Database, Trash2, Video, Download } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type StorageProps = {
  onNavigate: (screen: string) => void;
};

type StorageData = {
  cacheSize: number; // MB
  videoCount: number;
  totalSize: number; // MB
};

type VideoFile = {
  id: string;
  name: string;
  size: number; // MB
  date: string;
  thumbnail: string;
};

export const StorageScreen: React.FC<StorageProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  
  const [storageData, setStorageData] = useState<StorageData>(() => {
    try {
      const saved = localStorage.getItem('sb:storage');
      return saved ? JSON.parse(saved) : {
        cacheSize: 45.2,
        videoCount: 12,
        totalSize: 234.8
      };
    } catch {
      return {
        cacheSize: 45.2,
        videoCount: 12,
        totalSize: 234.8
      };
    }
  });

  const [videos, setVideos] = useState<VideoFile[]>(() => {
    try {
      const saved = localStorage.getItem('sb:localVideos');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          name: 'ドライバー練習_2025-01-10.mp4',
          size: 23.4,
          date: '2025-01-10',
          thumbnail: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
          id: '2',
          name: 'アイアン練習_2025-01-08.mp4',
          size: 18.7,
          date: '2025-01-08',
          thumbnail: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
          id: '3',
          name: 'パター練習_2025-01-05.mp4',
          size: 12.3,
          date: '2025-01-05',
          thumbnail: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ];
    } catch {
      return [];
    }
  });

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('sb:storage', JSON.stringify(storageData));
  }, [storageData]);

  useEffect(() => {
    localStorage.setItem('sb:localVideos', JSON.stringify(videos));
  }, [videos]);

  const clearCache = () => {
    setStorageData(prev => ({ ...prev, cacheSize: 0 }));
    setShowClearConfirm(false);
  };

  const deleteVideo = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (video) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
      setStorageData(prev => ({
        ...prev,
        videoCount: prev.videoCount - 1,
        totalSize: prev.totalSize - video.size
      }));
    }
  };

  const formatSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
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
            {t('settings.dataStorage')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-6">
            {/* Storage Overview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Database className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">ストレージ使用量</h3>
                  <p className="text-white/70 text-sm">端末に保存されているデータ</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-white text-2xl font-bold">{formatSize(storageData.totalSize)}</p>
                  <p className="text-white/70 text-sm">合計使用量</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-2xl font-bold">{storageData.videoCount}</p>
                  <p className="text-white/70 text-sm">保存動画数</p>
                </div>
              </div>
            </div>

            {/* Cache */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Trash2 className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-base">キャッシュデータ</h3>
                    <p className="text-white/70 text-sm">{formatSize(storageData.cacheSize)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  disabled={storageData.cacheSize === 0}
                >
                  削除
                </button>
              </div>
            </div>

            {/* Video Files */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                  <Video className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-base">保存された動画</h3>
                  <p className="text-white/70 text-sm">ローカルに保存されている動画ファイル</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-12 h-8 rounded bg-gray-600 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{video.name}</p>
                      <p className="text-white/70 text-xs">
                        {formatSize(video.size)} • {new Date(video.date).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                      aria-label={`${video.name}を削除`}
                    >
                      <Trash2 className="text-red-400" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Clear Cache Confirmation */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm w-full border border-white/20">
              <h3 className="text-white font-medium text-lg mb-2">キャッシュを削除</h3>
              <p className="text-white/70 text-sm mb-6">
                キャッシュデータを削除しますか？この操作は元に戻せません。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={clearCache}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};