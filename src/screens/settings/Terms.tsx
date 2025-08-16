import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';

export type TermsProps = {
  onNavigate: (screen: string) => void;
};

export const TermsScreen: React.FC<TermsProps> = ({ onNavigate }) => {
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
            {t('settings.terms')}
          </h1>
          
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">利用規約</h3>
                <p className="text-white/70 text-sm">最終更新日: 2025年1月1日</p>
              </div>
            </div>
            
            <div className="space-y-6 text-white/90 text-sm leading-relaxed">
              <section>
                <h4 className="text-white font-medium text-base mb-3">第1条（適用）</h4>
                <p>
                  本規約は、SWING BUDDY（以下「当サービス」）の利用に関して、当サービスを提供する運営者（以下「当社」）と利用者との間の権利義務関係を定めることを目的とし、利用者と当社との間の当サービスの利用に関わる一切の関係に適用されます。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第2条（利用登録）</h4>
                <p>
                  当サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第3条（ユーザーIDおよびパスワードの管理）</h4>
                <p>
                  利用者は、自己の責任において、当サービスのユーザーIDおよびパスワードを適切に管理するものとします。利用者は、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第4条（利用料金および支払方法）</h4>
                <p>
                  利用者は、当サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、当社が指定する方法により支払うものとします。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第5条（禁止事項）</h4>
                <p>利用者は、当サービスの利用にあたり、以下の行為をしてはなりません。</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>当社、当サービスの他の利用者、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                  <li>当サービスによって得られた情報を商業的に利用する行為</li>
                  <li>当サービスの運営を妨害するおそれのある行為</li>
                </ul>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第6条（本サービスの提供の停止等）</h4>
                <p>
                  当社は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第7条（保証の否認および免責事項）</h4>
                <p>
                  当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第8条（サービス内容の変更等）</h4>
                <p>
                  当社は、利用者への事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、利用者はこれを承諾するものとします。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第9条（利用規約の変更）</h4>
                <p>
                  当社は以下の場合には、利用者の個別の同意を要せず、本規約を変更することができるものとします。変更後の利用規約は、当社ウェブサイトに掲示された時点から効力を生じるものとします。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第10条（個人情報の取扱い）</h4>
                <p>
                  当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第11条（通知または連絡）</h4>
                <p>
                  利用者と当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、利用者から、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時に利用者へ到達したものとみなします。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第12条（権利義務の譲渡の禁止）</h4>
                <p>
                  利用者は、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
                </p>
              </section>

              <section>
                <h4 className="text-white font-medium text-base mb-3">第13条（準拠法・裁判管轄）</h4>
                <p>
                  本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                </p>
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