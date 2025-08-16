import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onNavigate: (screen: string, params?: any) => void;
  onSaveDraft: (draft: { problems: string[]; note: string }) => void;
}

const PROBLEMS = ['スライス','フック','トップ','ダフリ','飛距離不足','方向性','弾道の高さ','スピン量','リズム','ミート率'];

export const RequestProblemScreen: React.FC<Props> = ({ onNavigate, onSaveDraft }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const toggle = (p: string) => {
    if (selected.includes(p)) {
      setSelected(selected.filter((x) => x !== p));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, p]);
      }
    }
  };

  const handleNext = () => {
    onSaveDraft({ problems: selected, note });
    onNavigate('request-confirm');
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-100dvh h-100dvh bg-white shadow-2xl rounded-[28px] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500" />
      <div className="relative z-10 flex flex-col h-full px-4 pt-safe">
        <div className="flex items-center justify-between pt-4 pb-6">
          <button onClick={() => onNavigate('request-club')}>
            <ArrowLeft size={24} color="white" />
          </button>
          <h1 className="text-white text-3xl font-light" style={{ fontFamily: 'cursive' }}>Problem</h1>
          <div className="w-6" />
        </div>

        <p className="text-white text-xs mb-2">※最大２つまで選択できます</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {PROBLEMS.map(p => {
            const isActive = selected.includes(p);
            return (
              <button
                key={p}
                onClick={() => toggle(p)}
                disabled={!isActive && selected.length >= 2}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  isActive ? 'bg-white text-purple-600 border border-white' : 'bg-white/20 text-white border border-white/20'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <div className="mb-8">
          <h2 className="text-white mb-2">自由記入（任意）</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="その他あれば記入してください"
            className="w-full min-h-[120px] bg-white/20 rounded-2xl text-white p-4 placeholder-white/60"
          />
        </div>

        <div className="mt-auto pb-6">
          <button
            onClick={handleNext}
            className="w-full bg-white text-purple-600 py-4 rounded-full font-medium"
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
};
