import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import { CoachSignupFormData, Location } from '../../types/coach';
import { getLocations } from '../../api/coach';

interface Step4LocationProps {
  formData: CoachSignupFormData;
  onChange: (field: keyof CoachSignupFormData, value: any) => void;
  errors: Record<string, string>;
}

export const Step4Location: React.FC<Step4LocationProps> = ({ formData, onChange, errors }) => {
  const { t } = useI18n();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error('Failed to load locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  const addSupportLocation = () => {
    const newLocations = [...formData.coach_locations, { location_id: '', notes: '' }];
    onChange('coach_locations', newLocations);
  };

  const removeSupportLocation = (index: number) => {
    const newLocations = formData.coach_locations.filter((_, i) => i !== index);
    onChange('coach_locations', newLocations);
  };

  const updateSupportLocation = (index: number, field: 'location_id' | 'notes', value: string) => {
    const newLocations = [...formData.coach_locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    onChange('coach_locations', newLocations);
  };

  const handleMainLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange('location_id', e.target.value);
  };

  const handleOnlineSupportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('online_support', e.target.checked);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 主拠点 */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.location.main_location')} *
        </label>
        <select
          value={formData.location_id}
          onChange={handleMainLocationChange}
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white focus:bg-white/20"
        >
          <option value="" className="text-gray-800">選択してください</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id} className="text-gray-800">
              {location.name} ({location.prefecture})
            </option>
          ))}
        </select>
        {errors.location_id && (
          <p className="text-red-200 text-sm mt-1">{errors.location_id}</p>
        )}
      </div>

      {/* オンラインレッスン対応 */}
      <div>
        <label className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20">
          <input
            type="checkbox"
            checked={formData.online_support}
            onChange={handleOnlineSupportChange}
            className="w-5 h-5 rounded border-2 border-white/50"
          />
          <span className="text-white">{t('coach.signup.location.online_support')}</span>
        </label>
      </div>

      {/* 対応会場 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-white text-base font-medium">
            {t('coach.signup.location.support_locations')}
          </label>
          <button
            onClick={addSupportLocation}
            className="flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <Plus size={16} />
            追加
          </button>
        </div>

        {formData.coach_locations.length === 0 ? (
          <p className="text-white/70 text-sm">対応会場を追加してください（任意）</p>
        ) : (
          <div className="space-y-3">
            {formData.coach_locations.map((location, index) => (
              <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <select
                      value={location.location_id}
                      onChange={(e) => updateSupportLocation(index, 'location_id', e.target.value)}
                      className="w-full bg-white/15 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white focus:bg-white/20"
                    >
                      <option value="" className="text-gray-800">会場を選択</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id} className="text-gray-800">
                          {loc.name} ({loc.prefecture})
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="text"
                      value={location.notes}
                      onChange={(e) => updateSupportLocation(index, 'notes', e.target.value)}
                      placeholder={t('coach.signup.location.notes')}
                      className="w-full bg-white/15 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
                    />
                  </div>
                  
                  <button
                    onClick={() => removeSupportLocation(index)}
                    className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="text-red-400" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};