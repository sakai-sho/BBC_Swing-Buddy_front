'use client';
import React, { useMemo, useState } from 'react';

/** 画面間で引き回すデータ型（必要に応じてフィールドを増減してください） */
type Name = { kanji: [string, string]; kana: [string, string] };

type Step = 'STEP1Basic' | 'STEP2Career' | 'STEP3Social' | 'STEP4Location';

type BasicData = {
  lastJa: string;
  firstJa: string;
  lastKana: string;
  firstKana: string;
  email: string;
  tel: string;
  gender: '' | 'male' | 'female';
  birth: string; // YYYY-MM-DD
};

type CareerData = {
  years: string;          // 指導年数
  qualification: string;  // 資格/ライセンス
  strengths: string;      // 得意分野
  bio: string;            // 自己紹介
};

type SocialData = {
  lineId: string;
  instagram: string;
  twitter: string;
  website: string;
};

type LocationData = {
  country: string;
  prefecture: string;
  city: string;
  venue: string;          // 主な活動場所/練習場
};

export function CoachSignupMain({
  initialName,
  onBack,
  onDone, // 最終STEPで完了として呼ぶ
}: {
  initialName: Name;
  onBack: () => void;
  onDone: () => void;
}) {
  // ===== ステップ管理 =====
  const [step, setStep] = useState<Step>('STEP1Basic');

  // ===== 共有フォーム状態 =====
  const [basic, setBasic] = useState<BasicData>({
    lastJa: initialName.kanji[0] ?? '',
    firstJa: initialName.kanji[1] ?? '',
    lastKana: initialName.kana[0] ?? '',
    firstKana: initialName.kana[1] ?? '',
    email: '',
    tel: '',
    gender: '',
    birth: '',
  });

  const [career, setCareer] = useState<CareerData>({
    years: '',
    qualification: '',
    strengths: '',
    bio: '',
  });

  const [social, setSocial] = useState<SocialData>({
    lineId: '',
    instagram: '',
    twitter: '',
    website: '',
  });

  const [location, setLocation] = useState<LocationData>({
    country: '日本',
    prefecture: '',
    city: '',
    venue: '',
  });

  // ===== バリデーション（開発中はバイパス） =====
  const devBypass = process.env.NODE_ENV !== 'production';
  const emailValid = useMemo(() => /.+@.+\..+/.test(basic.email), [basic.email]);
  const telValid = useMemo(() => /^[0-9+\-() ]{7,}$/.test(basic.tel), [basic.tel]);

  const stepValid = useMemo(() => {
    if (devBypass) return true;
    switch (step) {
      case 'STEP1Basic':
        return (
          basic.lastJa.trim() &&
          basic.firstJa.trim() &&
          basic.lastKana.trim() &&
          basic.firstKana.trim() &&
          basic.email.trim() &&
          basic.tel.trim() &&
          emailValid &&
          telValid &&
          basic.gender !== '' &&
          basic.birth.trim()
        );
      case 'STEP2Career':
        // 最低限どれか1つでも入力がある、など運用に合わせて調整可能
        return Boolean(career.years || career.qualification || career.strengths || career.bio);
      case 'STEP3Social':
        // 任意項目扱いでもOK。ここでは常に true（本番で要件があれば調整）
        return true;
      case 'STEP4Location':
        return Boolean(location.prefecture && location.city);
      default:
        return false;
    }
  }, [step, basic, career, social, location, emailValid, telValid, devBypass]);

  const goNext = () => {
    if (step === 'STEP1Basic') setStep('STEP2Career');
    else if (step === 'STEP2Career') setStep('STEP3Social');
    else if (step === 'STEP3Social') setStep('STEP4Location');
    else onDone();
  };

  const goPrev = () => {
    if (step === 'STEP1Basic') onBack();
    else if (step === 'STEP2Career') setStep('STEP1Basic');
    else if (step === 'STEP3Social') setStep('STEP2Career');
    else if (step === 'STEP4Location') setStep('STEP3Social');
  };

  // ===== 共通フレーム =====
  const Frame: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 p-6 relative">
      {/* 背景はクリック無効化 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ヘッダー */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <button onClick={goPrev} className="p-2 text-white hover:bg-white/20 rounded-full transition">← 戻る</button>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <div className="text-white/80 text-sm">
            {step === 'STEP1Basic' && 'STEP 1 / 4'}
            {step === 'STEP2Career' && 'STEP 2 / 4'}
            {step === 'STEP3Social' && 'STEP 3 / 4'}
            {step === 'STEP4Location' && 'STEP 4 / 4'}
          </div>
        </div>

        {/* 本文 */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            {children}
          </div>
        </div>

        {/* フッター */}
        <div className="pt-4 pb-2">
          <button
            onClick={goNext}
            disabled={!stepValid}
            className={`w-full py-3 rounded-2xl transition shadow-lg ${
              stepValid ? 'bg-white text-purple-700 hover:bg-white/90' : 'bg-white/30 text-white cursor-not-allowed'
            }`}
          >
            {step === 'STEP4Location' ? '申請を送信する' : '次へ →'}
          </button>
        </div>
      </div>
    </div>
  );

  // ===== 各ステップのUI =====

  // STEP1Basic
  if (step === 'STEP1Basic') {
    return (
      <Frame title="コーチ登録 - STEP1 Basic">
        <label className="block text-white text-sm font-medium mb-2">氏名（漢字） *</label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input value={basic.lastJa} onChange={(e) => setBasic({ ...basic, lastJa: e.target.value })} placeholder="姓" className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70" />
          <input value={basic.firstJa} onChange={(e) => setBasic({ ...basic, firstJa: e.target.value })} placeholder="名" className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70" />
        </div>

        <label className="block text-white text-sm font-medium mb-2">氏名（フリガナ） *</label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input value={basic.lastKana} onChange={(e) => setBasic({ ...basic, lastKana: e.target.value })} placeholder="セイ" className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70" />
          <input value={basic.firstKana} onChange={(e) => setBasic({ ...basic, firstKana: e.target.value })} placeholder="メイ" className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70" />
        </div>

        <label className="block text-white text-sm font-medium mb-2">メールアドレス *</label>
        <input type="email" value={basic.email} onChange={(e) => setBasic({ ...basic, email: e.target.value })} className="mb-1 w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70" placeholder="example@example.com" />
        {!devBypass && !emailValid && basic.email.length > 0 && <p className="text-xs text-rose-200 mb-3">有効なメールアドレスを入力してください</p>}

        <label className="block text-white text-sm font-medium mb-2 mt-2">電話番号 *</label>
        <input value={basic.tel} onChange={(e) => setBasic({ ...basic, tel: e.target.value })} className="mb-1 w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70" placeholder="09012345678 / +81-90-1234-5678" />
        {!devBypass && !telValid && basic.tel.length > 0 && <p className="text-xs text-rose-200 mb-3">有効な電話番号を入力してください</p>}

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <label className="block text-white text-sm font-medium mb-2">生年月日 *</label>
            <input type="date" value={basic.birth} onChange={(e) => setBasic({ ...basic, birth: e.target.value })} className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">性別 *</label>
            <select value={basic.gender} onChange={(e) => setBasic({ ...basic, gender: e.target.value as BasicData['gender'] })} className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white">
              <option value="" className="text-gray-700">選択してください</option>
              <option value="male" className="text-gray-700">男性</option>
              <option value="female" className="text-gray-700">女性</option>
            </select>
          </div>
        </div>
      </Frame>
    );
  }

  // STEP2Career
  if (step === 'STEP2Career') {
    return (
      <Frame title="コーチ登録 - STEP2 Career">
        <label className="block text-white text-sm font-medium mb-2">指導年数</label>
        <input value={career.years} onChange={(e) => setCareer({ ...career, years: e.target.value })} className="mb-4 w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="例: 5年" />

        <label className="block text-white text-sm font-medium mb-2">資格・ライセンス</label>
        <input value={career.qualification} onChange={(e) => setCareer({ ...career, qualification: e.target.value })} className="mb-4 w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="例: PGA/USGTF など" />

        <label className="block text-white text-sm font-medium mb-2">得意分野</label>
        <input value={career.strengths} onChange={(e) => setCareer({ ...career, strengths: e.target.value })} className="mb-4 w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="例: 初心者指導、スイング解析、ショートゲーム" />

        <label className="block text-white text-sm font-medium mb-2">自己紹介</label>
        <textarea value={career.bio} onChange={(e) => setCareer({ ...career, bio: e.target.value })} className="w-full min-h-[120px] bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="実績・指導方針などをお書きください" />
      </Frame>
    );
  }

  // STEP3Social
  if (step === 'STEP3Social') {
    return (
      <Frame title="コーチ登録 - STEP3 Social">
        <label className="block text-white text-sm font-medium mb-2">LINE ID（任意）</label>
        <input value={social.lineId} onChange={(e) => setSocial({ ...social, lineId: e.target.value })} className="mb-4 w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="@your_id" />

        <label className="block text-white text-sm font-medium mb-2">Instagram（任意）</label>
        <input value={social.instagram} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} className="mb-4 w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="https://instagram.com/..." />

        <label className="block text-white text-sm font-medium mb-2">X / Twitter（任意）</label>
        <input value={social.twitter} onChange={(e) => setSocial({ ...social, twitter: e.target.value })} className="mb-4 w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="https://x.com/..." />

        <label className="block text-white text-sm font-medium mb-2">Webサイト（任意）</label>
        <input value={social.website} onChange={(e) => setSocial({ ...social, website: e.target.value })} className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="https://..." />
      </Frame>
    );
  }

  // STEP4Location
  return (
    <Frame title="コーチ登録 - STEP4 Location">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-white text-sm font-medium mb-2">国</label>
          <input value={location.country} onChange={(e) => setLocation({ ...location, country: e.target.value })} className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">都道府県 *</label>
          <input value={location.prefecture} onChange={(e) => setLocation({ ...location, prefecture: e.target.value })} className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="例: 東京都" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">市区町村 *</label>
          <input value={location.city} onChange={(e) => setLocation({ ...location, city: e.target.value })} className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="例: 渋谷区" />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">主な活動場所</label>
          <input value={location.venue} onChange={(e) => setLocation({ ...location, venue: e.target.value })} className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white" placeholder="例: 〇〇練習場" />
        </div>
      </div>

      <p className="text-white/80 text-xs mt-4">
        ※「申請を送信する」で審査受付となります（1〜3営業日）。
      </p>
    </Frame>
  );
}
