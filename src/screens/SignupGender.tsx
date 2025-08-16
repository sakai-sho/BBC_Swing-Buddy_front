// screens/SignupGender.tsx
'use client';
import React from 'react';

export function SignupGender({
  value,
  onChange,
  onNext,
  devBypass = false,
}: {
  value: 'male' | 'female' | '';
  onChange: (v: 'male' | 'female' | '') => void;
  onNext: () => void;
  devBypass?: boolean;
}) {
  // 本番は選択必須、開発時はスキップ
  const canNext = devBypass ? true : value !== '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 p-6 flex flex-col">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-2">gender</h1>
        <p className="text-white/90 text-center mb-6">性別を選択してください</p>

        <label className="block text-white text-sm font-medium mb-3">性別</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange('male')}
            className={`w-full py-3 rounded-2xl border ${
              value === 'male'
                ? 'bg-white text-purple-700 border-white'
                : 'bg-transparent text-white border-white/50'
            }`}
          >
            男性
          </button>
          <button
            type="button"
            onClick={() => onChange('female')}
            className={`w-full py-3 rounded-2xl border ${
              value === 'female'
                ? 'bg-white text-purple-700 border-white'
                : 'bg-transparent text-white border-white/50'
            }`}
          >
            女性
          </button>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className={`w-full py-4 rounded-3xl shadow-lg ${
            !canNext ? 'bg-white/30 text-white cursor-not-allowed' : 'bg-white text-purple-700 hover:bg-white/90'
          }`}
        >
          次へ
        </button>
      </div>
    </div>
  );
}
