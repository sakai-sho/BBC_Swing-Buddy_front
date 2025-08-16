import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, PlayCircle, MessageCircle } from 'lucide-react';

export type CoachJobsScreenProps = {
  onOpenCoachReview: (id: string) => void;
  onBack?: () => void;
};

type JobItem = {
  id: string;
  userHandle: string;
  userAvatar: string;
  club: string;
  tags: string[];
  deadline: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: 'accepted' | 'in_progress' | 'completed';
  commentsCount: number;
};

const MOCK_JOBS: JobItem[] = [
  {
    id: 'job1',
    userHandle: 'sara',
    userAvatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
    club: 'Driver',
    tags: ['スライス', '飛距離不足'],
    deadline: '2025-01-12T15:00:00Z',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'accepted',
    commentsCount: 3
  },
  {
    id: 'job2',
    userHandle: 'taro',
    userAvatar: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100',
    club: 'Iron',
    tags: ['フック', 'ミート率'],
    deadline: '2025-01-13T10:00:00Z',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'in_progress',
    commentsCount: 1
  }
];

export const CoachJobsScreen: React.FC<CoachJobsScreenProps> = ({
  onOpenCoachReview,
  onBack
}) => {
  const [jobs, setJobs] = useState<JobItem[]>(MOCK_JOBS);

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 0) return '期限切れ';
    if (diffHours < 24) return `残り${diffHours}時間`;
    const diffDays = Math.ceil(diffHours / 24);
    return `残り${diffDays}日`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-blue-500';
      case 'in_progress': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted': return '受諾済み';
      case 'in_progress': return '対応中';
      case 'completed': return '完了';
      default: return status;
    }
  };

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
            onClick={onBack || (() => {})}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-white text-lg font-medium">受諾中の依頼</h1>
          <div className="w-10" />
        </div>

        {/* Jobs List */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-white text-lg font-medium mb-2">
                受諾中の依頼がありません
              </h3>
              <p className="text-white/70 text-sm">
                新しい依頼を受諾してください
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img
                      src={job.thumbnailUrl}
                      alt={`${job.userHandle}の動画`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                        <PlayCircle className="text-white" size={24} />
                      </div>
                    </div>
                    
                    {/* Status badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs text-white rounded-full ${getStatusColor(job.status)}`}>
                        {getStatusLabel(job.status)}
                      </span>
                    </div>
                    
                    {/* Deadline */}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      <Clock size={12} className="inline mr-1" />
                      {formatDeadline(job.deadline)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* User info */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={job.userAvatar}
                        alt={job.userHandle}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <span className="text-white font-medium">@{job.userHandle}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded">
                            {job.club}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-white/70">
                        <MessageCircle size={14} />
                        <span className="text-sm">{job.commentsCount}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        console.log('Opening coach review for job:', job.id);
                        onOpenCoachReview(job.id);
                      }}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      対応中
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};