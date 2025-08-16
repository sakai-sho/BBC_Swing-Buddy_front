import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SignupFrame } from '../../components/SignupFrame';
import { useI18n } from '../../i18n/I18nProvider';

interface CoachSignupLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
}

export const CoachSignupLayout: React.FC<CoachSignupLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canProceed,
  isLastStep,
  isSubmitting = false
}) => {
  const { t } = useI18n();

  const stepTitles = [
    t('coach.signup.step1'),
    t('coach.signup.step2'),
    t('coach.signup.step3'),
    t('coach.signup.step4')
  ];

  return (
    <SignupFrame>
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-7 pt-safe pb-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="h1-script text-white leading-none tracking-wide mb-3">
            {t('coach.signup.title')}
          </h1>
          <p className="body-sm text-white/90">
            {stepTitles[currentStep]} ({currentStep + 1}/{totalSteps})
          </p>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {children}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                index === currentStep 
                  ? 'bg-white opacity-100 scale-110' 
                  : index < currentStep
                  ? 'bg-white opacity-70'
                  : 'bg-white opacity-40'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Sticky Footer */}
      <div className="sticky-footer px-7">
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
            {t('settings.back')}
          </button>
          
          <button
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 h-[56px] rounded-full font-medium transition-all duration-200 ${
              canProceed && !isSubmitting
                ? 'bg-white text-purple-600 shadow-sm hover:shadow-md active:translate-y-[1px]'
                : 'bg-white text-purple-600 opacity-60 pointer-events-none'
            }`}
          >
            {isSubmitting ? (
              t('coach.signup.submitting')
            ) : isLastStep ? (
              t('coach.signup.submit')
            ) : (
              <>
                次へ
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </SignupFrame>
  );
};