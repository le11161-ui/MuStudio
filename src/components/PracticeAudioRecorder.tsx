import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  Download,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  Star,
  FileAudio,
} from 'lucide-react';
import { loadUserProfile, saveUserProfile, addDetailedPracticeLog } from '../utils/profileStorage';

interface PracticeAudioRecorderProps {
  currentSongName?: string;
  onSaveToLog?: (durationSeconds: number, rating: number) => void;
}

export const PracticeAudioRecorder: React.FC<PracticeAudioRecorderProps> = ({
  currentSongName = '自主曲目練習',
  onSaveToLog,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [rating, setRating] = useState<number>(4);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setErrorMessage(null);
    setSaveSuccess(false);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('此瀏覽器未開放或不支援麥克風存取權限。');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        // Stop all audio tracks to turn off mic indicator
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      const msg = (err as Error).message || '無法存取麥克風，請檢查瀏覽器設定開放麥克風權限。';
      setErrorMessage(msg);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleTogglePlayback = () => {
    if (!audioUrl) return;

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => setIsPlayingBack(false);
    }

    if (isPlayingBack) {
      audioElementRef.current.pause();
      setIsPlayingBack(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingBack(true);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `MuStudio_${currentSongName}_Take_${dateStr}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSaveTakeToLog = () => {
    const minutes = Math.max(1, Math.round(recordingTime / 60));
    addDetailedPracticeLog({
      minutes,
      category: 'piano',
      condition: rating >= 4 ? 'good' : 'normal',
      rating,
      strengths: ['完成一次完整樂段錄音對照', '自我音準與節奏檢核'],
      needsImprovement: rating < 4 ? ['注意拍點精準度', '手指放鬆'] : ['持續維持手感'],
      practiceItems: [currentSongName],
      notes: `【實戰錄音 Take】時長約 ${recordingTime} 秒，自我評分 ${rating} 顆星。`,
    });

    const profile = loadUserProfile();
    profile.totalXp += 25; // Bonus XP for recording and self-review
    saveUserProfile(profile);

    setSaveSuccess(true);
    if (onSaveToLog) {
      onSaveToLog(recordingTime, rating);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
            isRecording
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>實戰練琴錄音 Take & 自我回放對照</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                +25 XP 獎勵
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              錄下自己剛才彈的《{currentSongName}》，戴上耳機檢視節奏穩定度與音色強弱
            </p>
          </div>
        </div>

        {/* Record / Stop Action Button */}
        <div>
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer transition-all active:scale-95"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>開始錄音 (Take)</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/30 cursor-pointer animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>停止錄音 ({formatSeconds(recordingTime)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Recording Animation State */}
      {isRecording && (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <div>
              <span className="text-xs font-bold text-rose-300 block">正在收音中... 請開始彈奏</span>
              <span className="text-[11px] text-slate-400">專注拍點與觸鍵，完成後按「停止錄音」</span>
            </div>
          </div>
          <div className="font-mono text-lg font-black text-rose-400">
            {formatSeconds(recordingTime)}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
          ⚠️ {errorMessage}（請確認瀏覽器允許取用麥克風）
        </div>
      )}

      {/* Playback & Rating Bar when take is recorded */}
      {audioUrl && !isRecording && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlayback}
                className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center hover:bg-amber-400 transition-colors cursor-pointer shadow-md"
                title={isPlayingBack ? '暫停播放' : '回放聽取本次錄音'}
              >
                {isPlayingBack ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  錄音完成 · 共 {formatSeconds(recordingTime)}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isPlayingBack ? '🎧 正在回放音檔...' : '點擊播放聆聽自己的觸鍵與音色'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startRecording}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="捨棄並重新錄製"
              >
                <RotateCcw className="w-3 h-3" />
                <span>重錄</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="下載此音檔 (.webm)"
              >
                <Download className="w-3 h-3" />
                <span>下載音檔</span>
              </button>
            </div>
          </div>

          {/* Self-Rating Stars */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">本次表現自評：</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="cursor-pointer p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              {!saveSuccess ? (
                <button
                  onClick={handleSaveTakeToLog}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>儲存至今日練琴日誌 (+25 XP)</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>已成功帶入日誌！(+25 XP 已入帳)</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
