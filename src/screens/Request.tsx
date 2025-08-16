import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Upload,
  X,
  Settings as SettingsIcon,
  Loader2
} from 'lucide-react';

export type RequestProps = { 
  onNavigate: (screen: string) => void;
};

type UploadFile = {
  id: string;
  file: File;
  url: string;
  size: number;
  name: string;
};

export const RequestScreen: React.FC<RequestProps> = ({ onNavigate }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step] = useState<0 | 1 | 2 | 3>(0); // Request=0, Club=1, Problem=2, Done=3
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB

  const persistForNext = (items: UploadFile[]) => {
    // 次画面で使う軽いメタだけ保存（巨大Fileは保存しない）
    const meta = items.map(i => ({ id: i.id, name: i.name, size: i.size, url: i.url }));
    localStorage.setItem('sb:req:files', JSON.stringify(meta));
  };

  const handlePickedFiles = (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;
    
    const newFiles: UploadFile[] = [];
    const oversizedFiles: string[] = [];

    selectedFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
        return;
      }

      const id = crypto.randomUUID();
      const url = URL.createObjectURL(file);
      
      newFiles.push({
        id,
        file,
        url,
        size: file.size,
        name: file.name
      });
    });

    if (oversizedFiles.length > 0) {
      setErrorMessage(`以下のファイルは300MBを超えているため選択できません: ${oversizedFiles.join(', ')}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } else {
      setErrorMessage('');
    }

    setFiles(prev => {
      const next = [...prev, ...newFiles];
      // 次画面用に軽量メタだけ保存
      const meta = next.map(i => ({ id: i.id, name: i.name, size: i.size, url: i.url }));
      localStorage.setItem('sb:req:files', JSON.stringify(meta));
      return next;
    });
    
    // ★ ここで必ず遷移（state 反映を待たなくてOK）
    console.log('[nav] to request-club');
    onNavigate('request-club');
  };

  const openVideoPicker = async () => {
    // File System Access API が使える場合（Safari 16.4+ / Chrome 86+ など）
    const anyWindow = window as any;
    if (anyWindow.showOpenFilePicker) {
      try {
        console.log('[picker] Using File System Access API');
        const handles = await anyWindow.showOpenFilePicker({
          multiple: true,
          types: [
            {
              description: 'Videos',
              accept: { 'video/*': ['.mp4', '.mov', '.webm', '.m4v'] },
            },
          ],
          excludeAcceptAllOption: true,
        });
        const selectedFiles = await Promise.all(handles.map((h: any) => h.getFile()));
        console.log('[picked]', selectedFiles.length);
        handlePickedFiles(selectedFiles);
        return;
      } catch (err) {
        // ユーザーキャンセル等はフォールバックせず無視
        console.log('File picker cancelled or failed:', err);
      }
    }
    // フォールバック：<input type="file"> を開く
    console.log('[picker] Using fallback input');
    fileInputRef.current?.click();
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;

    setIsSubmitting(true);
    
    // ダミー送信処理
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // クリーンアップ
    files.forEach(file => URL.revokeObjectURL(file.url));
    setFiles([]);
    setIsSubmitting(false);
    
    // アップロード完了メッセージ
    alert('アップロードを受け付けました');
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-100dvh h-100dvh shadow-2xl rounded-[28px] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90 pointer-events-none" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-100dvh h-100dvh pl-safe pr-safe">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 pt-safe pb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pt-4">
            {/* Avatar */}
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <img
                src="https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            
            {/* Search Bar */}
            <div className="flex-1 mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={18} />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-10 pl-10 pr-4 bg-black/35 text-white placeholder-white/70 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
            
            {/* Settings */}
            <button
              onClick={() => onNavigate('settings')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <SettingsIcon className="text-white" size={20} />
            </button>
          </div>

          {/* Title with Blob */}
          <div className="relative mb-12">
            <h1 
              className="text-white font-light leading-none tracking-wide"
              style={{ 
                fontFamily: 'cursive',
                fontSize: 'clamp(28px, 8vw, 44px)'
              }}
            >
              Movie Upload
            </h1>
            
            {/* Purple Blob */}
            <div 
              className="absolute right-0 bottom-[18%] w-[56%] aspect-[1/1.2] bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600 blur-[2px] opacity-80"
              style={{
                borderRadius: '48% 52% 43% 57% / 57% 51% 49% 43%'
              }}
            />
          </div>

          {/* Upload Button */}
          <div className="flex flex-col items-center mb-8">
            <button
              type="button"
              onClick={openVideoPicker}
              aria-label="動画をアップロード"
              className="bg-white rounded-full h-[54px] px-6 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <Upload className="text-purple-600" size={20} />
              <span className="text-purple-600 font-medium">動画をアップロード</span>
            </button>
            
            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-200 text-sm mt-3 text-center px-4">
                {errorMessage}
              </p>
            )}
          </div>

          {/* 非表示の動画ファイル入力（フォールバック用） */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,.mp4,.mov,.webm"
            multiple
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files ?? []);
              console.log('[picked]', selectedFiles.length);
              handlePickedFiles(selectedFiles);
              // 同じファイルを連続選択できるようにリセット
              e.currentTarget.value = '';
            }}
            className="hidden"
          />

          {/* File Queue */}
          {files.length > 0 && (
            <div className="space-y-3 mb-8">
              <h3 className="text-white text-lg font-medium mb-4">選択された動画</h3>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="rounded-2xl bg-white/10 border border-white/15 p-3 flex items-center gap-3"
                >
                  {/* Video Preview */}
                  <video
                    src={file.url}
                    muted
                    playsInline
                    className="w-16 h-10 object-cover rounded-lg bg-black/20"
                  />
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-white/70 text-xs">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(file.id)}
                    aria-label={`${file.name}を削除`}
                    className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                  >
                    <X className="text-red-400" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Page Indicators */}
          <div className="flex justify-center gap-3 mb-8 mt-8">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  index === step 
                    ? 'bg-purple-400 opacity-100 scale-110' 
                    : 'bg-white opacity-40'
                }`}
              />
            ))}
          </div>
        </main>

        {/* Tab Bar */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-sm border-t border-white/10 rounded-t-3xl">
          <div className="flex justify-around py-3 pb-safe">
            <button
              onClick={() => onNavigate('home')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs">ホーム</span>
            </button>
            <button
              onClick={() => onNavigate('request')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <span className="text-xs font-medium">添削依頼</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              <span className="text-xs">マイページ</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="flex flex-col items-center space-y-1 px-4 py-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
              </svg>
              <span className="text-xs">設定</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};