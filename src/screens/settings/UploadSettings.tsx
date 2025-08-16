import React, { useState, useEffect } from 'react';
import { ArrowLeft, Video, Wifi, Zap, HardDrive } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type UploadSettingsProps = {
  onNavigate: (screen: string) => void;
};

type UploadSettings = {
  quality: 'auto' | 'high' | 'balanced';
  wifiOnly: boolean;
  autoCompress: boolean;
  maxSizeMB: number;
};

export const UploadSettingsScreen: React.FC<UploadSettingsProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  
  const [settings, setSettings] = useState<UploadSettings>(() => {
    try {
      const saved = localStorage.getItem('sb:uploadSettings');
      return saved ? JSON.parse(saved) : {
        quality: 'balanced',
        wifiOnly: true,
        autoCompress: true,
        maxSizeMB: 100
      };
    } catch {
      return {
        quality: 'balanced',
        wifiOnly: true,
        autoCompress: true,
        maxSizeMB: 100
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('sb:uploadSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof UploadSettings>(key: K, value: UploadSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const QualitySelector: React.FC = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Video className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-white font-medium text-base">画質設定</h3>
          <p className="text-white/70 text-sm">アップロード時の動画品質</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {[
          { key: 'auto', label: '自動', desc: 'ネットワーク状況に応じて最適化' },
          { key: 'high', label: '高画質', desc: '最高品質でアップロード' },
          { key: 'balanced', label: 'バランス', desc: '品質とサイズのバランス' }
        ].map(({ key, label, desc }) => (
          <button
            key={key}
            onClick={() => updateSetting('quality', key as any)}
            className={`w-full p-3 rounded-lg text-left transition-colors ${
              settings.quality === key
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <div className="font-medium">{label}</div>
            <div className="text-sm opacity-80">{desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const ToggleItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void;
    iconBg: string;
  }> = ({ icon, title, description, value, onChange, iconBg }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium text-base mb-1">{title}</h3>
          <p className="text-white/70 text-sm">{description}</p>
        </div>
        <button
          onClick={() => onChange(!value)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            value ? 'bg-purple-600' : 'bg-white/20'
          }`}
          aria-label={`${title}を${value ? 'オフ' : 'オン'}にする`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
              value ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const SizeSlider: React.FC = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <HardDrive className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-white font-medium text-base">最大ファイルサイズ</h3>
          <p className="text-white/70 text-sm">アップロード可能な最大サイズ</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">50MB</span>
          <span className="text-white font-medium">{settings.maxSizeMB}MB</span>
          <span className="text-white/70 text-sm">300MB</span>
        </div>
        <input
          type="range"
          min="50"
          max="300"
          step="10"
          value={settings.maxSizeMB}
          onChange={(e) => updateSetting('maxSizeMB', parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
          style={{
            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((settings.maxSizeMB - 50) / 250) * 100}%, rgba(255,255,255,0.2) ${((settings.maxSizeMB - 50) / 250) * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
      </div>
    </div>
  );

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
            {t('settings.videoPrefs')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-4">
            <QualitySelector />
            
            <ToggleItem
              icon={<Wifi className="text-white" size={20} />}
              title="Wi-Fiのみでアップロード"
              description="モバイルデータ通信量を節約します"
              value={settings.wifiOnly}
              onChange={(value) => updateSetting('wifiOnly', value)}
              iconBg="bg-gradient-to-br from-green-500 to-emerald-500"
            />

            <ToggleItem
              icon={<Zap className="text-white" size={20} />}
              title="自動圧縮"
              description="アップロード前に動画を自動で圧縮します"
              value={settings.autoCompress}
              onChange={(value) => updateSetting('autoCompress', value)}
              iconBg="bg-gradient-to-br from-purple-500 to-violet-500"
            />

            <SizeSlider />
          </div>
        </main>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};