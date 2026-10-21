import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Headphones, Sparkles, X, Check } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface AmbientSoundPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export type AmbientTrackType = 'rain' | 'vinyl' | 'fireplace' | 'cafe' | 'river';

interface AmbientOption {
  id: AmbientTrackType;
  label: string;
  icon: string;
  badge: string;
  desc: string;
  samplePath: string;
}

const AMBIENT_TRACKS: AmbientOption[] = [
  {
    id: 'rain',
    label: '窗外真實雨滴',
    icon: '🌧️',
    badge: '雨滴拍窗原聲',
    desc: '真實錄製雨滴細緻拍打在窗玻璃上的自然原聲，伴隨深沉雨幕，心靈瞬間沉靜。',
    samplePath: '/ambient/rain.mp3',
  },
  {
    id: 'fireplace',
    label: '溫暖壁爐柴火',
    icon: '🔥',
    badge: '柴木劈啪爆裂',
    desc: '真實錄製乾柴燃燒的木質爆裂聲與低頻火光共振，帶來極度放鬆與舒適包覆感。',
    samplePath: '/ambient/fireplace.mp3',
  },
  {
    id: 'vinyl',
    label: '復古黑膠唱針',
    icon: '📻',
    badge: '類比黑膠底噪',
    desc: '真實唱臂針尖滑過黑膠唱盤刻痕的類比微爆音與溫暖底噪，Lo-Fi 練琴必備。',
    samplePath: '/ambient/vinyl.mp3',
  },
  {
    id: 'cafe',
    label: '爵士午後咖啡館',
    icon: '☕',
    badge: '空間放鬆混響',
    desc: '真實收音午後溫馨咖啡廳的微弱杯盤輕觸與柔和空間氛圍，彷彿置身巴黎街角。',
    samplePath: '/ambient/cafe.mp3',
  },
  {
    id: 'river',
    label: '森林潺潺溪流',
    icon: '🏞️',
    badge: '清澈流水原聲',
    desc: '山林間天然溪水潺潺流動的真實自然水聲，洗滌思緒雜念，練琴專注力倍增。',
    samplePath: '/ambient/river.mp3',
  },
];

export const AmbientSoundPlayer: React.FC<AmbientSoundPlayerProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(!!audioEngine.activeAmbientType);
  const [currentTrack, setCurrentTrack] = useState<AmbientTrackType>(
    (audioEngine.activeAmbientType as AmbientTrackType) || 'rain'
  );
  const [volume, setVolume] = useState<number>(0.55);

  useEffect(() => {
    // Sync with global audio state
    if (audioEngine.activeAmbientType) {
      setIsPlaying(true);
      setCurrentTrack(audioEngine.activeAmbientType as AmbientTrackType);
    }

    const unbind = (active: AmbientTrackType | null) => {
      if (active) {
        setIsPlaying(true);
        setCurrentTrack(active);
      } else {
        setIsPlaying(false);
      }
    };

    audioEngine.onAmbientChange = unbind as any;
    return () => {
      audioEngine.onAmbientChange = undefined;
    };
  }, [isOpen]);

  const togglePlay = () => {
    if (isPlaying) {
      audioEngine.stopAmbient();
      setIsPlaying(false);
    } else {
      audioEngine.playAmbient(currentTrack, volume);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (trackId: AmbientTrackType) => {
    if (isPlaying && currentTrack === trackId) {
      // Toggle off if clicking the active playing track
      audioEngine.stopAmbient();
      setIsPlaying(false);
    } else {
      // Switch track and start playing immediately
      setCurrentTrack(trackId);
      audioEngine.playAmbient(trackId, volume);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setAmbientVolume(newVol);
    if (!isPlaying && newVol > 0) {
      audioEngine.playAmbient(currentTrack, newVol);
      setIsPlaying(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  練琴專注真實自然音景
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  真實自然原聲錄音
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                已升級為真實無損自然收音（非人工雜音），後台持續伴隨練琴
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Selection Cards */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AMBIENT_TRACKS.map((track) => {
              const active = currentTrack === track.id;
              const trackPlaying = active && isPlaying;
              return (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 group relative overflow-hidden ${
                    trackPlaying
                      ? 'bg-gradient-to-br from-teal-950/60 to-slate-900 border-teal-400 shadow-lg shadow-teal-950/50 ring-2 ring-teal-500/30'
                      : active
                      ? 'bg-slate-900 border-teal-500/40 text-slate-200'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{track.icon}</span>
                      <div>
                        <span className={`text-xs font-bold block ${trackPlaying ? 'text-teal-300' : 'text-slate-200'}`}>
                          {track.label}
                        </span>
                        <span className="text-[10px] text-teal-400 font-mono">
                          {track.badge}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {trackPlaying ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-mono font-bold">
                          <span className="flex gap-0.5 items-end h-3">
                            <span className="w-0.5 bg-teal-300 rounded-full animate-bounce [animation-delay:0ms] h-2.5"></span>
                            <span className="w-0.5 bg-teal-300 rounded-full animate-bounce [animation-delay:150ms] h-3"></span>
                            <span className="w-0.5 bg-teal-300 rounded-full animate-bounce [animation-delay:300ms] h-1.5"></span>
                          </span>
                          <span>播放中</span>
                        </div>
                      ) : (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          點擊播放
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {track.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Master Player Controller */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={togglePlay}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md ${
                    isPlaying
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 text-slate-950 hover:brightness-110 shadow-teal-500/25'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>暫停氛圍聲景</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>播放 {AMBIENT_TRACKS.find((t) => t.id === currentTrack)?.label}</span>
                    </>
                  )}
                </button>

                {isPlaying && (
                  <span className="text-[11px] text-teal-400 font-mono hidden sm:inline-flex items-center gap-1 bg-teal-500/10 px-2 py-1 rounded-md border border-teal-500/30">
                    <Check className="w-3 h-3" />
                    正在放鬆伴奏
                  </span>
                )}
              </div>

              {/* Volume Slider & Presets */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto sm:min-w-[240px]">
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <Volume2 className="w-4 h-4 text-teal-400 shrink-0" />
                )}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  title="音量調節"
                />
                <span className="text-xs font-mono text-slate-300 shrink-0 w-9 text-right font-semibold">
                  {Math.round(volume * 100)}%
                </span>
                <div className="flex gap-1 shrink-0">
                  {[0.3, 0.6, 1.0].map((v) => (
                    <button
                      key={v}
                      onClick={() => handleVolumeChange(v)}
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        Math.abs(volume - v) < 0.05
                          ? 'bg-teal-500/30 text-teal-300 border border-teal-500/50'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {Math.round(v * 100)}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-5 sm:py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>🎧 可在後台持續播放，切換五度圈、和弦庫或練琴日誌皆不中斷</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer text-xs"
          >
            收合
          </button>
        </div>
      </div>
    </div>
  );
};
