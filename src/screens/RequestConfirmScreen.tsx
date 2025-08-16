import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  videoThumb: string;
  club: string;
  problems: string[];
  note: string;
  onNavigate: (screen: string) => void;
}

export const RequestConfirmScreen: React.FC<Props> = ({
  videoThumb, club, problems, note, onNavigate
}) => {
  return (
    <div className="max-w-[430px] mx-auto min-h-100dvh h-100dvh bg-white shadow-2xl rounded-[28px] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500" />

      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh px-4 pt-safe">
        <div className="flex items-center justify-between pt-4 pb-6">
          <button onClick={() => onNavigate('request-problem')}>
            <ArrowLeft size={24} color="white" />
          </button>
          <h1 className="text-white text-xl font-medium">依頼内容確認</h1>
          <div className="w-6" />
        </div>

        <div className="mb-6">
          <img src={videoThumb} className="w-full rounded-xl object-contain bg-black h-[200px]" alt="thumb" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-white space-y-4">
          <div><span className="font-semibold">クラブ：</span>{club}</div>
          <div><span className="font-semibold">課題：</span>{problems.join('、')}</div>
          <div><span className="font-semibold">自由記入：</span>{note || '（なし）'}</div>
        </div>

        <div className="mt-auto pb-6">
          <button
            onClick={() => onNavigate('request-done')}
            className="w-full bg-white text-purple-600 py-4 rounded-full font-medium"
          >
            依頼を完了する
          </button>
        </div>
      </div>
    </div>
  );
};
