'use client';
import React, { useEffect } from 'react';
import { setRole } from '../../state/auth';

export function CoachSignupDone({
  onHome,
  onProfile,
}: {
  onHome: () => void;
  onProfile: () => void;
}) {
  useEffect(() => {
    // 申請完了時に必ずロールを coach にする
    setRole('coach');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 p-6 flex flex-col justify-between">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">ありがとうございます</h1>
        <div className="bg-white/10 p-4 rounded-2xl text-white max-w-md">
          <p className="mb-4">コーチ申請を受け付けました</p>
          <p className="text-sm mb-2">審査には1〜3営業日かかります。結果はメールでご連絡します。</p>
          <p className="text-sm font-semibold">審査について</p>
          <ul className="text-left text-sm list-disc list-inside">
            <li>身分証明書の確認</li>
            <li>指導経験・資格の確認</li>
            <li>面接（オンライン）</li>
          </ul>
        </div>
      </div>

      {/* 下部ボタン */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setRole('coach'); // 念押し
            onHome();         // App.tsx 側で coach-home に遷移するように
          }}
          className="flex-1 py-3 rounded-2xl bg-white text-purple-700 font-semibold"
        >
          ホームへ戻る
        </button>
        <button
          onClick={() => {
            setRole('coach'); // 念押し
            onProfile();      // App.tsx 側でマイページ（コーチ用）に遷移するように
          }}
          className="flex-1 py-3 rounded-2xl bg-white/30 text-white font-semibold"
        >
          マイページ
        </button>
      </div>
    </div>
  );
}
