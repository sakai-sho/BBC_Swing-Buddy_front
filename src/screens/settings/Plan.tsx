import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Ticket, CreditCard, Star } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type PlanProps = {
  onNavigate: (screen: string) => void;
};

type PlanData = {
  currentPlan: 'FREE' | 'PREMIUM';
  tickets: number;
  nextBilling?: string;
};

export const PlanScreen: React.FC<PlanProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  
  const [planData, setPlanData] = useState<PlanData>(() => {
    try {
      const saved = localStorage.getItem('sb:plan');
      return saved ? JSON.parse(saved) : {
        currentPlan: 'FREE',
        tickets: 2,
        nextBilling: undefined
      };
    } catch {
      return {
        currentPlan: 'FREE',
        tickets: 2,
        nextBilling: undefined
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('sb:plan', JSON.stringify(planData));
  }, [planData]);

  const handleUpgrade = () => {
    // Simulate upgrade
    setPlanData(prev => ({
      ...prev,
      currentPlan: 'PREMIUM',
      nextBilling: '2025-02-15'
    }));
  };

  const handleBuyTickets = () => {
    // Simulate ticket purchase
    setPlanData(prev => ({
      ...prev,
      tickets: prev.tickets + 5
    }));
  };

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
            {t('settings.subscription')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Crown className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">現在のプラン</h3>
                  <p className="text-white/70 text-sm">
                    {planData.currentPlan === 'PREMIUM' ? 'プレミアム' : 'フリー'}
                  </p>
                </div>
              </div>
              
              {planData.currentPlan === 'PREMIUM' && planData.nextBilling && (
                <p className="text-white/70 text-sm">
                  次回請求日: {planData.nextBilling}
                </p>
              )}
            </div>

            {/* Tickets */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                    <Ticket className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">チケット</h3>
                    <p className="text-white/70 text-sm">添削依頼に使用</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-2xl font-bold">{planData.tickets}</p>
                  <p className="text-white/70 text-sm">枚</p>
                </div>
              </div>
              
              <button
                onClick={handleBuyTickets}
                className="w-full h-12 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                チケットを購入 (+5枚)
              </button>
            </div>

            {/* Premium Features */}
            {planData.currentPlan === 'FREE' && (
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="text-white" size={24} />
                  <h3 className="text-white font-bold text-xl">プレミアムプラン</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <p className="text-white text-sm">無制限の添削依頼</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <p className="text-white text-sm">優先サポート</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <p className="text-white text-sm">詳細な分析レポート</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <p className="text-white text-sm">広告なし</p>
                  </div>
                </div>
                
                <button
                  onClick={handleUpgrade}
                  className="w-full h-12 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  アップグレード - ¥980/月
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};