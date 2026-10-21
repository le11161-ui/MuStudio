import React, { useState } from 'react';
import { UserProfileTracker } from './UserProfileTracker';
import { SongPracticeStrategizer } from './SongPracticeStrategizer';
import { Edit3, Search, Calendar, Music, Sparkles, BookOpen } from 'lucide-react';

interface PracticeHubProps {
  onNavigateToTab: (tab: string) => void;
  onAskCoachWithPrompt: (prompt: string) => void;
  onSetTodayGoal?: (goal: string) => void;
  initialSubTab?: 'log' | 'songguide';
  initialSongName?: string;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({
  onNavigateToTab,
  onAskCoachWithPrompt,
  onSetTodayGoal,
  initialSubTab = 'log',
  initialSongName = '晴天',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'log' | 'songguide'>(initialSubTab);
  const [currentSong, setCurrentSong] = useState<string>(initialSongName);

  const handleInspectSong = (songName: string) => {
    setCurrentSong(songName);
    setActiveSubTab('songguide');
  };

  const handleApplySongToPractice = (songName: string) => {
    setCurrentSong(songName);
    setActiveSubTab('log');
  };

  return (
    <div className="space-y-6">
      {/* Integrated In-Page Sub Navigation Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('log')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'log'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>今日練習日誌與程度</span>
          </button>

          <button
            onClick={() => setActiveSubTab('songguide')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'songguide'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>曲目高效練法與試聽</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-400 px-2">
          <button
            onClick={() => onNavigateToTab('guide')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            title="查看全站所有功能整理表與按鍵使用指南"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>📖 功能整理表 & 使用指南</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      {activeSubTab === 'log' ? (
        <UserProfileTracker
          onNavigateToTab={onNavigateToTab}
          onAskCoachWithPrompt={onAskCoachWithPrompt}
          onInspectSong={handleInspectSong}
        />
      ) : (
        <SongPracticeStrategizer
          onNavigateToTab={onNavigateToTab}
          onAskCoachWithPrompt={onAskCoachWithPrompt}
          onSetTodayGoal={onSetTodayGoal}
          initialSongName={currentSong}
        />
      )}
    </div>
  );
};
