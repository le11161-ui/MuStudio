import React, { useState } from 'react';
import { XP_UNLOCKABLES, XpUnlockItem } from '../data/xpUnlocks';
import { audioEngine, AudioTimbre } from '../utils/audioEngine';
import { loadUserProfile, saveUserProfile, addXp } from '../utils/profileStorage';
import {
  Award,
  Lock,
  Unlock,
  Sparkles,
  Volume2,
  Check,
  CheckCircle2,
  Play,
  ArrowRight,
  Flame,
  Music,
  Sliders,
  ChevronRight,
  Eye,
  Table,
  LayoutGrid,
  Search,
  Filter,
  Zap,
  ExternalLink,
  Gift,
  HelpCircle,
} from 'lucide-react';

interface XpUnlockVaultProps {
  currentXp: number;
  userLevel: number;
  onAskCoachWithPrompt: (prompt: string) => void;
  onProfileUpdated?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

const CATEGORY_NAMES: Record<string, { label: string; icon: string; color: string }> = {
  timbre: { label: '音色皮膚', icon: '🎹', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  chord_pack: { label: '大師和弦', icon: '📜', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  coach_pro: { label: 'AI 教練特權', icon: '🤖', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  tool_feature: { label: '工具增強', icon: '🎛️', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  title: { label: '榮譽稱號', icon: '👑', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
};

export const XpUnlockVault: React.FC<XpUnlockVaultProps> = ({
  currentXp,
  userLevel,
  onAskCoachWithPrompt,
  onProfileUpdated,
  onNavigateToTab,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'unlocked_only'>('table');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [equippedTimbre, setEquippedTimbre] = useState<AudioTimbre>(audioEngine.currentTimbre);
  const [viewingChordItem, setViewingChordItem] = useState<XpUnlockItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const profile = loadUserProfile();
  const currentTitle = profile.levelTitle || '樂理探險新手';

  const unlockedItems = XP_UNLOCKABLES.filter((item) => currentXp >= item.requiredXp);
  const lockedItems = XP_UNLOCKABLES.filter((item) => currentXp < item.requiredXp);
  const nextItem = lockedItems.sort((a, b) => a.requiredXp - b.requiredXp)[0];

  const filteredItems = XP_UNLOCKABLES.filter((item) => {
    const isUnlocked = currentXp >= item.requiredXp;

    // View mode shortcut
    if (viewMode === 'unlocked_only' && !isUnlocked) return false;

    // Status filter
    if (statusFilter === 'unlocked' && !isUnlocked) return false;
    if (statusFilter === 'locked' && isUnlocked) return false;

    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = item.title.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);
      const inPerks = item.perks.some((p) => p.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inPerks) return false;
    }

    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEquipTimbre = (timbre: AudioTimbre, title: string) => {
    audioEngine.setTimbre(timbre);
    setEquippedTimbre(timbre);

    // Play audition triad
    const freq = audioEngine.noteToFreq('C4') || 261.63;
    audioEngine.playPianoNote(freq, 1.2);
    audioEngine.playPianoNote(freq * 1.25, 1.2, 0.1);
    audioEngine.playPianoNote(freq * 1.5, 1.2, 0.2);

    showToast(`✨ 已成功套用【${title}】！全站琴鍵與曲目試聽已切換為此音色。`);
  };

  const handleEquipTitle = (title: string) => {
    const p = loadUserProfile();
    p.levelTitle = title;
    saveUserProfile(p);
    if (onProfileUpdated) onProfileUpdated();
    showToast(`👑 已成功佩戴【${title}】榮譽頭銜至個人名片！`);
  };

  const handleSimulatePracticeXp = () => {
    const updated = addXp(50);
    if (onProfileUpdated) onProfileUpdated();
    showToast(`🎉 成功獲得 +50 XP！目前累積經驗達到 ${updated.totalXp} XP！`);
  };

  const handlePlayChordPreview = (chords: string[]) => {
    let delay = 0;
    chords.forEach((ch) => {
      setTimeout(() => {
        const root = ch.replace(/maj|m|dim|alt|\/.*$|\d+/g, '');
        const freq = audioEngine.noteToFreq(`${root}3`) || 261.63;
        const isMinor = ch.includes('m') && !ch.includes('maj');
        const third = freq * (isMinor ? Math.pow(2, 3 / 12) : Math.pow(2, 4 / 12));
        const fifth = freq * Math.pow(2, 7 / 12);
        const seventh = freq * (ch.includes('maj') ? Math.pow(2, 11 / 12) : Math.pow(2, 10 / 12));
        audioEngine.playChord([freq, third, fifth, seventh], true, 1.3);
      }, delay * 1000);
      delay += 1.1;
    });
  };

  const handleTriggerAction = (item: XpUnlockItem) => {
    if (item.actionType === 'equip_sound') {
      handleEquipTimbre(item.actionPayload, item.title);
    } else if (item.actionType === 'view_chords') {
      setViewingChordItem(item);
    } else if (item.actionType === 'use_coach') {
      onAskCoachWithPrompt(item.actionPayload);
    } else if (item.actionType === 'equip_title') {
      handleEquipTitle(item.actionPayload);
    } else if (item.actionType === 'open_tool' && onNavigateToTab) {
      onNavigateToTab(item.actionPayload);
    }
  };

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-7 shadow-xl shadow-amber-500/5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Award className="w-4 h-4" />
            <span>XP 榮譽解鎖中心 · 實質特權與功能整理對照表</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>XP 特權解鎖庫 & 完整功能整理表</span>
            <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              已解鎖 {unlockedItems.length} / {XP_UNLOCKABLES.length} 項
            </span>
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            打卡練琴、盲測聽音與視奏所累積的 XP 經驗值，都能在此兌換專屬聲學音色、大師和弦進行祕笈、AI 教練 Pro 指令、工具進階模式與音樂家頭銜！
          </p>
        </div>

        {/* Current XP & Quick Practice Test Button */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">目前累積經驗值</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">{currentXp} XP</span>
          </div>

          <div className="w-px h-8 bg-slate-800 hidden sm:block" />

          <div>
            <span className="text-[10px] text-slate-400 block font-mono">解鎖進度率</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {Math.round((unlockedItems.length / XP_UNLOCKABLES.length) * 100)}%
            </span>
          </div>

          <button
            onClick={handleSimulatePracticeXp}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm ml-auto sm:ml-0"
            title="點擊模擬練習打卡獲取 50 XP 測試解鎖"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>打卡 +50 XP</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SPOTLIGHT 1: 『目前已用 XP 解鎖的特權』快速總覽看板 */}
      {/* ============================================================ */}
      <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>目前已解鎖的實質特權</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  共 {unlockedItems.length} 項特權現已啟用
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">隨時點擊各項特權按鈕，即可直接更換音色、研讀祕笈或喚醒 AI 教練！</p>
            </div>
          </div>

          {/* Current Active Status Indicator Chips */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span>🎹 使用中音色：</span>
              <strong className="text-amber-400">
                {equippedTimbre === 'grand_piano'
                  ? '施坦威演奏鋼琴'
                  : equippedTimbre === 'vintage_guitar'
                    ? '民謠復古吉他'
                    : equippedTimbre === 'synthwave'
                      ? '80s合成器'
                      : equippedTimbre === 'cathedral'
                        ? '大教堂空間'
                        : equippedTimbre === 'lofi_electric'
                          ? 'Lo-Fi電鋼琴'
                          : equippedTimbre === 'chiptune_8bit'
                            ? '8-Bit方波'
                            : '八音盒鈴音'}
              </strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span>👑 佩戴稱號：</span>
              <strong className="text-amber-300">{currentTitle}</strong>
            </span>
          </div>
        </div>

        {/* Unlocked Privileges Horizontal Flow Cards */}
        {unlockedItems.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            目前尚未解鎖特權，快前往每日練習日誌打卡或盲測挑戰獲取 XP！
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {unlockedItems.map((item) => {
              const isEquippedSound = item.actionType === 'equip_sound' && equippedTimbre === item.actionPayload;
              const isEquippedTitle = item.actionType === 'equip_title' && currentTitle === item.actionPayload;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs font-bold text-white truncate max-w-[140px]">{item.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.requiredXp} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>

                  {/* Immediate Action Button */}
                  <div>
                    {item.actionType === 'equip_sound' && (
                      <button
                        onClick={() => handleEquipTimbre(item.actionPayload, item.title)}
                        className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isEquippedSound
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {isEquippedSound ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>現正使用中</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>套用此音色</span>
                          </>
                        )}
                      </button>
                    )}

                    {item.actionType === 'view_chords' && (
                      <button
                        onClick={() => setViewingChordItem(item)}
                        className="w-full py-1.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>研讀大師和聲</span>
                      </button>
                    )}

                    {item.actionType === 'use_coach' && (
                      <button
                        onClick={() => onAskCoachWithPrompt(item.actionPayload)}
                        className="w-full py-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>啟動 AI 指令</span>
                      </button>
                    )}

                    {item.actionType === 'open_tool' && (
                      <button
                        onClick={() => onNavigateToTab && onNavigateToTab(item.actionPayload)}
                        className="w-full py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>前往該工具 ➔</span>
                      </button>
                    )}

                    {item.actionType === 'equip_title' && (
                      <button
                        onClick={() => handleEquipTitle(item.actionPayload)}
                        className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isEquippedTitle
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <span>{isEquippedTitle ? '👑 佩戴中' : '佩戴此頭銜'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* CONTROLS: 整理表 / 卡片切換 & 搜尋 & 篩選列 */}
      {/* ============================================================ */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>📋 功能整理對照表</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>🎴 視覺特權卡片</span>
            </button>
            <button
              onClick={() => setViewMode('unlocked_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'unlocked_only'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>僅看已解鎖 ({unlockedItems.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋特權名稱、音色、和弦進行、AI指令關鍵字..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>分類：</span>
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            全部 ({XP_UNLOCKABLES.length})
          </button>
          <button
            onClick={() => setSelectedCategory('timbre')}
            className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
              selectedCategory === 'timbre'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🎹 音色皮膚 (7)
          </button>
          <button
            onClick={() => setSelectedCategory('chord_pack')}
            className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
              selectedCategory === 'chord_pack'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📜 大師和弦 (6)
          </button>
          <button
            onClick={() => setSelectedCategory('coach_pro')}
            className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
              selectedCategory === 'coach_pro'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🤖 AI 教練特權 (5)
          </button>
          <button
            onClick={() => setSelectedCategory('tool_feature')}
            className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
              selectedCategory === 'tool_feature'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🎛️ 工具增強 (4)
          </button>
          <button
            onClick={() => setSelectedCategory('title')}
            className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
              selectedCategory === 'title'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            👑 榮譽稱號 (6)
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1: 『XP 特權功能完整整理表』 (Comprehensive Table View) */}
      {/* ============================================================ */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800 font-semibold">
                <th className="py-3 px-4 font-mono">特權項目</th>
                <th className="py-3 px-4 font-mono">功能類別</th>
                <th className="py-3 px-3 font-mono text-center">解鎖門檻</th>
                <th className="py-3 px-4">核心特權與實戰效益</th>
                <th className="py-3 px-3 font-mono text-center">目前狀態</th>
                <th className="py-3 px-4 text-right">即時動作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.map((item) => {
                const isUnlocked = currentXp >= item.requiredXp;
                const catInfo = CATEGORY_NAMES[item.category] || { label: item.category, icon: '⭐', color: '' };
                const isEquippedSound = item.actionType === 'equip_sound' && equippedTimbre === item.actionPayload;
                const isEquippedTitle = item.actionType === 'equip_title' && currentTitle === item.actionPayload;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isUnlocked
                        ? 'hover:bg-slate-900/70'
                        : 'opacity-65 hover:opacity-85 hover:bg-slate-950/90'
                    }`}
                  >
                    {/* Item Name & Icon */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                          {item.icon}
                        </span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{item.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.badgeTag}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono border ${catInfo.color}`}>
                        {catInfo.icon} {catInfo.label}
                      </span>
                    </td>

                    {/* Required XP */}
                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-bold">
                      <span className={isUnlocked ? 'text-emerald-400' : 'text-slate-400'}>
                        {item.requiredXp} XP
                      </span>
                    </td>

                    {/* Description & Perks */}
                    <td className="py-3 px-4 max-w-md">
                      <p className="text-slate-300 text-[11px] leading-relaxed mb-1.5">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.perks.map((perk, pIdx) => (
                          <span
                            key={pIdx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/80"
                          >
                            ✓ {perk}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Current Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono">
                      {isUnlocked ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                            ✅ 已解鎖
                          </span>
                          {isEquippedSound && (
                            <span className="text-[10px] text-amber-400 font-bold mt-0.5">● 現正使用中</span>
                          )}
                          {isEquippedTitle && (
                            <span className="text-[10px] text-amber-300 font-bold mt-0.5">● 佩戴中</span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[11px]">
                          🔒 還差 {item.requiredXp - currentXp} XP
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {!isUnlocked ? (
                        <span className="text-[11px] text-slate-500 font-mono">尚未解鎖</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {item.actionType === 'equip_sound' && (
                            <button
                              onClick={() => handleEquipTimbre(item.actionPayload, item.title)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isEquippedSound
                                  ? 'bg-emerald-500 text-slate-950 cursor-default'
                                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                              }`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{isEquippedSound ? '使用中' : '裝備音色'}</span>
                            </button>
                          )}

                          {item.actionType === 'view_chords' && (
                            <button
                              onClick={() => setViewingChordItem(item)}
                              className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>研讀祕笈</span>
                            </button>
                          )}

                          {item.actionType === 'use_coach' && (
                            <button
                              onClick={() => onAskCoachWithPrompt(item.actionPayload)}
                              className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>啟動 AI</span>
                            </button>
                          )}

                          {item.actionType === 'open_tool' && (
                            <button
                              onClick={() => onNavigateToTab && onNavigateToTab(item.actionPayload)}
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>開啟功能</span>
                            </button>
                          )}

                          {item.actionType === 'equip_title' && (
                            <button
                              onClick={() => handleEquipTitle(item.actionPayload)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isEquippedTitle
                                  ? 'bg-amber-400 text-slate-950 cursor-default'
                                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              <span>{isEquippedTitle ? '佩戴中' : '佩戴稱號'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: 『視覺特權卡片網格』 (Card Grid View) */}
      {/* ============================================================ */}
      {(viewMode === 'cards' || viewMode === 'unlocked_only') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isUnlocked = currentXp >= item.requiredXp;
            const isEquippedSound = item.actionType === 'equip_sound' && equippedTimbre === item.actionPayload;
            const isEquippedTitle = item.actionType === 'equip_title' && currentTitle === item.actionPayload;
            const catInfo = CATEGORY_NAMES[item.category] || { label: item.category, icon: '⭐', color: '' };

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 text-xs ${
                  isUnlocked
                    ? 'bg-slate-950/90 border-slate-800 hover:border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-900 opacity-65'
                }`}
              >
                <div className="space-y-3">
                  {/* Header Strip */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{item.title}</span>
                        </h4>
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border inline-block mt-0.5 ${catInfo.color}`}>
                          {catInfo.icon} {catInfo.label}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                        isUnlocked
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {isUnlocked ? '✅ 已解鎖' : `🔒 需 ${item.requiredXp} XP`}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-[11px]">{item.description}</p>

                  {/* Perks list */}
                  <ul className="space-y-1 text-slate-400 text-[10px] bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    {item.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Section */}
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                  {!isUnlocked ? (
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono w-full justify-between">
                      <span>還差 {item.requiredXp - currentXp} XP 解鎖</span>
                      <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${Math.min(100, (currentXp / item.requiredXp) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.actionType === 'equip_sound' && (
                        <div className="flex items-center justify-between w-full">
                          <button
                            onClick={() => {
                              const prev = audioEngine.currentTimbre;
                              audioEngine.setTimbre(item.actionPayload);
                              const freq = audioEngine.noteToFreq('C4') || 261.63;
                              audioEngine.playPianoNote(freq, 1.2);
                              audioEngine.playPianoNote(freq * 1.25, 1.2, 0.1);
                              audioEngine.playPianoNote(freq * 1.5, 1.2, 0.2);
                              setTimeout(() => {
                                audioEngine.setTimbre(prev);
                              }, 1500);
                            }}
                            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>試聽效果</span>
                          </button>

                          <button
                            onClick={() => handleEquipTimbre(item.actionPayload, item.title)}
                            disabled={isEquippedSound}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isEquippedSound
                                ? 'bg-emerald-500 text-slate-950 cursor-default'
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            }`}
                          >
                            {isEquippedSound ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>使用中</span>
                              </>
                            ) : (
                              <span>✨ 裝備此音色</span>
                            )}
                          </button>
                        </div>
                      )}

                      {item.actionType === 'view_chords' && (
                        <div className="flex items-center justify-between w-full">
                          <button
                            onClick={() => handlePlayChordPreview(item.actionPayload.chords)}
                            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>試聽大師進行</span>
                          </button>

                          <button
                            onClick={() => setViewingChordItem(item)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>研讀祕笈</span>
                          </button>
                        </div>
                      )}

                      {item.actionType === 'use_coach' && (
                        <button
                          onClick={() => onAskCoachWithPrompt(item.actionPayload)}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>一鍵啟動 AI 教練此模式 ➔</span>
                        </button>
                      )}

                      {item.actionType === 'open_tool' && (
                        <button
                          onClick={() => onNavigateToTab && onNavigateToTab(item.actionPayload)}
                          className="w-full py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                          <span>前往實戰工具箱體驗 ➔</span>
                        </button>
                      )}

                      {item.actionType === 'equip_title' && (
                        <button
                          onClick={() => handleEquipTitle(item.actionPayload)}
                          className={`w-full py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                            isEquippedTitle
                              ? 'bg-amber-400 text-slate-950 cursor-default'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                        >
                          <span>{isEquippedTitle ? '👑 目前已佩戴此稱號' : '👑 佩戴此稱號至個人檔案'}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chord Secret Modal */}
      {viewingChordItem && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4 animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">{viewingChordItem.icon}</span>
              <h4 className="text-sm font-bold text-white">{viewingChordItem.title}</h4>
            </div>
            <button
              onClick={() => setViewingChordItem(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-slate-300">{viewingChordItem.description}</div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] text-amber-400 font-mono block">
                【{viewingChordItem.actionPayload.progressionName}】核心和弦進行：
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono text-sm font-bold text-white">
                {viewingChordItem.actionPayload.chords.map((ch: string, i: number) => (
                  <React.Fragment key={i}>
                    <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {ch}
                    </span>
                    {i < viewingChordItem.actionPayload.chords.length - 1 && (
                      <span className="text-slate-600">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 leading-relaxed">
              💡 <strong>大師實戰彈奏心法：</strong> {viewingChordItem.actionPayload.guideTip}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handlePlayChordPreview(viewingChordItem.actionPayload.chords)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>連續播放試聽</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
