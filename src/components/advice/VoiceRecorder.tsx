'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Mic, StopCircle, Trash2, Play, Pause } from 'lucide-react';

type Props = {
  value: string | null; // 既存の音声（URL）
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
  iconSize?: number;
};

const VoiceRecorder: React.FC<Props> = ({ value, onChange, label, className = "", iconSize = 20 }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(value ?? null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunks = useRef<Blob[]>([]);

  // 親コンポーネントから渡される `value` が変更されたときに `audioUrl` ステートを更新
  useEffect(() => {
    setAudioUrl(value ?? null);
  }, [value]);

  /**
   * 録音を開始する関数
   * ユーザーのマイクへのアクセス許可を要求し、MediaRecorderを設定します。
   */
  const start = async () => {
    try {
      // ユーザーのマイクストリームを取得
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);

      // 録音データを格納する配列を初期化
      chunks.current = [];

      // データが利用可能になったときのイベントハンドラ
      mr.ondataavailable = (e) => e.data.size > 0 && chunks.current.push(e.data);

      // 録音が停止したときのイベントハンドラ
      mr.onstop = () => {
        // 録音されたBlobデータからURLを生成
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url); // ステートを更新
        onChange(url);     // 親コンポーネントにURLを通知
      };

      mr.start();         // 録音開始
      setMediaRecorder(mr); // MediaRecorderインスタンスをステートに保存
      setRecording(true); // 録音中状態に設定
    } catch (e) {
      // マイクアクセス失敗時のエラーハンドリング
      // `alert` は使用できないため、代わりにコンソール出力とカスタムメッセージで対応
      console.error('マイクが使用できませんでした。ブラウザ権限を確認してください。', e);
      // ユーザーへのフィードバックのためのメッセージ表示ロジックをここに実装する
      // 例: setErrorMessage('マイクが使用できませんでした。ブラウザ権限を確認してください。');
    }
  };

  /**
   * 録音を停止する関数
   * MediaRecorderを停止し、マイクストリームを終了します。
   */
  const stop = () => {
    mediaRecorder?.stop();                               // 録音を停止
    mediaRecorder?.stream.getTracks().forEach(t => t.stop()); // マイクストリームを終了
    setMediaRecorder(null);                              // MediaRecorderをクリア
    setRecording(false);                                 // 録音中状態を解除
  };

  /**
   * 録音された音声を削除する関数
   * オブジェクトURLを解放し、音声URLをクリアします。
   */
  const remove = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl); // 既存のURLを解放してメモリリークを防ぐ
    setAudioUrl(null);                           // 音声URLをクリア
    onChange(null);                              // 親コンポーネントにnullを通知
  };

  /**
   * 音声の再生/一時停止を切り替える関数
   */
  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return; // audio要素が存在しない場合は何もしない

    if (a.paused) {
      a.play();      // 再生
      setPlaying(true); // 再生中状態に設定
    } else {
      a.pause();     // 一時停止
      setPlaying(false); // 再生中状態を解除
    }
  };

  return (
    <div className={`rounded-xl border border-white/20 p-3 bg-black/20 text-white ${className}`}>
      {label && <div className="text-sm mb-2 text-white/80">{label}</div>}
      {!audioUrl ? ( // 音声が録音されていない場合
        <div className="flex items-center gap-3">
          {!recording ? ( // 録音中でない場合
            <button
              onClick={start}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 flex items-center gap-2 text-xs"
            >
              <Mic size={iconSize} />
              録音開始
            </button>
          ) : ( // 録音中の場合
            <button
              onClick={stop}
              className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2"
            >
              <StopCircle size={iconSize} />
              停止
            </button>
          )}
          <span className="text-sm text-white/70">
            {recording ? '録音中…' : '音声でコメントを残せます（任意）'}
          </span>
        </div>
      ) : ( // 音声が録音されている場合
        <div className="flex items-center gap-3">
          {/* audio要素はUIには表示されないが、音声再生のために必要 */}
          <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} />
          <button
            onClick={togglePlay}
            className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 flex items-center gap-2"
          >
            {playing ? <Pause size={iconSize - 2} /> : <Play size={iconSize - 2} />}
            {playing ? '一時停止' : '再生'}
          </button>
          <button
            onClick={remove}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-2"
          >
            <Trash2 size={iconSize} />
            削除
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
