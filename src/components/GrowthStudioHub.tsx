import React, { useState } from 'react';
import { UserProfileTracker } from './UserProfileTracker';
import { SongPracticeStrategizer } from './SongPracticeStrategizer';
import { SkillTreeMap } from './SkillTreeMap';
import { SkillSynergyMatrix } from './SkillSynergyMatrix';
import { DailyRoutinePlanner } from './DailyRoutinePlanner';
import {
  Calendar,
  Edit3,
  Search,
  Compass,
  Zap,
  BookOpen,
  Music,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';

export type GrowthSubTab = 'routine' | 'log' | 'songguide' | 'map' | 'synergy';

interface GrowthStudioHubProps {
  initialSubTab?: GrowthSubTab;
  initialSongName?: string;
  onNavigateToTab: (tab: string) => void;
  onAskCoachWithPrompt: (prompt: string) => void;
  onAskCoachAboutSkill: (skillTitle: string, question: string) => void;
  onSetTodayGoal?: (goal: string) => void;
  onOpenGuide?: () => void;
}

export const GrowthStudioHub: React.FC<GrowthStudioHubProps> = ({
  initialSubTab = 'routine',
  initialSongName = '晴天',
  onNavigateToTab,
  onAskCoachWithPrompt,
  onAskCoachAboutSkill,
  onSetTodayGoal,
  onOpenGuide,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<GrowthSubTab>(initialSubTab);
  const [currentSong, setCurrentSong] = useState<string>(initialSongName);

  const handleInspectSong = (songName: string) => {
    setCurrentSong(songName);
    setActiveSubTab('songguide');
  };

  return (
    <div className="space-y-6">
      {/* Consolidated In-Page Sub Navigation (今日課程規劃 · 練習日誌 · 曲目攻略 · 技能樹地圖 · 搭配弱項) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
          {/* New Core Feature: Today's Practice Course Planner */}
          <button
            onClick={() => setActiveSubTab('routine')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'routine'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-amber-300 hover:text-white hover:bg-slate-900 border border-amber-500/30'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>🗓️ 今日課程排程規劃</span>
          </button>

          <button
            onClick={() => setActiveSubTab('log')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'log'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>今日練習日誌與程度</span>
          </button>

          <button
            onClick={() => setActiveSubTab('songguide')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'songguide'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>曲目高效練法與試聽</span>
          </button>

          <button
            onClick={() => setActiveSubTab('map')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>4大樂器技能樹路線圖</span>
          </button>

          <button
            onClick={() => setActiveSubTab('synergy')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'synergy'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>技能搭配與弱項診斷</span>
          </button>
        </div>

        {/* Quick action: Open Full Feature Directory Guide */}
        <div className="flex items-center gap-2.5 text-xs text-slate-400 px-2 shrink-0">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              title="查看全站所有功能整理表與按鍵使用指南"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>📖 功能整理表 & 使用指南</span>
            </button>
          )}
        </div>
      </div>

      {/* Render Selected Sub View */}
      {activeSubTab === 'routine' && (
        <DailyRoutinePlanner
          onNavigateToTab={onNavigateToTab}
          onApplyPlanToLog={(summary) => {
            setActiveSubTab('log');
          }}
        />
      )}

      {activeSubTab === 'log' && (
        <UserProfileTracker
          onNavigateToTab={onNavigateToTab}
          onAskCoachWithPrompt={onAskCoachWithPrompt}
          onInspectSong={handleInspectSong}
        />
      )}

      {activeSubTab === 'songguide' && (
        <SongPracticeStrategizer
          onNavigateToTab={onNavigateToTab}
          onAskCoachWithPrompt={onAskCoachWithPrompt}
          onSetTodayGoal={onSetTodayGoal}
          initialSongName={currentSong}
        />
      )}

      {activeSubTab === 'map' && (
        <SkillTreeMap
          onAskCoachAboutSkill={onAskCoachAboutSkill}
          onNavigateToSynergy={() => setActiveSubTab('synergy')}
        />
      )}

      {activeSubTab === 'synergy' && (
        <SkillSynergyMatrix
          onNavigateToTab={onNavigateToTab}
          onAskCoachWithPrompt={onAskCoachWithPrompt}
        />
      )}
    </div>
  );
};
