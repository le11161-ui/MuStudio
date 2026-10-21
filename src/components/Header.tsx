import React, { useEffect, useState } from 'react';
import {
  Music,
  Sparkles,
  BookOpen,
  Flame,
  Headphones,
  Database,
  ArrowUpCircle,
  CheckCircle2,
} from 'lucide-react';
import { loadUserProfile } from '../utils/profileStorage';
import {
  CURRENT_APP_VERSION,
  hasNewVersionAvailable,
  getLatestAvailableVersion,
  checkRemoteVersionOnline,
} from '../utils/versionManager';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenGuide?: () => void;
  onOpenVersionModal?: () => void;
  onOpenAmbientModal?: () => void;
  onOpenBackupModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGuide,
  onOpenVersionModal,
  onOpenAmbientModal,
  onOpenBackupModal,
}) => {
  const [userLevel, setUserLevel] = useState<number>(1);
  const [userStreak, setUserStreak] = useState<number>(1);
  const [hasUpdate, setHasUpdate] = useState<boolean>(false);
  const [latestVer, setLatestVer] = useState<string>(CURRENT_APP_VERSION);

  const checkVersionStatus = async () => {
    // 1. Check local status first
    const localHasUpdate = hasNewVersionAvailable();
    setHasUpdate(localHasUpdate);
    setLatestVer(getLatestAvailableVersion());

    // 2. Also check remote server version manifest
    try {
      const res = await checkRemoteVersionOnline();
      if (res.hasUpdate) {
        setHasUpdate(true);
        setLatestVer(res.latestVersion);
      }
    } catch {
      // ignore network errors
    }
  };

  useEffect(() => {
    const profile = loadUserProfile();
    setUserLevel(profile.level);
    setUserStreak(profile.practiceDaysStreak);
    checkVersionStatus();

    // Auto-check every 30s and on window focus (so whenever developer pushes update, user sees it!)
    const timer = setInterval(checkVersionStatus, 30000);
    window.addEventListener('focus', checkVersionStatus);
    window.addEventListener('storage', checkVersionStatus);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', checkVersionStatus);
      window.removeEventListener('storage', checkVersionStatus);
    };
  }, [activeTab]);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('skilltree')}
          className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-none shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
            <Music className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            MuStudio <span className="text-amber-400 font-normal text-sm ml-1 hidden sm:inline">音樂領航所</span>
          </span>
        </button>

        {/* Zone 2: Ultra-streamlined 2-Hub navigation (練習與技能成長 + 工具與AI教練) */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-5 text-sm font-medium">
          <button
            onClick={() => setActiveTab('growth')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 px-3 rounded-xl cursor-pointer flex items-center gap-2 ${
              activeTab === 'growth' ||
              activeTab === 'practice' ||
              activeTab === 'profile' ||
              activeTab === 'songguide' ||
              activeTab === 'skills' ||
              activeTab === 'skilltree' ||
              activeTab === 'synergy'
                ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            <span className="text-base">📝</span>
            <span>個人練習與技能成長</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold hidden xl:inline">
              今日課表 · 日誌 · 技能樹
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`whitespace-nowrap shrink-0 transition-all py-1.5 px-3 rounded-xl cursor-pointer flex items-center gap-2 ${
              activeTab === 'tools' ||
              activeTab === 'toolbox' ||
              activeTab === 'circle' ||
              activeTab === 'tuner' ||
              activeTab === 'ear' ||
              activeTab === 'metronome' ||
              activeTab === 'stave' ||
              activeTab === 'score' ||
              activeTab === 'quiz' ||
              activeTab === 'coach'
                ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            <span className="text-base">🧰</span>
            <span>實戰工具箱與 AI 教練</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 hidden xl:inline">
              和弦 · 五度圈 · 調音器 · 盲測 · AI
            </span>
          </button>
        </nav>

        {/* Zone 3: Actions (Version Button, Guide, Ambient Sound, Level Badge, AI Coach) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* VERSION UPDATE BUTTON (The explicit user request: "只要有更新任何功能，上面就會有已更新換成更新版本的一個按鈕") */}
          {onOpenVersionModal && (
            <button
              onClick={onOpenVersionModal}
              className={`relative px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                hasUpdate
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black hover:brightness-110 border border-amber-300 shadow-amber-500/30 animate-pulse'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
              title={
                hasUpdate
                  ? `發現新功能更新！點擊開啟換成更新版本 (${latestVer})`
                  : `目前已更新為最新版本 (${CURRENT_APP_VERSION})，點擊查看更新公告`
              }
            >
              {hasUpdate ? (
                <>
                  <ArrowUpCircle className="w-3.5 h-3.5 fill-current animate-bounce" />
                  <span className="hidden sm:inline">換成更新版本</span>
                  <span className="sm:hidden">換新版</span>
                  <span className="w-2 h-2 rounded-full bg-red-400 absolute -top-0.5 -right-0.5 ring-2 ring-slate-950"></span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline">{CURRENT_APP_VERSION} 已更新</span>
                  <span className="lg:hidden">{CURRENT_APP_VERSION}</span>
                </>
              )}
            </button>
          )}

          {/* Ambient Soundscape Button */}
          {onOpenAmbientModal && (
            <button
              onClick={onOpenAmbientModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 shadow-sm"
              title="開啟專注氛圍背景音 (雨聲/黑膠/柴火/咖啡廳)"
            >
              <Headphones className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden xl:inline">氛圍音</span>
            </button>
          )}

          {/* Backup & Restore Button */}
          {onOpenBackupModal && (
            <button
              onClick={onOpenBackupModal}
              className="p-1.5 sm:px-2 sm:py-1.5 text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-blue-300 shadow-sm"
              title="備份與還原練琴歷程與數據"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
            </button>
          )}

          {/* All Features Catalog & How to Use Guide Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-200 hover:text-white shadow-sm"
              title="點擊開啟 MuStudio 所有功能整理表與按鍵使用指南"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">📖 功能整理表 & 使用指南</span>
              <span className="lg:hidden">指南</span>
            </button>
          )}

          {/* User Level & Streak */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium border transition-colors cursor-pointer ${
              activeTab === 'growth' || activeTab === 'practice' || activeTab === 'profile'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="點擊查看我的練琴日誌與程度檔案"
          >
            <span className="font-bold text-amber-400">Lv.{userLevel}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-rose-500 fill-current" />
              <span>{userStreak}天</span>
            </span>
          </button>

          {/* AI Coach */}
          <button
            onClick={() => setActiveTab('coach')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'coach'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI 教練</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Responsive Horizontal Tab Bar */}
      <div className="flex md:hidden items-center justify-between px-3 py-2 gap-1.5 border-t border-slate-900 bg-slate-950/95 text-xs">
        <button
          onClick={() => setActiveTab('growth')}
          className={`flex-1 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center justify-center gap-1 text-xs font-semibold ${
            activeTab === 'growth' ||
            activeTab === 'practice' ||
            activeTab === 'profile' ||
            activeTab === 'songguide' ||
            activeTab === 'skills' ||
            activeTab === 'skilltree' ||
            activeTab === 'synergy'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <span>📝 練習與技能</span>
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center justify-center gap-1 text-xs font-semibold ${
            activeTab === 'tools' ||
            activeTab === 'toolbox' ||
            activeTab === 'circle' ||
            activeTab === 'tuner' ||
            activeTab === 'ear' ||
            activeTab === 'metronome' ||
            activeTab === 'stave' ||
            activeTab === 'score' ||
            activeTab === 'quiz' ||
            activeTab === 'coach'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          <span>🧰 工具與 AI 教練</span>
        </button>

        {onOpenAmbientModal && (
          <button
            onClick={onOpenAmbientModal}
            className="px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 bg-slate-900 border border-slate-800 text-teal-300 text-xs font-medium"
            title="氛圍音"
          >
            <Headphones className="w-3 h-3 text-teal-400" />
          </button>
        )}

        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs"
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            <span>指南</span>
          </button>
        )}
      </div>
    </header>
  );
};

