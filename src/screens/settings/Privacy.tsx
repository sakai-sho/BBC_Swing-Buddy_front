import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type PrivacyProps = {
  onNavigate: (screen: string) => void;
};

export const PrivacyScreen: React.FC<PrivacyProps> = ({ onNavigate }) => {
  const { t } = useI18n();

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
            {t('settings.privacy')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">プライバシーポリシー</h3>
                <p className="text-white/70 text-sm">最終更新日: 2025年1月1日</p>
              </div>
            </div>
            
            <div className="space-y-6 text-white/90 text-sm leading-relaxed">
              <section>
                <h4 className="text-white font-medium text-base mb-3">1. 個人情報の収集について</h4>
                <p>
                  当社は、SWING BUDDYサービス（以下「本サービス」）の提供にあたり、以下の個人情報を収集いたします：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>氏名、メールアドレス、生年月日</li>
                  <li>ゴルフに関する技術レベル、利き手等の情報</li>
                  <li>アップロードされた動画ファイル</li>
                  <li>サービス利用履歴、ログ情報</li>
                  <li>決済に関する情報（クレジットカード情報等）</li>
                </ul>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">2. 個人情報の利用目的</h4>
                <p>収集した個人情報は、以下の目的で利用いたします：</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>本サービスの提供・運営</li>
                  <li>ゴルフ指導・添削サービスの提供</li>
                  <li>お客様からのお問い合わせへの対応</li>
                  <li>サービス改善のための分析</li>
                  <li>新機能・キャンペーン等のご案内</li>
                  <li>利用規約違反の対応</li>
                </ul>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">3. 個人情報の第三者提供</h4>
                <p>
                  当社は、以下の場合を除き、あらかじめお客様の同意を得ることなく、個人情報を第三者に提供することはありません：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>法令に基づく場合</li>
                  <li>人の生命、身体または財産の保護のために必要がある場合</li>
                  <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                  <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
                </ul>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">4. 個人情報の安全管理</h4>
                <p>
                  当社は、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。具体的には以下の対策を実施しています：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>SSL/TLS暗号化通信の使用</li>
                  <li>アクセス権限の適切な管理</li>
                  <li>定期的なセキュリティ監査の実施</li>
                  <li>従業員への個人情報保護教育</li>
                </ul>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">5. Cookieの使用について</h4>
                <p>
                  本サービスでは、サービスの利便性向上のためCookieを使用しています。Cookieの使用を希望されない場合は、ブラウザの設定でCookieを無効にすることができますが、一部機能が制限される場合があります。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">6. 個人情報の開示・訂正・削除</h4>
                <p>
                  お客様は、当社が保有する個人情報について、開示、訂正、削除を求めることができます。これらのご請求については、本人確認を行った上で、合理的な期間内に対応いたします。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">7. 個人情報の保存期間</h4>
                <p>
                  当社は、個人情報を利用目的の達成に必要な期間のみ保存し、目的達成後は適切に削除または匿名化いたします。ただし、法令により保存が義務付けられている場合はこの限りではありません。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">8. 未成年者の個人情報</h4>
                <p>
                  18歳未満の方が本サービスを利用される場合は、保護者の同意が必要です。未成年者の個人情報については、特に慎重に取り扱います。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">9. プライバシーポリシーの変更</h4>
                <p>
                  当社は、法令の変更やサービス内容の変更等に伴い、本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、本サービス上に掲載した時点から効力を生じるものとします。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">10. お問い合わせ</h4>
                <p>
                  個人情報の取扱いに関するお問い合わせは、以下の連絡先までご連絡ください：
                </p>
                <div className="mt-2 p-3 bg-white/5 rounded-lg">
                  <p>SWING BUDDY サポートチーム</p>
                  <p>メール: privacy@swingbuddy.com</p>
                  <p>受付時間: 平日 9:00-18:00</p>
                </div>
              </section>

              <div className="text-center pt-6 border-t border-white/20">
                <p className="text-white/70 text-xs">
                  以上
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};