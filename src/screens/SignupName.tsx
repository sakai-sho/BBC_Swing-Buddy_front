// screens/SignupName.tsx
'use client';
import React from 'react';

type NameValue = {
  kanji: [string, string];
  kana: [string, string];
};

export function SignupName({
  value,
  onChange,
  onNext,         // ユーザーとして次へ
  onSelectCoach,  // コーチとして登録へ
  disabled,
  devBypass = false, // ★ 追加（デフォルト false）
}: {
  value: NameValue;
  onChange: (v: NameValue) => void;
  onNext: () => void;
  onSelectCoach: () => void;
  disabled?: boolean;
  devBypass?: boolean;
}) {
  const setKanji = (idx: 0 | 1, v: string) =>
    onChange({ ...value, kanji: idx === 0 ? [v, value.kanji[1]] : [value.kanji[0], v] });

  const setKana = (idx: 0 | 1, v: string) =>
    onChange({ ...value, kana: idx === 0 ? [v, value.kana[1]] : [value.kana[0], v] });

  // ★ 開発モードなら常に「次へ」有効
  const canNext = devBypass ? true : !disabled;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 p-6 flex flex-col">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-2">name</h1>
        <p className="text-white/90 text-center mb-6">お名前を入力してください</p>

        {/* 氏名（漢字） */}
        <label className="block text-white text-sm font-medium mb-2">氏名（漢字）</label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            value={value.kanji[0]}
            onChange={(e) => setKanji(0, e.target.value)}
            placeholder="姓"
            className="w-full bg-transparent border-b border-white/50 text-white px-1 py-2 focus:outline-none"
          />
          <input
            value={value.kanji[1]}
            onChange={(e) => setKanji(1, e.target.value)}
            placeholder="名"
            className="w-full bg-transparent border-b border-white/50 text-white px-1 py-2 focus:outline-none"
          />
        </div>

        {/* 氏名（フリガナ） */}
        <label className="block text-white text-sm font-medium mb-2">氏名（フリガナ）</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            value={value.kana[0]}
            onChange={(e) => setKana(0, e.target.value)}
            placeholder="セイ"
            className="w-full bg-transparent border-b border-white/50 text-white px-1 py-2 focus:outline-none"
          />
          <input
            value={value.kana[1]}
            onChange={(e) => setKana(1, e.target.value)}
            placeholder="メイ"
            className="w-full bg-transparent border-b border-white/50 text-white px-1 py-2 focus:outline-none"
          />
        </div>

        {/* コーチ分岐ボタン */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onSelectCoach}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold shadow-lg hover:opacity-95"
          >
            コーチとして登録希望の方はこちら
          </button>
          <p className="text-[11px] text-white/80 mt-2 text-center">
            ※コーチ登録は運営審査後に有効となります
          </p>
        </div>
      </div>

      {/* 下部の「次へ」：ユーザーとして進む */}
      <div className="mt-auto pt-4">
        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className={`w-full py-4 rounded-3xl shadow-lg ${
            !canNext
              ? 'bg-white/30 text-white cursor-not-allowed'
              : 'bg-white text-purple-700 hover:bg-white/90'
          }`}
        >
          次へ
        </button>
      </div>
    </div>
  );
}
