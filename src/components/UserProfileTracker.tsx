import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Flame,
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Star,
  Target,
  Calendar,
  ThumbsUp,
  Zap,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  Edit3,
  Search,
  Music,
  Check,
  Gift,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  UserMusicProfile,
  LEVEL_TITLES,
  ExperienceLevel,
  PracticeLogEntry,
  PracticeCondition
} from '../types/profile';
import {
  loadUserProfile,
  saveUserProfile,
  addDetailedPracticeLog,
  deletePracticeLog
} from '../utils/profileStorage';
import { audioEngine } from '../utils/audioEngine';
import { XpUnlockVault } from './XpUnlockVault';
import { loadDailyRoutinePlan } from '../utils/routineStorage';

interface UserProfileTrackerProps {
  onNavigateToTab: (tab: string) => void;
  onAskCoachWithPrompt: (prompt: string) => void;
  onInspectSong?: (songName: string) => void;
}

const COMMON_STRENGTH_TAGS = [
  '換和弦無停頓',
  '節拍穩定不搶拍',
  '背譜流暢無看手',
  '音色清脆無雜音',
  '左右手獨立合奏',
  '聽力音感一次答對',
  '動機旋律抓耳'
];

const COMMON_WEAKNESS_TAGS = [
  '封閉和弦有悶音',
  '第 4 拍過門越打越快',
  '左手大拇指容易酸痛',
  '視奏高音猶豫數數',
  '右手伴奏音量壓過主歌',
  '換到 Am 和弦手指延遲',
  '副歌歌詞略微倒字'
];

const CONDITION_META: Record<
  PracticeCondition,
  { label: string; badge: string; color: string; bg: string; icon: string }
> = {
  superb: {
    label: '手感極佳 (狀態絕佳)',
    badge: '🌟 極佳',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    icon: '🌟'
  },
  good: {
    label: '流暢順手 (達到目標)',
    badge: '✅ 順手',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    icon: '✅'
  },
  normal: {
    label: '普通平穩 (例行練習)',
    badge: '⚖️ 平穩',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: '⚖️'
  },
  struggling: {
    label: '遇到瓶頸 (手痠卡關)',
    badge: '🧗 卡關',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
    icon: '🧗'
  }
};

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: '⭐⭐⭐⭐⭐ 5星 · 超乎預期！手感絕佳、完全掌握',
  4: '⭐⭐⭐⭐ 4星 · 順暢良好！達成今日設定目標',
  3: '⭐⭐⭐ 3星 · 平穩順利！完成基礎例行練習',
  2: '⭐⭐ 2星 · 遇到挑戰！特定段落稍有卡頓',
  1: '⭐ 1星 · 遇到瓶頸！需進一步降速分解克服',
};

export const UserProfileTracker: React.FC<UserProfileTrackerProps> = ({
  onNavigateToTab,
  onAskCoachWithPrompt,
  onInspectSong,
}) => {
  const [profile, setProfile] = useState<UserMusicProfile>(() => loadUserProfile());
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [goalText, setGoalText] = useState<string>(profile.primaryGoal);
  const [showXpVault, setShowXpVault] = useState<boolean>(true);

  const routinePlan = loadDailyRoutinePlan();
  const routineCompletedCount = routinePlan.steps.filter((s) => s.completed).length;

  // Live Practice Stopwatch State
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerIntervalRef = useRef<number | null>(null);

  // Detailed Practice Log Modal State
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [modalMinutes, setModalMinutes] = useState<number>(30);
  const [modalCategory, setModalCategory] = useState<PracticeLogEntry['category']>('piano');
  const [modalCondition, setModalCondition] = useState<PracticeCondition>('good');
  const [modalRating, setModalRating] = useState<number>(5);
  const [modalStrengths, setModalStrengths] = useState<string[]>([]);
  const [modalWeaknesses, setModalWeaknesses] = useState<string[]>([]);
  const [customStrength, setCustomStrength] = useState<string>('');
  const [customWeakness, setCustomWeakness] = useState<string>('');
  const [modalNotes, setModalNotes] = useState<string>('');

  // Inline Direct Self-Practice Logger State (使用者直接在頁面填寫)
  const [quickSongItem, setQuickSongItem] = useState<string>('晴天');
  const [quickMinutes, setQuickMinutes] = useState<number>(30);
  const [quickCategory, setQuickCategory] = useState<PracticeLogEntry['category']>('piano');
  const [quickCondition, setQuickCondition] = useState<PracticeCondition>('good');
  const [quickRating, setQuickRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [quickStrengths, setQuickStrengths] = useState<string[]>(['換和弦無停頓']);
  const [quickWeaknesses, setQuickWeaknesses] = useState<string[]>(['封閉和弦有悶音']);
  const [quickCustomStrength, setQuickCustomStrength] = useState<string>('');
  const [quickCustomWeakness, setQuickCustomWeakness] = useState<string>('');
  const [quickNoteText, setQuickNoteText] = useState<string>('');
  const [savedSuccessAlert, setSavedSuccessAlert] = useState<string | null>(null);

  const handleToggleQuickStrength = (tag: string) => {
    setQuickStrengths((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleQuickWeakness = (tag: string) => {
    setQuickWeaknesses((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddQuickCustomStrength = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCustomStrength.trim() && !quickStrengths.includes(quickCustomStrength.trim())) {
      setQuickStrengths([...quickStrengths, quickCustomStrength.trim()]);
      setQuickCustomStrength('');
    }
  };

  const handleAddQuickCustomWeakness = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCustomWeakness.trim() && !quickWeaknesses.includes(quickCustomWeakness.trim())) {
      setQuickWeaknesses([...quickWeaknesses, quickCustomWeakness.trim()]);
      setQuickCustomWeakness('');
    }
  };

  const handleSaveQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStrengths = quickStrengths.length > 0 ? quickStrengths : ['今日練習流暢完成'];
    const finalWeaknesses = quickWeaknesses;

    const updated = addDetailedPracticeLog({
      minutes: quickMinutes,
      category: quickCategory,
      condition: quickCondition,
      rating: quickRating,
      strengths: finalStrengths,
      needsImprovement: finalWeaknesses,
      practiceItems: quickSongItem.trim() ? [quickSongItem.trim()] : [],
      notes: quickNoteText.trim() || (quickSongItem.trim() ? `今天自主專注練習了《${quickSongItem.trim()}》` : `自主練習了 ${quickMinutes} 分鐘`),
    });

    setProfile(updated);
    setSavedSuccessAlert(
      `🎉 成功儲存今日練習日誌！練習時長 +${quickMinutes} 分鐘，評量 ${quickRating} 顆星 ⭐，經驗值 +${quickMinutes * 2 + 20} XP！`
    );
    setTimeout(() => setSavedSuccessAlert(null), 4000);
  };

  // AI Appraisal State
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Practice Stopwatch effect
  useEffect(() => {
    if (isTimerActive) {
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerActive]);

  const handleStopTimerAndLog = () => {
    setIsTimerActive(false);
    const measuredMins = Math.max(5, Math.round(elapsedSeconds / 60));
    setModalMinutes(measuredMins);
    setQuickMinutes(measuredMins);
    setElapsedSeconds(0);
    // Play celebratory chime
    const freqC5 = audioEngine.noteToFreq('C5') || 523.25;
    const freqE5 = audioEngine.noteToFreq('E5') || 659.25;
    const freqG5 = audioEngine.noteToFreq('G5') || 783.99;
    audioEngine.playPianoNote(freqC5, 0.4, 0);
    audioEngine.playPianoNote(freqE5, 0.4, 0.15);
    audioEngine.playPianoNote(freqG5, 0.8, 0.3);
    setSavedSuccessAlert(
      `🎉 專注練琴計時結束！已將計時的 ${measuredMins} 分鐘自動帶入下方今日練習日誌！`
    );
    setTimeout(() => setSavedSuccessAlert(null), 4000);
  };

  // Level & XP math
  const currentLevelIndex = LEVEL_TITLES.findIndex((l) => l.level === profile.level);
  const nextLevelInfo = LEVEL_TITLES[currentLevelIndex + 1];
  const currentLevelMinXp = LEVEL_TITLES[currentLevelIndex]?.minXp || 0;
  const nextLevelMinXp = nextLevelInfo ? nextLevelInfo.minXp : profile.totalXp;
  const xpNeeded = nextLevelInfo ? nextLevelMinXp - profile.totalXp : 0;
  const levelProgressPercent = nextLevelInfo
    ? Math.min(
        100,
        Math.max(
          5,
          Math.round(
            ((profile.totalXp - currentLevelMinXp) / (nextLevelMinXp - currentLevelMinXp)) * 100
          )
        )
      )
    : 100;

  // Toggle Strengths & Weaknesses in Modal
  const toggleTag = (list: string[], setList: (l: string[]) => void, tag: string) => {
    if (list.includes(tag)) {
      setList(list.filter((t) => t !== tag));
    } else {
      setList([...list, tag]);
    }
  };

  const handleAddCustomStrength = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStrength.trim() && !modalStrengths.includes(customStrength.trim())) {
      setModalStrengths([...modalStrengths, customStrength.trim()]);
      setCustomStrength('');
    }
  };

  const handleAddCustomWeakness = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWeakness.trim() && !modalWeaknesses.includes(customWeakness.trim())) {
      setModalWeaknesses([...modalWeaknesses, customWeakness.trim()]);
      setCustomWeakness('');
    }
  };

  // Submit Detailed Practice Log
  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = addDetailedPracticeLog({
      minutes: modalMinutes,
      category: modalCategory,
      condition: modalCondition,
      rating: modalRating,
      strengths: modalStrengths,
      needsImprovement: modalWeaknesses,
      notes: modalNotes || `完成了 ${modalMinutes} 分鐘專注練習`,
    });
    setProfile(updated);
    setShowLogModal(false);
    setModalStrengths([]);
    setModalWeaknesses([]);
    setModalNotes('');
  };

  // Delete Log
  const handleDeleteLog = (id: string) => {
    const updated = deletePracticeLog(id);
    setProfile(updated);
  };

  // AI Diagnostic Appraisal
  const handleRequestAiAppraisal = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);

    try {
      const allStrengths = Array.from(new Set(profile.logs.flatMap((l) => l.strengths)));
      const allWeaknesses = Array.from(new Set(profile.logs.flatMap((l) => l.needsImprovement)));

      const prompt = `請以「MuStudio 個人音樂教練」的啟發式口吻，為這位學生進行【學習狀況與弱項加強專屬診斷】。
學生近期練習數據：
- 當前等級：${profile.levelTitle} (Lv.${profile.level}，${profile.totalXp} XP)
- 總練習時數：${profile.totalPracticeMinutes} 分鐘，連續打卡 ${profile.practiceDaysStreak} 天
- 核心目標：「${profile.primaryGoal}」
- 近期表現很好/掌握的優勢：${allStrengths.join('、') || '無特殊記錄'}
- 近期遇到瓶頸/需加強的弱項：${allWeaknesses.join('、') || '無特殊記錄'}

請嚴格針對上述「很好」與「需要加強」的具體項目，提供：
1. 【現況點評】：肯定表現優秀的肌肉記憶，分析瓶頸的生理或和聲成因。
2. 【弱項專屬加強處方】：針對他標記的弱點，給出 2 個具體的避坑練習法（例如降速、指法槓桿、節拍器對位）。
3. 一個拋磚引玉引導思考的後續練習問題。`;

      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();
      const updated: UserMusicProfile = {
        ...profile,
        aiAssessment: {
          evaluatedAt: new Date().toLocaleDateString('zh-TW'),
          levelName: profile.levelTitle,
          summary: data.answer || '你的練琴歷程非常紮實！對於已經掌握的優勢請繼續保持，針對瓶頸點讓我們用科學的方法逐一擊破！',
          strengths: allStrengths.slice(0, 3),
          recommendedMilestone: '建議每日練琴前 5 分鐘先以 60 BPM 慢速暖手，專攻近期標記的弱項！',
          weaknessRemedy: '針對換和弦與封閉和弦，落實手臂重量下沉與共同音保留法。',
        },
      };

      setProfile(updated);
      saveUserProfile(updated);
    } catch (err) {
      console.warn('AI Appraisal error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Collect All Recent Strengths & Weaknesses
  const aggregatedStrengths = Array.from(new Set(profile.logs.flatMap((l) => l.strengths)));
  const aggregatedWeaknesses = Array.from(
    new Set(profile.logs.flatMap((l) => l.needsImprovement))
  );

  const categoryLabels: Record<PracticeLogEntry['category'], string> = {
    piano: '🎹 鋼琴鍵盤',
    guitar: '🎸 吉他/烏克麗麗',
    drums: '🥁 爵士鼓節奏',
    dtm: '🎛️ DTM 編曲創作',
    theory: '📚 樂理探索',
    sight_reading: '⚡ 視奏快刷',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Stopwatch Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              每日練習狀況與學習管理儀
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
              狀況追蹤 & 弱項診斷
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            記錄每天的練習分鐘、手感狀況，客觀掌握「哪裡做得很好」與「哪裡急需加強」。
          </p>
        </div>

        {/* Live Practice Timer Box */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 px-3">
            <Clock
              className={`w-4 h-4 ${isTimerActive ? 'text-amber-400 animate-spin' : 'text-slate-400'}`}
            />
            <span className="font-mono font-bold text-base text-white tabular-nums">
              {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
              {String(elapsedSeconds % 60).padStart(2, '0')}
            </span>
          </div>

          {/* Quick presets when stopped */}
          {!isTimerActive && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <button
                type="button"
                onClick={() => {
                  setElapsedSeconds(15 * 60);
                  setIsTimerActive(true);
                }}
                className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                title="15分鐘暖手計時"
              >
                15m
              </button>
              <button
                type="button"
                onClick={() => {
                  setElapsedSeconds(25 * 60);
                  setIsTimerActive(true);
                }}
                className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 font-semibold cursor-pointer"
                title="25分鐘番茄鐘專注"
              >
                25m 🍅
              </button>
              <button
                type="button"
                onClick={() => {
                  setElapsedSeconds(45 * 60);
                  setIsTimerActive(true);
                }}
                className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                title="45分鐘深度專案練習"
              >
                45m
              </button>
            </div>
          )}

          {!isTimerActive ? (
            <button
              onClick={() => setIsTimerActive(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>開始練琴計時</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsTimerActive(false)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleStopTimerAndLog}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer shadow-sm animate-pulse"
              >
                結束並帶入日誌
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setModalMinutes(30);
              setShowLogModal(true);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            手動彈出
          </button>
        </div>
      </div>

      {/* Level & XP Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex flex-col items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider">LEVEL</span>
              <span className="text-2xl font-black font-mono leading-none">{profile.level}</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {profile.levelTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                已累計記錄 {profile.logs.length} 次練琴日誌，記錄越詳細，AI 程度診斷越精準！
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 text-left">
            <div>
              <div className="text-xs text-slate-400">總累積練琴時長</div>
              <div className="text-lg sm:text-xl font-bold text-amber-400 font-mono tabular-nums">
                {profile.totalPracticeMinutes} 分鐘
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">連續打卡天數</div>
              <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums flex items-center gap-1">
                <Flame className="w-4 h-4 text-rose-500 fill-current" />
                <span>{profile.practiceDaysStreak} 天</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">累積音樂經驗值</div>
              <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
                {profile.totalXp} XP
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">
              升級進度：<strong className="text-white font-bold">{levelProgressPercent}%</strong>
            </span>
            <span className="text-slate-400">
              {nextLevelInfo ? (
                <>距離下一等級還差 <span className="text-amber-400 font-bold">{xpNeeded} XP</span></>
              ) : (
                '已達最高大師等級！'
              )}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>

          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">
              💡 練琴打卡與聽音盲測所獲得的 XP，可解鎖專屬合成音色、大師和弦進行祕笈與 AI 教練 Pro 特權！
            </span>
            <button
              type="button"
              onClick={() => setShowXpVault(!showXpVault)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>{showXpVault ? '收起 XP 特權解鎖庫' : '🎁 展開 XP 特權解鎖庫'}</span>
              {showXpVault ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* CORE FEATURE: XP UNLOCK VAULT (音色皮膚 · 大師和弦祕笈 · AI特權 · 工具強化 · 榮譽頭銜 · 完整功能整理表) */}
      {showXpVault && (
        <XpUnlockVault
          currentXp={profile.totalXp}
          userLevel={profile.level}
          onAskCoachWithPrompt={onAskCoachWithPrompt}
          onProfileUpdated={() => setProfile(loadUserProfile())}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {/* SUCCESS NOTIFICATION ALERT */}
      {savedSuccessAlert && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 animate-fade-in shadow-xl shadow-emerald-950/40">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{savedSuccessAlert}</span>
          </div>
          <button
            onClick={() => setSavedSuccessAlert(null)}
            className="text-emerald-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* QUICK STATUS CARD: 今日課程排程狀態與一鍵帶入 */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shrink-0">
            🗓️
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>今日課程修煉排程：{routinePlan.routineName}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                已完成 {routineCompletedCount} / {routinePlan.steps.length} 步驟
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              規劃今天第一步做什麼、第二步做什麼，按部就班高效練琴。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              const songStep = routinePlan.steps.find((s) => s.category === 'song');
              if (songStep) setQuickSongItem(songStep.title.replace(/^Step \d+:\s*/, ''));
              setQuickMinutes(routinePlan.totalPlannedMinutes || 30);
              setQuickNoteText(
                `依【${routinePlan.routineName}】排程推進，完成 ${routineCompletedCount}/${routinePlan.steps.length} 步驟。`
              );
              setSavedSuccessAlert('已將今日排程總時間與曲目快速代入下方表單！');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-medium"
            title="將今日排程總時間與曲目快速代入下方表單"
          >
            <span>⚡ 帶入排程時間</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateToTab('routine')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer text-xs flex items-center gap-1 shadow-md shadow-amber-500/15"
          >
            <span>查看/規劃排程 ➔</span>
          </button>
        </div>
      </div>

      {/* CORE FEATURE: 『今日練習日誌』 (手動輸入曲目、時間、自我評量星星數) */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl shadow-amber-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>『今日練習日誌』</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-medium border border-amber-500/30">
                  曲目 · 時間(分鐘) · 自我評量星星數 ⭐
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                手動輸入練習曲目、練習時間（分鐘）以及本次練習的『自我評量星星數』，即時儲存至本地儲存庫，方便隨時追蹤練習歷史。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (quickSongItem.trim()) {
                  if (onInspectSong) {
                    onInspectSong(quickSongItem.trim());
                  } else {
                    onNavigateToTab('songguide');
                  }
                } else {
                  onNavigateToTab('songguide');
                }
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              title="查看曲目的 4 階段練習步驟與大魔王避坑解方"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>查曲目高效練法 ➔</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveQuickLog} className="space-y-5 text-xs">
          {/* Row 1: Practiced Piece / Song Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>練習曲目或特定技能項目：</span>
              </label>
              <span className="text-[11px] text-slate-400">可自訂填寫任何歌曲或練習點</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={quickSongItem}
                  onChange={(e) => setQuickSongItem(e.target.value)}
                  placeholder="輸入曲目名稱 (例如：晴天、卡農、River Flows in You、4536 和弦進行、F 封閉和弦...)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {quickSongItem.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    if (onInspectSong) {
                      onInspectSong(quickSongItem.trim());
                    } else {
                      onNavigateToTab('songguide');
                    }
                  }}
                  className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>查詢《{quickSongItem.trim()}》高效練法步驟 ➔</span>
                </button>
              )}
            </div>

            {/* Quick Benchmark Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-slate-400">常見熱門範例：</span>
              {['晴天', '卡農', 'River Flows in You', '天空之城', '4536 王道和弦', 'F 封閉和弦克服'].map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setQuickSongItem(chip)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer border ${
                    quickSongItem === chip
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Duration & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Minutes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-200 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>練習時長：<strong className="text-amber-400 font-mono">{quickMinutes} 分鐘</strong></span>
                </label>
              </div>

              <div className="flex items-center gap-1.5">
                {[15, 30, 45, 60, 90].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setQuickMinutes(mins)}
                    className={`flex-1 py-2 rounded-lg font-mono font-bold text-xs transition-colors cursor-pointer ${
                      quickMinutes === mins
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
                <div className="w-20 relative">
                  <input
                    type="number"
                    min={1}
                    max={480}
                    value={quickMinutes}
                    onChange={(e) => setQuickMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 text-center text-xs text-white font-mono"
                    title="自訂分鐘數"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-slate-200 font-semibold block">樂器或項目類別：</label>
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="piano">🎹 流行/古典鋼琴 (和弦/雙手合奏/彈唱)</option>
                <option value="guitar">🎸 民謠吉他/烏克麗麗 (指法/封閉/刷奏)</option>
                <option value="drums">🥁 爵士鼓節奏 (8-Beat/切分/過門)</option>
                <option value="dtm">🎛️ DTM 編曲創作 (寫歌/和弦進行/MIDI)</option>
                <option value="sight_reading">⚡ 視奏快刷識譜</option>
                <option value="theory">📚 樂理觀念探索</option>
              </select>
            </div>
          </div>

          {/* Row: Self-Assessment Star Rating (本次練習的自我評量星星數) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/25 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-slate-200 font-semibold flex items-center gap-1.5 text-xs">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>本次練習『自我評量星星數』：</span>
                <span className="text-amber-400 font-mono font-bold">({quickRating} 顆星)</span>
              </label>
              <span className="text-amber-300 font-mono text-xs font-semibold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                {RATING_DESCRIPTIONS[hoverRating || quickRating]}
              </span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = hoverRating !== null ? star <= hoverRating : star <= quickRating;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setQuickRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                      title={`評量 ${star} 顆星`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : 'text-slate-700 hover:text-slate-500'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-slate-400 text-xs leading-relaxed hidden sm:inline">
                點擊星星為本次練琴進行自我評量，紀錄將儲存至本地歷史記錄中。
              </span>
            </div>
          </div>

          {/* Row 3: Practice Condition (手感狀況) */}
          <div className="space-y-1.5">
            <label className="text-slate-200 font-semibold block">今日練習手感狀況 (客觀評估)：</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CONDITION_META) as PracticeCondition[]).map((cond) => {
                const meta = CONDITION_META[cond];
                const isSelected = quickCondition === cond;

                return (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => setQuickCondition(cond)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-950 border-amber-400 ring-1 ring-amber-400/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base">{meta.icon}</span>
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Strengths (做得很好) vs Weaknesses (需要加強) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Strengths */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>做得很好的地方 / 掌握的優勢：</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">已選 {quickStrengths.length} 項</span>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-1.5">
                {COMMON_STRENGTH_TAGS.map((tag) => {
                  const isChecked = quickStrengths.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleToggleQuickStrength(tag)}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer border ${
                        isChecked
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {isChecked ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>

              {/* Custom input */}
              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={quickCustomStrength}
                  onChange={(e) => setQuickCustomStrength(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQuickCustomStrength(e);
                    }
                  }}
                  placeholder="自訂做得很好的地方 (Enter 添加)"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={handleAddQuickCustomStrength}
                  className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold rounded-lg text-[11px] cursor-pointer"
                >
                  添加
                </button>
              </div>

              {/* Currently Selected Badges */}
              {quickStrengths.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {quickStrengths.map((str, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] flex items-center gap-1"
                    >
                      <span>{str}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleQuickStrength(str)}
                        className="text-emerald-400 hover:text-white ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Weaknesses */}
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>需要加強的地方 / 待克服弱項：</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">已選 {quickWeaknesses.length} 項</span>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-1.5">
                {COMMON_WEAKNESS_TAGS.map((tag) => {
                  const isChecked = quickWeaknesses.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleToggleQuickWeakness(tag)}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer border ${
                        isChecked
                          ? 'bg-rose-500 text-white font-bold border-rose-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {isChecked ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>

              {/* Custom input */}
              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={quickCustomWeakness}
                  onChange={(e) => setQuickCustomWeakness(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQuickCustomWeakness(e);
                    }
                  }}
                  placeholder="自訂需加強的弱項 (Enter 添加)"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-rose-400"
                />
                <button
                  type="button"
                  onClick={handleAddQuickCustomWeakness}
                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold rounded-lg text-[11px] cursor-pointer"
                >
                  添加
                </button>
              </div>

              {/* Currently Selected Badges */}
              {quickWeaknesses.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {quickWeaknesses.map((weak, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 text-[11px] flex items-center gap-1"
                    >
                      <span>{weak}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleQuickWeakness(weak)}
                        className="text-rose-400 hover:text-white ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 5: Notes & Submit */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">練習隨筆筆記心得 (選填)：</label>
            <textarea
              rows={2}
              value={quickNoteText}
              onChange={(e) => setQuickNoteText(e.target.value)}
              placeholder="隨筆記錄今天的手感心得，例如換手時的呼吸感覺、踏板換踩時機、節拍器對位反應..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none text-xs"
            />
          </div>

          {/* Submit Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400">
              點擊保存後，經驗值將即時增加 <strong className="text-amber-400 font-mono">+{quickMinutes * 2 + 20} XP</strong>，連續打卡天數與程度進度條自動刷新！
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>保存今日自主練習日誌 (+{quickMinutes * 2 + 20} XP)</span>
            </button>
          </div>
        </form>
      </div>

      {/* CORE FEATURE: Learning Condition Management Board (很好 vs 需要加強) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: What's Going Very Well */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">近期表現很好的地方 (優勢掌握)</h3>
                <span className="text-xs text-slate-400">已建立穩定的肌肉記憶與聽覺習慣</span>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {aggregatedStrengths.length} 項突破
            </span>
          </div>

          {aggregatedStrengths.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              尚未標記今日優勢，在下方登記練習時勾選你覺得今天彈得很棒的地方！
            </div>
          ) : (
            <div className="space-y-2">
              {aggregatedStrengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 text-xs sm:text-sm text-emerald-200 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{str}</span>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            💡 導師觀點：表現優良的項目請保持「每週複習一次」的頻率，避免隔週生疏。
          </div>
        </div>

        {/* Right Column: What Needs Strengthening */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">當前急需加強的弱項 (待攻克瓶頸)</h3>
                <span className="text-xs text-slate-400">需特別安排慢速分解與專屬練習處方</span>
              </div>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">
              {aggregatedWeaknesses.length} 項待突破
            </span>
          </div>

          {aggregatedWeaknesses.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              目前無待攻克弱項標記！在練習遇到卡關時及時記錄，教練將為您對症下藥。
            </div>
          ) : (
            <div className="space-y-2">
              {aggregatedWeaknesses.map((weak, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-rose-500/20 text-xs sm:text-sm text-rose-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{weak}</span>
                  </div>

                  <button
                    onClick={() =>
                      onAskCoachWithPrompt(
                        `老師好，我在練習記錄中標記了弱項「${weak}」，請問有什麼具體的分解慢速練習法可以幫助我這週突破？`
                      )
                    }
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-rose-500/40 text-amber-300 text-xs rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>求處方</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onNavigateToTab('synergy')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium underline flex items-center gap-1 cursor-pointer"
            >
              <span>查看這些弱項的黃金搭配補強指南 ➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Condition Evaluation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">AI 教練：學習狀況綜合診斷與週調度</h3>
          </div>

          <button
            onClick={handleRequestAiAppraisal}
            disabled={isEvaluating}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEvaluating ? '正在分析診斷中...' : '生成學習狀況專屬診斷'}</span>
          </button>
        </div>

        {profile.aiAssessment ? (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-line">
              {profile.aiAssessment.summary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <span className="font-bold text-emerald-400 block text-xs uppercase tracking-wide">
                  🌟 已鞏固的優勢成果：
                </span>
                <ul className="space-y-1 text-slate-300 text-xs">
                  {profile.aiAssessment.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <span className="font-bold text-amber-400 block text-xs uppercase tracking-wide">
                  🎯 本週重點加強處方箋：
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {profile.aiAssessment.recommendedMilestone}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400 space-y-2">
            <p>點擊上方按鈕，AI 音樂教練將綜合分析您登記的「很好」與「需要加強」項目，為您開立專屬調度處方箋！</p>
          </div>
        )}
      </div>

      {/* History Practice Logs List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">歷程練琴日誌詳細清單</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">共 {profile.logs.length} 篇日誌</span>
        </div>

        {profile.logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            目前尚無練琴記錄，立即開始今天的第一堂音樂練習吧！
          </div>
        ) : (
          <div className="space-y-3">
            {profile.logs.map((log) => {
              const meta = CONDITION_META[log.condition] || CONDITION_META.good;

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-slate-400">{log.date}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-bold font-mono">
                        +{log.minutes} 分鐘
                      </span>
                      <span className="font-semibold text-white">
                        {categoryLabels[log.category] || log.category}
                      </span>

                      {/* Star Rating Badge */}
                      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] text-amber-300">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= (log.rating ?? 5)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-mono font-bold ml-0.5">{log.rating ?? 5}星評量</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${meta.bg} ${meta.color}`}
                      >
                        {meta.label}
                      </span>

                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 cursor-pointer"
                        title="刪除此筆記錄"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {log.strengths && log.strengths.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>做得很好：</span>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {log.strengths.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 text-[11px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.needsImprovement && log.needsImprovement.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>需要加強：</span>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {log.needsImprovement.map((w, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-500/20 text-[11px]"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {log.practiceItems && log.practiceItems.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>練習曲目/項目：</span>
                        <strong className="text-white font-mono">{log.practiceItems.join('、')}</strong>
                      </div>
                      <button
                        onClick={() => {
                          const item = log.practiceItems?.[0];
                          if (item) {
                            if (onInspectSong) {
                              onInspectSong(item);
                            } else {
                              onNavigateToTab('songguide');
                            }
                          }
                        }}
                        className="text-amber-300 hover:text-amber-200 font-semibold text-[11px] flex items-center gap-1 cursor-pointer hover:underline transition-colors"
                      >
                        <Search className="w-3 h-3 text-amber-400" />
                        <span>查看此曲目練習攻略 ➔</span>
                      </button>
                    </div>
                  )}

                  {log.notes && (
                    <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                      {log.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAILED PRACTICE LOGGING MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>記錄今日練琴狀況與分鐘</span>
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-4 text-xs">
              {/* 1. Minutes Selection */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  練習時長：<span className="text-amber-400 font-bold">{modalMinutes} 分鐘</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[15, 30, 45, 60, 90].map((mins) => (
                    <button
                      type="button"
                      key={mins}
                      onClick={() => setModalMinutes(mins)}
                      className={`py-2 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                        modalMinutes === mins
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-300'
                      }`}
                    >
                      {mins} 分
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Practice Condition (4 options) */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">今日練習手感狀況：</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(CONDITION_META) as PracticeCondition[]).map((cond) => {
                    const meta = CONDITION_META[cond];
                    const isSelected = modalCondition === cond;

                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => setModalCondition(cond)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-slate-950 border-amber-400 ring-1 ring-amber-400/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-base">{meta.icon}</span>
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Star Rating */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>自我評量星星數：</span>
                  </label>
                  <span className="text-amber-400 font-mono text-[11px] font-bold">
                    {modalRating} 顆星
                  </span>
                </div>
                <div className="flex items-center gap-1 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setModalRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= modalRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 hover:text-slate-500'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-[11px] text-slate-400 ml-2">
                    {RATING_DESCRIPTIONS[modalRating]}
                  </span>
                </div>
              </div>

              {/* 4. Category */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">主要練習項目：</label>
                <select
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="piano">🎹 流行/古典鋼琴 (和弦/雙手合奏)</option>
                  <option value="guitar">🎸 民謠吉他/烏克麗麗 (指法/封閉/刷奏)</option>
                  <option value="drums">🥁 爵士鼓節奏 (8-Beat/切分/過門)</option>
                  <option value="dtm">🎛️ DTM 編曲創作 (寫歌/和弦進行/MIDI)</option>
                  <option value="sight_reading">⚡ 視奏快刷識譜</option>
                  <option value="theory">📚 樂理觀念探索</option>
                </select>
              </div>

              {/* 4. What's Going Well (做得很好) */}
              <div className="space-y-1.5">
                <label className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>今天做得很好 / 突破點 (點擊快捷標籤)：</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_STRENGTH_TAGS.map((tag) => {
                    const isChecked = modalStrengths.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(modalStrengths, setModalStrengths, tag)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {isChecked ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={customStrength}
                    onChange={(e) => setCustomStrength(e.target.value)}
                    placeholder="自訂優勢 (例：成功彈完前奏 4 小節)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomStrength}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold rounded-lg text-[11px]"
                  >
                    添加
                  </button>
                </div>
              </div>

              {/* 5. What Needs Improvement (需要加強) */}
              <div className="space-y-1.5">
                <label className="text-rose-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>今天需要加強 / 待克服弱項 (點擊快捷標籤)：</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_WEAKNESS_TAGS.map((tag) => {
                    const isChecked = modalWeaknesses.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(modalWeaknesses, setModalWeaknesses, tag)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-rose-500 text-white font-bold border-rose-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {isChecked ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={customWeakness}
                    onChange={(e) => setCustomWeakness(e.target.value)}
                    placeholder="自訂弱項 (例：右手順手度不夠)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomWeakness}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold rounded-lg text-[11px]"
                  >
                    添加
                  </button>
                </div>
              </div>

              {/* 6. Notes */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">練習隨筆筆記：</label>
                <textarea
                  rows={2}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="隨手記錄今天的體會，例如換手時的呼吸感受或節拍對位心得..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  確認保存登記 (+{modalMinutes * 2 + 20} XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
