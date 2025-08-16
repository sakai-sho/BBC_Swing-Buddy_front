import React from "react";

interface VideoDetailProps {
  videoId: string;
  onNavigate: (screen: string, params?: any) => void;
}

const VideoDetail: React.FC<VideoDetailProps> = ({ videoId, onNavigate }) => {
  // 仮の動画詳細（実際はAPIで取得）
  const video = {
    id: videoId,
    title: `動画ID: ${videoId}`,
    url: "/media/demo.mp4",
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">動画詳細</h1>
      <video
        src={video.url}
        controls
        className="w-full h-auto rounded-lg border"
      />
      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onNavigate("coach-advice-new", { videoId })}
        >
          受諾して添削する
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => onNavigate("coach-home")}
        >
          戻る
        </button>
      </div>
    </div>
  );
};

export default VideoDetail;
