import React, { useState } from 'react';
import {
  Zap,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Flame,
  Search,
  Volume2
} from 'lucide-react';
import { SKILL_SYNERGY_LIST, SkillSynergyItem } from '../data/skillSynergyData';

interface SkillSynergyMatrixProps {
  onNavigateToTab: (tab: string) => void;
  onAskCoachWithPrompt: (prompt: string) => void;
}

export const SkillSynergyMatrix: React.FC<SkillSynergyMatrixProps> = ({
  onNavigateToTab,
  onAskCoachWithPrompt,
}) => {
  const [selectedSynergyId, setSelectedSynergyId] = useState<string>('piano-chords');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [customComboInput, setCustomComboInput] = useState<string>('');

  const activeItem =
    SKILL_SYNERGY_LIST.find((s) => s.id === selectedSynergyId) || SKILL_SYNERGY_LIST[0];

  const filteredList =
    selectedFilter === 'all'
      ? SKILL_SYNERGY_LIST
      : SKILL_SYNERGY_LIST.filter((s) => s.category === selectedFilter);

  const handleCustomInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customComboInput.trim()) return;

    onAskCoachWithPrompt(
      `老師好，我目前想把「${customComboInput}」這兩項技能搭配一起練，請問以音樂學習的生理與和聲原理，它們之間最常見的互卡弱項是什麼？該如何安排每日練習的黃金搭配比例？`
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              技能搭配與弱項補強指南
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
              Synergy & Weakness Booster
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            單練一項技能往往事倍功半！了解「哪兩項技能搭在一起進步最快」，並對症下藥修復隱形弱點。
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'all', label: '全部技能' },
            { id: 'piano', label: '🎹 鋼琴' },
            { id: 'guitar', label: '🎸 吉他' },
            { id: 'drums', label: '🥁 爵士鼓' },
            { id: 'dtm', label: '🎛️ DTM' },
            { id: 'general', label: '⚡ 視奏' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedFilter === filter.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {filteredList.map((item) => {
          const isSelected = item.id === selectedSynergyId;

          return (
            <button
              key={item.id}
              onClick={() => setSelectedSynergyId(item.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                  {item.categoryLabel}
                </span>
              </div>

              <div
                className={`text-xs font-bold line-clamp-2 leading-tight ${
                  isSelected ? 'text-amber-300' : 'text-slate-200'
                }`}
              >
                {item.primarySkill}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Synergy Showcase Board */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Active Skill Title Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>{activeItem.categoryLabel} 核心課題</span>
              <span aria-hidden="true">·</span>
              <span>協同增益指數 {activeItem.bestPairing.synergyScore}%</span>
            </div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2.5">
              <span>{activeItem.icon}</span>
              <span>{activeItem.primarySkill}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{activeItem.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab(activeItem.targetToolTab)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{activeItem.targetToolLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onAskCoachWithPrompt(activeItem.coachPrompt)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>諮詢 AI 教練突破錦囊</span>
            </button>
          </div>
        </div>

        {/* Dual Cards: 1. Best Synergy Pairing vs 2. Hidden Weakness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Box 1: Best Pairing */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-950 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Zap className="w-4 h-4" />
                <span>最強黃金搭配技能 (Best Pairing)</span>
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                增益率 +{activeItem.bestPairing.synergyScore}%
              </span>
            </div>

            <h4 className="text-lg font-extrabold text-white">
              {activeItem.bestPairing.skillName}
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeItem.bestPairing.whyPair}
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs text-emerald-200">
              💡 協同效應原理：雙技能交疊練習能同時刺激大腦的不同聽覺與肌肉迴路，打破單項練習時產生的肌肉疲勞與盲點！
            </div>
          </div>

          {/* Box 2: Hidden Weakness To Strengthen */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/30 to-slate-950 border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4" />
                <span>最常見的致命隱形弱項 (Hidden Weakness)</span>
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                危險級別：{activeItem.hiddenWeakness.dangerLevel}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs text-rose-300 font-semibold">【典型卡關症狀】</div>
              <p className="text-xs sm:text-sm text-white font-medium">
                {activeItem.hiddenWeakness.symptom}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-xs text-slate-400 font-semibold">【根本盲點根源】</div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeItem.hiddenWeakness.rootCause}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Step Actionable Routine */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>每日 15 分鐘三步協同突破日常 (Prescribed Routine)</span>
            </h4>
            <span className="text-xs font-mono text-amber-400">
              每日僅需 {activeItem.remedyRoutine.dailyMinutes} 分鐘
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="text-amber-400 font-mono font-bold text-sm">步驟 01 · 拆解定位</div>
              <p className="text-slate-300 leading-relaxed">{activeItem.remedyRoutine.step1}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="text-amber-400 font-mono font-bold text-sm">步驟 02 · 節奏鎖定</div>
              <p className="text-slate-300 leading-relaxed">{activeItem.remedyRoutine.step2}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="text-amber-400 font-mono font-bold text-sm">步驟 03 · 極限拼裝</div>
              <p className="text-slate-300 leading-relaxed">{activeItem.remedyRoutine.step3}</p>
            </div>
          </div>
        </div>

        {/* Custom Combo Question Form */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>自定義雙技能搭配健檢：想知道其他兩種技能怎麼配？</span>
          </div>

          <form onSubmit={handleCustomInquiry} className="flex gap-2">
            <input
              type="text"
              value={customComboInput}
              onChange={(e) => setCustomComboInput(e.target.value)}
              placeholder="例如：我想同時練習「吉他自彈自唱」和「切分音」，容易犯什麼錯？"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-md shadow-amber-500/10"
            >
              向教練問診
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
