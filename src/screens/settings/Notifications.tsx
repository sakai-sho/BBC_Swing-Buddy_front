import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, MessageCircle, CheckCircle, Megaphone } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type NotificationsProps = {
  onNavigate: (screen: string) => void;
};

type NotificationSettings = {
  enabled: boolean;
  coachReplies: boolean;
  lessonComplete: boolean;
  appNews: boolean;
};

export const NotificationsScreen: React.FC<NotificationsProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem('sb:notifications');
      return saved ? JSON.parse(saved) : {
        enabled: true,
        coachReplies: true,
        lessonComplete: true,
        appNews: false
      };
    } catch {
      return {
        enabled: true,
        coachReplies: true,
        lessonComplete: true,
        appNews: false
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('sb:notifications', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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
            {t('settings.notifications')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-4">
            <ToggleItem
              icon={<Bell className="text-white" size={20} />}
              title="通知を受け取る"
              description="アプリからの通知を受け取ります"
              value={settings.enabled}
              onChange={(value) => updateSetting('enabled', value)}
              iconBg="bg-gradient-to-br from-blue-500 to-cyan-500"
            />

            <ToggleItem
              icon={<MessageCircle className="text-white" size={20} />}
              title="コーチからの返信"
              description="コーチから添削結果が届いた時に通知します"
              value={settings.coachReplies}
              onChange={(value) => updateSetting('coachReplies', value)}
              iconBg="bg-gradient-to-br from-green-500 to-emerald-500"
            />

            <ToggleItem
              icon={<CheckCircle className="text-white" size={20} />}
              title="添削完了"
              description="動画の添削が完了した時に通知します"
              value={settings.lessonComplete}
              onChange={(value) => updateSetting('lessonComplete', value)}
              iconBg="bg-gradient-to-br from-purple-500 to-violet-500"
            />

            <ToggleItem
              icon={<Megaphone className="text-white" size={20} />}
              title="アプリからのお知らせ"
              description="新機能やキャンペーン情報をお知らせします"
              value={settings.appNews}
              onChange={(value) => updateSetting('appNews', value)}
              iconBg="bg-gradient-to-br from-orange-500 to-red-500"
            />
          </div>
        </main>
      </div>
    </div>
  );
};