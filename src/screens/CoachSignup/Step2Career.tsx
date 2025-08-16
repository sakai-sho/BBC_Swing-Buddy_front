import React from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { CoachSignupFormData } from '../../types/coach';

interface Step2CareerProps {
  formData: CoachSignupFormData;
  onChange: (field: keyof CoachSignupFormData, value: any) => void;
  errors: Record<string, string>;
}

export const Step2Career: React.FC<Step2CareerProps> = ({ formData, onChange, errors }) => {
  const { t } = useI18n();

  const handleInputChange = (field: keyof CoachSignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' ? 
      (e.target.value ? parseFloat(e.target.value) : 0) : 
      e.target.value;
    onChange(field, value);
  };

  return (
    <div className="space-y-6">
      {/* ゴルフ歴 */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.career.golf_exp')}
        </label>
        <input
          type="number"
          min="0"
          max="90"
          value={formData.golf_exp || ''}
          onChange={handleInputChange('golf_exp')}
          placeholder="10"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
        {errors.golf_exp && (
          <p className="text-red-200 text-sm mt-1">{errors.golf_exp}</p>
        )}
      </div>

      {/* 時給 */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.career.hourly_rate')}
        </label>
        <input
          type="number"
          min="0"
          max="100000"
          step="100"
          value={formData.hourly_rate || ''}
          onChange={handleInputChange('hourly_rate')}
          placeholder="5000"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
        {errors.hourly_rate && (
          <p className="text-red-200 text-sm mt-1">{errors.hourly_rate}</p>
        )}
      </div>

      {/* 認定資格 */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.career.certification')}
        </label>
        <input
          type="text"
          maxLength={100}
          value={formData.certification}
          onChange={handleInputChange('certification')}
          placeholder="PGAプロ、JGRAインストラクター等"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
        {errors.certification && (
          <p className="text-red-200 text-sm mt-1">{errors.certification}</p>
        )}
      </div>

      {/* レッスンランク */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.career.lesson_level')} *
        </label>
        <select
          value={formData.Lesson_rank}
          onChange={handleInputChange('Lesson_rank')}
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white focus:bg-white/20"
          required
        >
          <option value="" className="text-gray-800">選択してください</option>
          <option value="beginner" className="text-gray-800">{t('coach.signup.career.levels.beginner')}</option>
          <option value="intermediate" className="text-gray-800">{t('coach.signup.career.levels.intermediate')}</option>
          <option value="advanced" className="text-gray-800">{t('coach.signup.career.levels.advanced')}</option>
        </select>
        {errors.Lesson_rank && (
          <p className="text-red-200 text-sm mt-1">{errors.Lesson_rank}</p>
        )}
      </div>

      {/* 競技者対応 */}
      <div>
        <label className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20">
          <input
            type="checkbox"
            checked={!!formData.supports_competitive}
            onChange={(e) => onChange('supports_competitive', e.target.checked)}
            className="w-5 h-5 rounded border-2 border-white/50"
          />
          <span className="text-white">{t('coach.signup.career.competitive')}</span>
        </label>
      </div>

      {/* 自己紹介 */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.career.bio')}
        </label>
        <textarea
          maxLength={1000}
          rows={4}
          value={formData.bio}
          onChange={handleInputChange('bio')}
          placeholder="ゴルフ指導への想いや経験、レッスンスタイルなどをご記入ください..."
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20 resize-none"
        />
        <p className="text-white/70 text-sm mt-1">
          {formData.bio.length}/1000文字
        </p>
        {errors.bio && (
          <p className="text-red-200 text-sm mt-1">{errors.bio}</p>
        )}
      </div>
    </div>
  );
};