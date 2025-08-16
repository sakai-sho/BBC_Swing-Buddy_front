import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import { CoachSignupFormData } from '../../types/coach';
import { uploadImage } from '../../api/coach';

interface Step3SocialProps {
  formData: CoachSignupFormData;
  onChange: (field: keyof CoachSignupFormData, value: any) => void;
  errors: Record<string, string>;
}

export const Step3Social: React.FC<Step3SocialProps> = ({ formData, onChange, errors }) => {
  const { t } = useI18n();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof CoachSignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(field, e.target.value);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('JPG、PNG、WebP形式のファイルのみアップロード可能です');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onChange('profile_picture', file);
      onChange('profile_picture_url', result.url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'アップロードに失敗しました');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageRemove = () => {
    onChange('profile_picture', undefined);
    onChange('profile_picture_url', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* プロフィール画像 */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.social.profile_picture')}
        </label>
        
        {formData.profile_picture_url ? (
          <div className="relative">
            <img
              src={formData.profile_picture_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white/20"
            />
            <button
              onClick={handleImageRemove}
              className="absolute top-0 right-1/2 translate-x-16 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-32 h-32 mx-auto bg-white/15 border-2 border-dashed border-white/30 rounded-full flex flex-col items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                  <span className="text-white text-sm">{uploadProgress}%</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-white mb-2" />
                  <span className="text-white text-sm">画像を選択</span>
                </>
              )}
            </button>
            <p className="text-white/70 text-xs mt-2">
              JPG, PNG, WebP (最大5MB)
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
          className="hidden"
        />
        
        {errors.profile_picture && (
          <p className="text-red-200 text-sm mt-1">{errors.profile_picture}</p>
        )}
      </div>

      {/* Instagram */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.social.instagram')}
        </label>
        <input
          type="url"
          value={formData.SNS_handle_instagram}
          onChange={handleInputChange('SNS_handle_instagram')}
          placeholder="https://instagram.com/your_handle"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
      </div>

      {/* X (Twitter) */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.social.twitter')}
        </label>
        <input
          type="url"
          value={formData.SNS_handle_X}
          onChange={handleInputChange('SNS_handle_X')}
          placeholder="https://x.com/your_handle"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
      </div>

      {/* YouTube */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.social.youtube')}
        </label>
        <input
          type="url"
          value={formData.SNS_handle_youtube}
          onChange={handleInputChange('SNS_handle_youtube')}
          placeholder="https://youtube.com/@your_channel"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
      </div>

      {/* Facebook */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.social.facebook')}
        </label>
        <input
          type="url"
          value={formData.SNS_handle_facebook}
          onChange={handleInputChange('SNS_handle_facebook')}
          placeholder="https://facebook.com/your_profile"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
      </div>

      {/* TikTok */}
      <div>
        <label className="block text-white text-base font-medium mb-3">
          {t('coach.signup.social.tiktok')}
        </label>
        <input
          type="url"
          value={formData.SNS_handle_tiktok}
          onChange={handleInputChange('SNS_handle_tiktok')}
          placeholder="https://tiktok.com/@your_handle"
          className="w-full bg-white/15 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
        />
      </div>
    </div>
  );
};