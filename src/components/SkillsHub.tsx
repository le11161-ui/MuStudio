import React, { useState } from 'react';
import { SkillTreeMap } from './SkillTreeMap';
import { SkillSynergyMatrix } from './SkillSynergyMatrix';
import { Compass, Zap, Sparkles } from 'lucide-react';

interface SkillsHubProps {
  onAskCoachAboutSkill: (skillTitle: string, question: string) => void;
  onAskCoachWithPrompt: (prompt: string) => void;
  onNavigateToTab: (tab: string) => void;
  initialSubTab?: 'map' | 'synergy';
}

export const SkillsHub: React.FC<SkillsHubProps> = ({
  onAskCoachAboutSkill,
  onAskCoachWithPrompt,
  onNavigateToTab,
  initialSubTab = 'map',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'synergy'>(initialSubTab);

  return (
    <div className="space-y-6">
      {/* Sub switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('map')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>樂理與技能路線圖</span>
          </button>

          <button
            onClick={() => setActiveSubTab('synergy')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'synergy'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>技能最佳搭配與弱項補強</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 px-2">
          <span>切換技能地圖與搭配矩陣</span>
        </div>
      </div>

      {/* Render sub components */}
      {activeSubTab === 'map' ? (
        <SkillTreeMap
          onAskCoachAboutSkill={onAskCoachAboutSkill}
          onNavigateToSynergy={() => setActiveSubTab('synergy')}
        />
      ) : (
        <SkillSynergyMatrix
          onNavigateToTab={onNavigateToTab}
          onAskCoachWithPrompt={onAskCoachWithPrompt}
        />
      )}
    </div>
  );
};
