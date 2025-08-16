// screens/SignupBirth.tsx
'use client';
import React from 'react';

type BirthValue = {
  year: string;
  month: string;
  day: string;
};

export function SignupBirth({
  value,
  onChange,
  onNext,
  devBypass = false,
}: {
  value: BirthValue;
  onChange: (v: BirthValue) => void;
  onNext: () => void;
  devBypass?: boolean;
}) {
  const setField = (k: keyof BirthValue, v: string) => onChange({ ...value, [k]: v });

  // 本番は必須（YYYY, MM, DD すべて）、開発時はスキップ
  const filled = Boolean(value.year && value.month && value.day);
  const canNext = devBypass ? true : filled;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 p-6 flex flex-col">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-2">birth</h1>
        <p className="text-white/90 text-center mb-6">生年月日を入力してください</p>

        <label className="block text-white text-sm font-medium mb-2">生年月日</label>
        <div className="grid grid-cols-3 gap-3">
          <input
            inputMode="numeric"
            maxLength={4}
            placeholder="YYYY"
            value={value.year}
            onChange={(e) => setField('year', e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
            className="w-full bg-transparent border-b border-white/50 text-white px-1 py-2 focus:outline-none"
          />
          <input
            inputMode="numeric"
            maxLength={2}
            placeholder="MM"
            value={value.month}
            onChange={(e) => setField('month', e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
            className="w-full bg-transparent border-b border-white/50 text-white px-1 py-2 focus:outline-none"
          />
          <input
            inputMode="numeric"
            maxLength={2}
            placeholder="DD"
            value={value.day}
            onChange={(e) => setField('day', e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
            className="w-full bg-transparent border-b border-white/50 text-white px-1 py-2 focus:outline-none"
          />
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
