import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, Mail, MessageCircle } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type HelpProps = {
  onNavigate: (screen: string) => void;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export const HelpScreen: React.FC<HelpProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });

  const faqs: FAQ[] = [
    {
      id: '1',
      question: '動画のアップロードができません',
      answer: 'Wi-Fi接続を確認し、動画ファイルサイズが制限内（300MB以下）であることを確認してください。また、アプリの権限設定でカメラとストレージへのアクセスが許可されているか確認してください。'
    },
    {
      id: '2',
      question: 'コーチからの返信が来ません',
      answer: '通常、添削結果は24-48時間以内にお届けします。通知設定がオンになっているか確認し、迷惑メールフォルダもご確認ください。3日以上経過しても返信がない場合は、お問い合わせください。'
    },
    {
      id: '3',
      question: 'チケットの使い方がわかりません',
      answer: 'チケットは動画の添削依頼時に自動で消費されます。1つの動画につき1枚のチケットが必要です。チケットが不足している場合は、プラン画面から追加購入できます。'
    },
    {
      id: '4',
      question: 'プレミアムプランの特典は何ですか？',
      answer: 'プレミアムプランでは、無制限の添削依頼、優先サポート、詳細な分析レポート、広告なしの体験をご利用いただけます。また、新機能への早期アクセスも含まれます。'
    },
    {
      id: '5',
      question: 'アカウントを削除したい',
      answer: 'アカウント削除をご希望の場合は、お問い合わせフォームからご連絡ください。削除処理には最大7営業日かかります。削除後はデータの復旧はできませんのでご注意ください。'
    }
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContact = () => {
    // Simulate sending contact form
    if (contactForm.subject && contactForm.message) {
      alert('お問い合わせを送信しました。24時間以内にご返信いたします。');
      setContactForm({ subject: '', message: '' });
    }
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
            {t('settings.help')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-6">
            {/* FAQ Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <HelpCircle className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">よくある質問</h3>
                  <p className="text-white/70 text-sm">お困りの際はこちらをご確認ください</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      <ChevronDown 
                        size={20} 
                        className={`text-white/70 transition-transform ${
                          expandedFAQ === faq.id ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="text-white/80 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <MessageCircle className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">お問い合わせ</h3>
                  <p className="text-white/70 text-sm">解決しない場合はこちらからご連絡ください</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    件名
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="お問い合わせの件名を入力してください"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  />
                </div>
                
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    お問い合わせ内容
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="詳細な内容をご記入ください"
                    rows={4}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
                  />
                </div>
                
                <button
                  onClick={handleContact}
                  disabled={!contactForm.subject || !contactForm.message}
                  className="w-full h-12 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  送信
                </button>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">直接連絡</h3>
                  <p className="text-white/70 text-sm">緊急の場合はこちらからご連絡ください</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <a
                  href="mailto:support@swingbuddy.com"
                  className="block w-full p-3 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <div className="font-medium">メールサポート</div>
                  <div className="text-sm text-white/70">support@swingbuddy.com</div>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};