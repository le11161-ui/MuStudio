import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Play,
  Square,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Target,
  Music,
  Zap,
  BookOpen,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Check,
  Trash2,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SongPracticeGuide, PRESET_SONG_GUIDES } from '../data/songDatabase';
import { audioEngine } from '../utils/audioEngine';
import {
  loadRepertoire,
  addOrUpdateRepertoireItem,
  updateRepertoireStatus,
  deleteRepertoireItem,
  RepertoireItem,
} from '../utils/repertoireStorage';
import { PracticeAudioRecorder } from './PracticeAudioRecorder';

interface SongPracticeStrategizerProps {
  onNavigateToTab: (tab: string) => void;
  onAskCoachWithPrompt: (prompt: string) => void;
  onSetTodayGoal?: (goal: string) => void;
  initialSongName?: string;
}

const WHITE_KEYS = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
const BLACK_KEYS: { note: string; leftPercent: number }[] = [
  { note: 'C#4', leftPercent: 4.8 },
  { note: 'D#4', leftPercent: 11.5 },
  { note: 'F#4', leftPercent: 25 },
  { note: 'G#4', leftPercent: 31.8 },
  { note: 'A#4', leftPercent: 38.5 },
  { note: 'C#5', leftPercent: 51.8 },
  { note: 'D#5', leftPercent: 58.5 },
  { note: 'F#5', leftPercent: 72 },
  { note: 'G#5', leftPercent: 78.8 },
  { note: 'A#5', leftPercent: 85.5 },
];

export const SongPracticeStrategizer: React.FC<SongPracticeStrategizerProps> = ({
  onNavigateToTab,
  onAskCoachWithPrompt,
  onSetTodayGoal,
  initialSongName,
}) => {
  const [searchInput, setSearchInput] = useState<string>(initialSongName || '晴天');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('流行鋼琴');
  const [selectedLevel, setSelectedLevel] = useState<string>('有基礎');
  const [guide, setGuide] = useState<SongPracticeGuide>(() => {
    if (initialSongName && PRESET_SONG_GUIDES[initialSongName.trim()]) {
      return PRESET_SONG_GUIDES[initialSongName.trim()];
    }
    return PRESET_SONG_GUIDES['晴天'];
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [goalSetMessage, setGoalSetMessage] = useState<string | null>(null);

  // Audio Preview Playback State (先聽聽看這個曲目)
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [currentPlayingNoteIndex, setCurrentPlayingNoteIndex] = useState<number | null>(null);
  const [activeInteractiveKey, setActiveInteractiveKey] = useState<string | null>(null);
  const [showPianoKeyboard, setShowPianoKeyboard] = useState<boolean>(true);
  const previewTimerRefs = useRef<number[]>([]);

  // Repertoire Management State
  const [repertoire, setRepertoire] = useState<RepertoireItem[]>(() => loadRepertoire());
  const [showRepertoireSection, setShowRepertoireSection] = useState<boolean>(true);
  const [showAddToRepertoireModal, setShowAddToRepertoireModal] = useState<boolean>(false);
  const [repStatusInput, setRepStatusInput] = useState<'practicing' | 'mastered' | 'wishlist'>('practicing');
  const [repSpeedInput, setRepSpeedInput] = useState<number>(60);
  const [repNotesInput, setRepNotesInput] = useState<string>('');
  const [repertoireAlert, setRepertoireAlert] = useState<string | null>(null);

  const stopPreview = () => {
    previewTimerRefs.current.forEach((id) => clearTimeout(id));
    previewTimerRefs.current = [];
    setIsPlayingPreview(false);
    setCurrentPlayingNoteIndex(null);
  };

  const handlePlayPreview = () => {
    if (isPlayingPreview) {
      stopPreview();
      return;
    }

    setIsPlayingPreview(true);

    if (guide.previewMelody && guide.previewMelody.length > 0) {
      let accumulatedTime = 0;
      guide.previewMelody.forEach((item, idx) => {
        const timerId = window.setTimeout(() => {
          setCurrentPlayingNoteIndex(idx);
          const freq = audioEngine.noteToFreq(item.note);
          if (freq > 0) {
            audioEngine.playPianoNote(freq, item.duration * 0.95);
          }
        }, accumulatedTime * 1000);
        previewTimerRefs.current.push(timerId);
        accumulatedTime += item.duration;
      });

      const finishTimerId = window.setTimeout(() => {
        setIsPlayingPreview(false);
        setCurrentPlayingNoteIndex(null);
      }, accumulatedTime * 1000 + 300);
      previewTimerRefs.current.push(finishTimerId);
    } else {
      // Harmonic chord progression arpeggio preview for any custom piece
      const chordsToPlay = guide.chords && guide.chords.length > 0 ? guide.chords : ['C', 'G', 'Am', 'F'];
      let accumulatedTime = 0;
      chordsToPlay.forEach((ch, chIdx) => {
        const timerId = window.setTimeout(() => {
          setCurrentPlayingNoteIndex(chIdx);
          const rootNote = ch.replace(/m|maj|dim|7|sus4/g, '');
          const baseFreq = audioEngine.noteToFreq(`${rootNote}3`) || 261.63;
          const isMinor = ch.includes('m') && !ch.includes('maj');
          const thirdFreq = baseFreq * (isMinor ? Math.pow(2, 3 / 12) : Math.pow(2, 4 / 12));
          const fifthFreq = baseFreq * Math.pow(2, 7 / 12);
          const octaveFreq = baseFreq * 2;

          audioEngine.playPianoNote(baseFreq, 1.2, 0);
          audioEngine.playPianoNote(thirdFreq, 1.1, 0.15);
          audioEngine.playPianoNote(fifthFreq, 1.0, 0.3);
          audioEngine.playPianoNote(octaveFreq, 0.9, 0.45);
        }, accumulatedTime * 1000);
        previewTimerRefs.current.push(timerId);
        accumulatedTime += 1.0;
      });

      const finishTimerId = window.setTimeout(() => {
        setIsPlayingPreview(false);
        setCurrentPlayingNoteIndex(null);
      }, accumulatedTime * 1000 + 300);
      previewTimerRefs.current.push(finishTimerId);
    }
  };

  const handleKeyClick = (note: string) => {
    setActiveInteractiveKey(note);
    const freq = audioEngine.noteToFreq(note);
    if (freq > 0) {
      audioEngine.playPianoNote(freq, 0.8);
    }
    setTimeout(() => {
      setActiveInteractiveKey(null);
    }, 400);
  };

  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, []);

  // Update guide if initialSongName prop changes
  useEffect(() => {
    if (initialSongName && initialSongName.trim() !== guide.songName) {
      setSearchInput(initialSongName);
      if (PRESET_SONG_GUIDES[initialSongName.trim()]) {
        setGuide(PRESET_SONG_GUIDES[initialSongName.trim()]);
      } else {
        handleSearchSong(initialSongName);
      }
    }
  }, [initialSongName]);

  const handleSearchSong = async (targetSong: string) => {
    stopPreview();
    const cleanQuery = targetSong.trim();
    if (!cleanQuery) return;

    if (PRESET_SONG_GUIDES[cleanQuery]) {
      setGuide(PRESET_SONG_GUIDES[cleanQuery]);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      setGuide({
        id: `custom-${Date.now()}`,
        songName: cleanQuery,
        artist: '自訂查詢曲目',
        instrument: selectedInstrument,
        bpm: 78,
        key: 'C 大調',
        timeSignature: '4/4',
        overview: `針對《${cleanQuery}》專屬客製化的高效 4 階段練習攻略：結合核心音型拆解、換和弦盲點防堵與原速速度梯度推進。`,
        chords: ['C', 'G/B', 'Am', 'F', 'Em', 'Dm', 'G7'],
        stages: [
          {
            phase: '第 1 階段',
            phaseTitle: '核心骨架：雙手慢速分手與和弦單音輪廓',
            timeAllocation: '前 20% 練習時間',
            focus: '只練副歌與前奏骨架，左手單指根音、右手單音旋律。',
            steps: [
              '先用 55 BPM 極慢速單手彈奏右手主旋律，大聲唱出唱名。',
              '左手只彈小節第一拍的根音（如 C - B - A - F），不要急著加任何伴奏。',
              '每彈 2 小節停下檢查手指是否有壓迫僵硬感。'
            ],
            suggestedSpeed: '55 BPM'
          },
          {
            phase: '第 2 階段',
            phaseTitle: '大魔王段落專項：難點小節循環爆破',
            timeAllocation: '中 40% 練習時間',
            focus: '針對全曲換和弦最易拖拍的小節進行孤立循環。',
            steps: [
              '抽離出副歌進場最卡的小節，只在這 2 個和弦之間反覆切換。',
              '前一小節第 4 拍後半拍眼睛就要提前看向下一個位置，手指放鬆。',
              '利用「變速練習法」：一次慢速、一次常速，打破肌肉僵死慣性。'
            ],
            suggestedSpeed: '65 BPM'
          },
          {
            phase: '第 3 階段',
            phaseTitle: '聲部合體：垂直對位與音量平衡',
            timeAllocation: '後 25% 練習時間',
            focus: '主旋律音量突出 70%，伴奏聲部退居 30%。',
            steps: [
              '伴奏加入抒情分解音型，踏板在每小節落鍵瞬間換踩。',
              '閉眼盲彈伴奏，嘴巴哼唱旋律，確保大腦不必同時視覺監控兩隻手。'
            ],
            suggestedSpeed: '72 BPM'
          },
          {
            phase: '第 4 階段',
            phaseTitle: '原速演繹與情感呼吸',
            timeAllocation: '最後 15% 練習時間',
            focus: '恢復原曲速度，融入樂句呼吸與強弱起伏。',
            steps: [
              '恢復原速完整彈奏全曲。',
              '在樂句結尾給予極其自然的呼吸微停頓。'
            ],
            suggestedSpeed: '78 BPM (原速)'
          }
        ],
        bottlenecks: [
          {
            spot: '換和弦時容易提前停頓半拍',
            issue: '手掌完全離開琴鍵去摸下一個和弦，造成節奏中斷。',
            solution: '找出共同音當作錨點，哪怕慢半拍也不許拖拍，左手優先落下！'
          },
          {
            spot: '雙手合奏時右手被左手節奏拖走',
            issue: '四肢獨立性尚未完全脫鉤。',
            solution: '先以 50 BPM 極慢速度像慢動作鏡頭一樣觀察雙手音符垂直交會點。'
          }
        ],
        coachSecretTip: `練好《${targetSong}》的關鍵是「不要從頭到尾一遍一遍刷」，而是把 80% 的精力集中在那 20% 最難的轉折小節！`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetAsGoal = () => {
    const goalStr = `高效練好《${guide.songName}》：攻克第 2 階段大魔王小節與 1-5-8 分解`;
    if (onSetTodayGoal) {
      onSetTodayGoal(goalStr);
    }
    setGoalSetMessage(`已將《${guide.songName}》設定為個人今日核心練習目標！`);
    setTimeout(() => setGoalSetMessage(null), 3000);
  };

  const handleSaveToRepertoire = () => {
    const updated = addOrUpdateRepertoireItem({
      songName: guide.songName,
      artist: guide.artist,
      instrument: guide.instrument,
      status: repStatusInput,
      currentSpeedBpm: repSpeedInput,
      targetBpm: guide.bpm,
      totalPractices: 1,
      lastPracticedDate: new Date().toISOString().split('T')[0],
      notes: repNotesInput || `目標原速 ${guide.bpm} BPM，加強攻克瓶頸段落`,
    });
    setRepertoire(updated);
    setShowAddToRepertoireModal(false);
    setRepertoireAlert(`已將《${guide.songName}》加入我的曲目庫！`);
    setTimeout(() => setRepertoireAlert(null), 3000);
  };

  // Currently playing active note from melody preview
  const currentPreviewNoteName =
    isPlayingPreview &&
    guide.previewMelody &&
    currentPlayingNoteIndex !== null &&
    guide.previewMelody[currentPlayingNoteIndex]
      ? guide.previewMelody[currentPlayingNoteIndex].note
      : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">曲目練習攻略庫</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
              全曲目高效步驟拆解 · 試聽與導奏琴鍵
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            輸入任何你想練的曲子，AI 教練即刻規劃出「4 階段最高效練習步驟」、互動導奏琴鍵與大魔王避坑解方。
          </p>
        </div>

        <button
          onClick={() => setShowRepertoireSection(!showRepertoireSection)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>我的曲目庫 ({repertoire.length})</span>
          {showRepertoireSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* REPERTOIRE DRAWER (我的攻克曲目清單) */}
      {showRepertoireSection && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">我的目標練琴清單 (My Practice Repertoire)</h3>
              <span className="text-[11px] text-slate-400">追蹤正在攻克與已完全掌握的曲目</span>
            </div>

            <span className="text-xs text-amber-400 font-mono">
              已掌握 {repertoire.filter((r) => r.status === 'mastered').length} 首 · 正在攻克{' '}
              {repertoire.filter((r) => r.status === 'practicing').length} 首
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {repertoire.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">《{item.songName}》</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.status === 'mastered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'practicing'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {item.status === 'mastered' ? '🏆 已攻克' : item.status === 'practicing' ? '🔥 攻克中' : '✨ 待挑戰'}
                    </span>
                  </div>

                  <div className="text-slate-400 text-[11px] flex items-center justify-between">
                    <span>{item.artist}</span>
                    <span>練過 {item.totalPractices} 次</span>
                  </div>

                  {/* BPM Speed Progress */}
                  <div className="space-y-1 pt-1.5">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>當前掌握：{item.currentSpeedBpm} BPM</span>
                      <span>目標：{item.targetBpm} BPM</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.status === 'mastered' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        style={{
                          width: `${Math.min(100, (item.currentSpeedBpm / Math.max(1, item.targetBpm)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <button
                    onClick={() => {
                      setSearchInput(item.songName);
                      handleSearchSong(item.songName);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <span>載入攻略 ➔</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const newStatus = item.status === 'mastered' ? 'practicing' : 'mastered';
                        const updated = updateRepertoireStatus(item.id, newStatus);
                        setRepertoire(updated);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 cursor-pointer"
                      title="切換攻克狀態"
                    >
                      {item.status === 'mastered' ? '標為練習中' : '標為已攻克'}
                    </button>
                    <button
                      onClick={() => {
                        const updated = deleteRepertoireItem(item.id);
                        setRepertoire(updated);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                      title="刪除"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Song Search Workbench Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSong(searchInput);
          }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="輸入任何曲目 (例如：晴天、卡農、River Flows in You、City of Stars、First Love...)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'AI 分析拆解中...' : '生成高效練習步驟'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>演奏樂器：</span>
              <div className="flex gap-1">
                {['流行鋼琴', '古典鋼琴', '民謠吉他', '烏克麗麗'].map((inst) => (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => setSelectedInstrument(inst)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      selectedInstrument === inst
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span>程度：</span>
              <div className="flex gap-1">
                {['零基礎', '有基礎 (半年)', '進階突破'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Preset Famous Pieces Fast Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 font-medium">常見經典曲目快速載入：</span>
          {Object.keys(PRESET_SONG_GUIDES).map((song) => (
            <button
              key={song}
              onClick={() => {
                setSearchInput(song);
                handleSearchSong(song);
              }}
              className={`px-3 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                guide.songName.includes(song)
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {song}
            </button>
          ))}
        </div>
      </div>

      {/* Song Strategy Overview Board */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Title Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span>{guide.artist}</span>
              <span aria-hidden="true">·</span>
              <span>{guide.instrument}</span>
              <span aria-hidden="true">·</span>
              <span>4 階段高效拆解</span>
            </div>

            <h3 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>《{guide.songName}》</span>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                原速 {guide.bpm} BPM
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {guide.overview}
            </p>
          </div>

          {/* Quick Stats & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Play Song Preview (先聽聽看這個曲目) */}
            <button
              onClick={handlePlayPreview}
              className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md whitespace-nowrap ${
                isPlayingPreview
                  ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300 shadow-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
              }`}
              title="點擊先聽聽看這首曲子的主題旋律或核心和弦進行"
            >
              {isPlayingPreview ? (
                <>
                  <Square className="w-4 h-4 fill-current animate-pulse" />
                  <span>正在播放試聽 (點擊停止)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>🎵 先聽聽看這個曲目</span>
                </>
              )}
            </button>

            {/* Bookmark to Repertoire */}
            <button
              onClick={() => {
                setRepSpeedInput(Math.round(guide.bpm * 0.75));
                setShowAddToRepertoireModal(true);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>📌 加入我的曲目庫</span>
            </button>

            <button
              onClick={handleSetAsGoal}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 whitespace-nowrap"
            >
              <Target className="w-4 h-4" />
              <span>設為今日練琴目標</span>
            </button>

            <button
              onClick={() => onNavigateToTab('metronome')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Clock className="w-4 h-4" />
              <span>開啟節拍器</span>
            </button>
          </div>
        </div>

        {/* Modal to add to repertoire */}
        {showAddToRepertoireModal && (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-amber-400">加入我的練琴清單：《{guide.songName}》</span>
              <button
                onClick={() => setShowAddToRepertoireModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">攻克狀態：</label>
                <select
                  value={repStatusInput}
                  onChange={(e) => setRepStatusInput(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="practicing">🔥 攻克進行中</option>
                  <option value="mastered">🏆 已完全攻克掌握</option>
                  <option value="wishlist">✨ 待挑戰願望清單</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">當前掌握速度 (BPM)：</label>
                <input
                  type="number"
                  value={repSpeedInput}
                  onChange={(e) => setRepSpeedInput(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">個人筆記/心得：</label>
                <input
                  type="text"
                  value={repNotesInput}
                  onChange={(e) => setRepNotesInput(e.target.value)}
                  placeholder="如：換和弦卡頓、加強分解音"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddToRepertoireModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                取消
              </button>
              <button
                onClick={handleSaveToRepertoire}
                className="px-4 py-1.5 rounded-lg bg-amber-500 font-bold text-slate-950"
              >
                確認儲存
              </button>
            </div>
          </div>
        )}

        {repertoireAlert && (
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{repertoireAlert}</span>
          </div>
        )}

        {goalSetMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{goalSetMessage}</span>
          </div>
        )}

        {/* INTERACTIVE GUIDED PIANO KEYBOARD (即時導奏可視化琴鍵) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">互動導奏鋼琴琴鍵 (Visual Guided Keyboard)</h4>
              <span className="text-[11px] text-slate-400">播放試聽時音符將自動高亮，亦可點擊觸發琴鍵發聲</span>
            </div>

            {currentPreviewNoteName && (
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 animate-pulse">
                導奏落鍵：{currentPreviewNoteName}
              </span>
            )}
          </div>

          {/* Interactive Keyboard Visual Canvas */}
          <div className="relative w-full h-32 sm:h-36 bg-slate-900 rounded-xl p-2 select-none overflow-x-auto">
            <div className="relative flex h-full min-w-[500px]">
              {/* White Keys */}
              {WHITE_KEYS.map((keyNote) => {
                const isPlaying = currentPreviewNoteName === keyNote || activeInteractiveKey === keyNote;
                return (
                  <button
                    key={keyNote}
                    onClick={() => handleKeyClick(keyNote)}
                    className={`flex-1 h-full rounded-b-md border border-slate-400/40 flex flex-col justify-end items-center pb-2 transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/50 scale-[0.98]'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[10px] font-mono pointer-events-none">{keyNote}</span>
                  </button>
                );
              })}

              {/* Black Keys (Overlayed absolutely) */}
              {BLACK_KEYS.map((bKey) => {
                const isPlaying = currentPreviewNoteName === bKey.note || activeInteractiveKey === bKey.note;
                return (
                  <button
                    key={bKey.note}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleKeyClick(bKey.note);
                    }}
                    style={{ left: `${bKey.leftPercent}%` }}
                    className={`absolute top-0 w-[4.6%] h-[60%] rounded-b-md border border-slate-700 z-10 flex flex-col justify-end items-center pb-1 transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/50 scale-95'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[8px] font-mono pointer-events-none">{bKey.note.replace(/[0-9]/g, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Practice Audio Recorder Take & Self-Review */}
          <div className="pt-2">
            <PracticeAudioRecorder
              currentSongName={guide.songName}
              onSaveToLog={() => {
                setRepertoireAlert(`已將《${guide.songName}》本次錄音 Take 成果同步存入今日練琴日誌！`);
                setTimeout(() => setRepertoireAlert(null), 3000);
              }}
            />
          </div>
        </div>

        {/* Musical Metadata: Key, BPM, Core Chords */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono block">調性與拍號 (Key & Meter)</span>
            <span className="text-sm font-bold text-white font-mono">
              {guide.key} · {guide.timeSignature} 拍
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono block">建議練習速度梯度 (BPM Gradient)</span>
            <span className="text-sm font-bold text-amber-400 font-mono">
              慢速 55 ➔ 65 ➔ 原速 {guide.bpm} BPM
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono block">核心和弦模組 (Core Progression)</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {guide.chords.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateToTab('toolbox')}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 text-xs font-mono font-bold hover:border-amber-400 transition-colors cursor-pointer"
                  title="點擊前往和弦庫查看指法"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 PHASES STEP-BY-STEP EFFICIENCY PLAN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>四階段最高效練習步驟 (Phase-by-Phase Efficiency Plan)</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">時間配比法則：20% - 40% - 25% - 15%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {guide.stages.map((stage, sIdx) => (
              <div
                key={sIdx}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-900 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-[11px] flex items-center justify-center">
                      {sIdx + 1}
                    </span>
                    <span className="font-bold text-white">{stage.phaseTitle}</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px]">{stage.timeAllocation}</span>
                </div>

                <div className="text-xs text-amber-300/90 font-medium">
                  🎯 核心目標：{stage.focus}
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300">
                  {stage.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-2">
                      <span className="text-amber-400 text-xs">•</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-900">
                  <span>建議速度：</span>
                  <span className="text-white font-bold">{stage.suggestedSpeed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTLENECK & COMMON PITFALLS BREAKDOWN */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/20 to-slate-950 border border-rose-500/30 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-bold text-white">
              ⚠️ 這首曲子 90% 的人最常卡關的地方 (大魔王瓶頸解方)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guide.bottlenecks.map((b, bIdx) => (
              <div key={bIdx} className="p-4 rounded-xl bg-slate-950 border border-rose-500/20 space-y-2 text-xs">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <span>📍 卡關點：{b.spot}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">【常見盲點】：</span>
                  {b.issue}
                </div>
                <div className="text-emerald-300 pt-1">
                  <span className="text-emerald-400 font-semibold">【高效解方】：</span>
                  {b.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COACH SECRET TIP */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200 leading-relaxed flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-bold block mb-0.5">導師一句話最高效練習心法：</strong>
            {guide.coachSecretTip}
          </div>
        </div>

        {/* Bottom CTA to Coach */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            想針對這首曲子的特定小節發問，或拍照上傳你的琴譜？
          </span>

          <button
            onClick={() =>
              onAskCoachWithPrompt(
                `老師好，我正在練習《${guide.songName}》，請指導我如何有效克服第 2 階段的大魔王小節，並給我一些拋磚引玉的練習引導！`
              )
            }
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>向 AI 教練深度諮詢《{guide.songName}》</span>
          </button>
        </div>
      </div>
    </div>
  );
};
