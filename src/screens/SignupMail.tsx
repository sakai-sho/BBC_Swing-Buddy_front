// screens/SignupMail.tsx
'use client';
import React, { useMemo } from 'react';

export function SignupMail({
  value,
  onChange,
  onNext,
  devBypass = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  devBypass?: boolean;
}) {
  // ざっくりメール判定（本番用）。開発時は無視。
  const emailValid = useMemo(() => /.+@.+\..+/.test(value), [value]);
  const canNext = devBypass ? true : emailValid;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 p-6 flex flex-col">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-2">email</h1>
        <p className="text-white/90 text-center mb-6">メールアドレスを入力してください</p>

        <label className="block text-white text-sm font-medium mb-2">メールアドレス</label>
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="example@example.com"
          className="w-full bg-transparent border-b border-white/50 text-white px-1 py-2 focus:outline-none"
        />
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
