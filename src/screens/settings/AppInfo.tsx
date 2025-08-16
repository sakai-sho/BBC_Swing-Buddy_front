import React from 'react';
import { ArrowLeft, Smartphone, Code, Heart } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type AppInfoProps = {
  onNavigate: (screen: string) => void;
};

export const AppInfoScreen: React.FC<AppInfoProps> = ({ onNavigate }) => {
  const { t } = useI18n();

  const appInfo = {
    name: 'SWING BUDDY',
    version: '1.0.0',
    build: '2025.01.15',
    developer: 'SWING BUDDY Team',
    copyright: '© 2025 SWING BUDDY. All rights reserved.'
  };

  const libraries = [
    { name: 'React', version: '18.3.1', license: 'MIT' },
    { name: 'TypeScript', version: '5.5.3', license: 'Apache-2.0' },
    { name: 'Tailwind CSS', version: '3.4.1', license: 'MIT' },
    { name: 'Lucide React', version: '0.344.0', license: 'ISC' },
    { name: 'Vite', version: '5.4.2', license: 'MIT' }
  ];

  return (
    <div className="max-w-[430px] mx-auto bg-gray-900 min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/bg.jpg)' }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-gray-900/95"
          style={{ backgroundColor: `rgba(0,0,0,var(--bg-dim))` }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-safe pt-4 pb-6">
          <button
            onClick={() => onNavigate('settings')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={t('settings.back')}
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          
          <h1 
            className="text-white text-2xl font-light"
            style={{ fontFamily: 'cursive' }}
          >
            {t('settings.about')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-6">
            {/* App Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Smartphone className="text-white" size={32} />
                </div>
                <h2 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: 'cursive' }}>
                  {appInfo.name}
                </h2>
                <p className="text-white/70 text-sm">
                  あなたのゴルフ上達をサポートする最高のパートナー
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/70">バージョン</span>
                  <span className="text-white font-medium">{appInfo.version}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/70">ビルド</span>
                  <span className="text-white font-medium">{appInfo.build}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/70">開発者</span>
                  <span className="text-white font-medium">{appInfo.developer}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Heart className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">主な機能</h3>
                  <p className="text-white/70 text-sm">SWING BUDDYでできること</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium">動画アップロード</p>
                    <p className="text-white/70 text-sm">スイング動画を簡単にアップロード</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium">プロによる添削</p>
                    <p className="text-white/70 text-sm">経験豊富なコーチからの詳細なアドバイス</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium">進捗管理</p>
                    <p className="text-white/70 text-sm">上達の記録と分析</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium">コーチとの交流</p>
                    <p className="text-white/70 text-sm">お気に入りコーチとの継続的なやり取り</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Libraries */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Code className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">使用ライブラリ</h3>
                  <p className="text-white/70 text-sm">オープンソースライブラリに感謝</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {libraries.map((lib, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
                    <div>
                      <p className="text-white font-medium text-sm">{lib.name}</p>
                      <p className="text-white/50 text-xs">{lib.license}</p>
                    </div>
                    <span className="text-white/70 text-sm">{lib.version}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-2">{appInfo.copyright}</p>
                <p className="text-white/50 text-xs">
                  Made with ❤️ for golfers worldwide
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};