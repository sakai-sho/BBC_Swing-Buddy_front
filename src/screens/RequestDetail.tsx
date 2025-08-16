import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Clock, Ticket, Pen as Yen, MessageCircle } from 'lucide-react';
import { getRequestById, acceptRequest, declineRequest } from '../services/requests';
import type { RequestItem } from '../types/requests';

interface RequestDetailProps {
  requestId: string;
  onBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

/** requestからvideoIdっぽい値を頑健に取り出す */
const extractVideoId = (req: any): string | undefined => {
  if (!req) return undefined;
  return (
    req.videoId ??
    req.video_id ??
    req.videoUID ??
    req.videoUid ??
    req.mediaId ??
    req.media_id ??
    req.video_uuid ??
    req.video?.id ??
    req.video?.videoId ??
    req.review?.video_id ??
    req.review?.videoId
  );
};

export const RequestDetail: React.FC<RequestDetailProps> = ({
  requestId,
  onBack,
  onNavigate,
}) => {
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequest = async () => {
      try {
        setLoading(true);
        const data = await getRequestById(requestId);
        setRequest(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load request');
      } finally {
        setLoading(false);
      }
    };
    loadRequest();
  }, [requestId]);

  /** 辞退 */
  const handleDecline = async () => {
    if (!request) return;
    setActionLoading(true);
    try {
      await declineRequest(request.id);
      onBack();
    } catch (e) {
      console.error('Failed to decline request:', e);
    } finally {
      setActionLoading(false);
    }
  };

  /** 受諾して添削へ（受諾済みならそのまま） */
  const handleAcceptAndGoToAdvice = async () => {
    if (!request) return;
    setActionLoading(true);
    try {
      if (request.status !== 'accepted') {
        await acceptRequest(request.id);
        setRequest({ ...request, status: 'accepted' }); // 画面上の状態も更新
      }
      const videoId = extractVideoId(request);
      onNavigate('coach-advice-new', { videoId, requestId: request.id });
    } catch (e) {
      console.error('Failed to accept & navigate:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return '初心者';
      case 'intermediate':
        return '中級者';
      case 'advanced':
        return '上級者';
      default:
        return level;
    }
  };

  const getClubLabel = (club: string) => {
    switch (club) {
      case 'driver':
        return 'ドライバー';
      case 'wood':
        return 'ウッド';
      case 'utility':
        return 'ユーティリティ';
      case 'iron':
        return 'アイアン';
      case 'wedge':
        return 'ウェッジ';
      case 'putter':
        return 'パター';
      default:
        return club;
    }
  };

  const getEnvironmentLabel = (env?: string) => {
    switch (env) {
      case 'outdoor':
        return '屋外';
      case 'indoor':
        return '屋内';
      default:
        return '不明';
    }
  };

  const getHandednessLabel = (hand?: string) => {
    switch (hand) {
      case 'right':
        return '右利き';
      case 'left':
        return '左利き';
      default:
        return '不明';
    }
  };

  if (loading) {
    return (
      <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/bg.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90 pointer-events-none" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-100dvh">
          <div className="text-white">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/bg.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90 pointer-events-none" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-100dvh px-4">
          <div className="text-white text-center">
            <p className="mb-4">{error || '依頼が見つかりません'}</p>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-white text-lg font-medium">依頼詳細</h1>
          <div className="w-10" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {/* Video Preview */}
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
            <img
              src={(request as any).thumbnailUrl}
              alt="動画サムネイル"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                <Play className="text-white ml-1" size={24} />
              </button>
            </div>
            {'durationSec' in request && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                {formatDuration((request as any).durationSec as number)}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={(request as any).userAvatar}
                alt={(request as any).userHandle}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-white font-medium text-lg">@{(request as any).userHandle}</h3>
                <p className="text-white/70 text-sm">
                  {getLevelLabel((request as any).level)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white/70 mb-1">
                  <MessageCircle size={16} />
                  <span className="text-sm">過去依頼数</span>
                </div>
                <span className="text-white font-medium">
                  {(request as any).commentsCount}件
                </span>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
            <h3 className="text-white font-medium text-lg mb-4">依頼内容</h3>

            <div className="space-y-3 mb-4">
              {'club' in request && (
                <div className="flex justify-between">
                  <span className="text-white/70">クラブ</span>
                  <span className="text-white">{getClubLabel((request as any).club)}</span>
                </div>
              )}
              {'environment' in request && (
                <div className="flex justify-between">
                  <span className="text-white/70">撮影環境</span>
                  <span className="text-white">
                    {getEnvironmentLabel((request as any).environment)}
                  </span>
                </div>
              )}
              {'handedness' in request && (
                <div className="flex justify-between">
                  <span className="text-white/70">利き手</span>
                  <span className="text-white">
                    {getHandednessLabel((request as any).handedness)}
                  </span>
                </div>
              )}
              {'createdAt' in request && (
                <div className="flex justify-between">
                  <span className="text-white/70">提出日時</span>
                  <span className="text-white">
                    {formatDate((request as any).createdAt)}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {'tags' in request && Array.isArray((request as any).tags) && (
              <div className="mb-4">
                <p className="text-white/70 text-sm mb-2">課題タグ</p>
                <div className="flex flex-wrap gap-2">
                  {(request as any).tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {'description' in request && (request as any).description && (
              <div>
                <p className="text-white/70 text-sm mb-2">詳細</p>
                <p className="text-white text-sm leading-relaxed">
                  {(request as any).description}
                </p>
              </div>
            )}
          </div>

          {/* Reward */}
          {'reward' in request && (request as any).reward && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4 mb-6">
              <h3 className="text-white font-medium text-lg mb-3">報酬</h3>
              <div className="flex items-center gap-2">
                {(request as any).reward.kind === 'ticket' ? (
                  <Ticket className="text-purple-400" size={24} />
                ) : (
                  <Yen className="text-green-400" size={24} />
                )}
                <span className="text-white text-xl font-bold">
                  {(request as any).reward.amount}
                  {(request as any).reward.kind === 'ticket' ? 'チケット' : '円'}
                </span>
              </div>
            </div>
          )}

          {/* Deadline (if accepted) */}
          {request.status === 'accepted' && (request as any).deadline && (
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl border border-yellow-500/30 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-yellow-400" size={20} />
                <h3 className="text-yellow-400 font-medium">対応期限</h3>
              </div>
              <p className="text-white">
                {formatDate((request as any).deadline)}
              </p>
              <p className="text-yellow-400 text-sm mt-1">
                残り{' '}
                {Math.ceil(
                  ((new Date((request as any).deadline).getTime()) - Date.now()) /
                    (1000 * 60 * 60)
                )}{' '}
                時間
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 p-4 pb-safe">
          {/* new / accepted どちらでも右ボタンは「受諾して添削する」 */}
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              チャット
            </button>

            <button
              onClick={request.status === 'completed' ? onBack : handleAcceptAndGoToAdvice}
              disabled={actionLoading}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {actionLoading ? '処理中...' : '受諾して添削する'}
            </button>
          </div>

          {request.status === 'completed' && (
            <div className="text-center py-3">
              <span className="text-green-400 font-medium">完了済み</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
