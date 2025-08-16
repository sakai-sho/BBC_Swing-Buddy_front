import React from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { CoachSignupFormData } from '../../types/coach';

interface Step1BasicProps {
  formData: CoachSignupFormData;
  onChange: (field: keyof CoachSignupFormData, value: any) => void;
  errors: Record<string, string>;
}

export const Step1Basic: React.FC<Step1BasicProps> = ({ formData, onChange, errors }) => {
  const { t } = useI18n();

  const handleInputChange = (field: keyof CoachSignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(field, e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* 氏名（漢字） */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.basic.name_kanji')} *
        </label>
        <input
          type="text"
          value={formData.coachname}
          onChange={handleInputChange('coachname')}
          placeholder="山田太郎"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
        {errors.coachname && (
          <p className="text-red-200 text-sm mt-1">{errors.coachname}</p>
        )}
      </div>

      {/* 氏名（フリガナ） */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.basic.name_kana')} *
        </label>
        <input
          type="text"
          value={formData.coachname_kana}
          onChange={handleInputChange('coachname_kana')}
          placeholder="ヤマダタロウ"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
        {errors.coachname_kana && (
          <p className="text-red-200 text-sm mt-1">{errors.coachname_kana}</p>
        )}
      </div>

      {/* メールアドレス */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.basic.email')} *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          placeholder="coach@example.com"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
        {errors.email && (
          <p className="text-red-200 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* 電話番号 */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.basic.phone')}
        </label>
        <input
          type="tel"
          value={formData.phone_number}
          onChange={handleInputChange('phone_number')}
          placeholder="090-1234-5678"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
        {errors.phone_number && (
          <p className="text-red-200 text-sm mt-1">{errors.phone_number}</p>
        )}
      </div>

      {/* 生年月日 */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.basic.birthday')}
        </label>
        <input
          type="date"
          value={formData.birthday}
          onChange={handleInputChange('birthday')}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white focus:bg-white/20"
        />
        {errors.birthday && (
          <p className="text-red-200 text-sm mt-1">{errors.birthday}</p>
        )}
      </div>

      {/* 性別 */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.basic.sex')}
        </label>
        <select
          value={formData.Sex}
          onChange={handleInputChange('Sex')}
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white focus:bg-white/20"
        >
          <option value="" className="text-gray-800">選択してください</option>
          <option value="male" className="text-gray-800">{t('coach.signup.basic.male')}</option>
          <option value="female" className="text-gray-800">{t('coach.signup.basic.female')}</option>
          <option value="other" className="text-gray-800">{t('coach.signup.basic.other')}</option>
        </select>
      </div>

      {/* LINE ID */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.basic.line_id')}
        </label>
        <input
          type="text"
          value={formData.line_user_id}
          onChange={handleInputChange('line_user_id')}
          placeholder="@your_line_id"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
      </div>
    </div>
  );
};