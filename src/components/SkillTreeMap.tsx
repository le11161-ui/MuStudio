import React, { useState } from 'react';
import { CheckCircle2, Play, Volume2, Sparkles, ArrowRight, Award, Compass, Music, BookOpen, ChevronRight, X } from 'lucide-react';
import { SKILL_TREE_DATA } from '../data/skillTreeData';
import { InstrumentCategory, SkillNode } from '../types/music';
import { audioEngine } from '../utils/audioEngine';

import pianoImg from '../assets/images/piano_learning_keys_1792073383565.jpg';
import guitarImg from '../assets/images/guitar_fretboard_wood_1792073384881.jpg';
import drumsImg from '../assets/images/drums_rhythm_kit_1792073385628.jpg';
import dtmImg from '../assets/images/dtm_audio_production_1792073385698.jpg';

interface SkillTreeMapProps {
  onAskCoachAboutSkill: (skillTitle: string, question: string) => void;
  onNavigateToSynergy?: () => void;
}

const TRACK_CONFIG: Record<
  InstrumentCategory,
  { label: string; instrument: string; subtitle: string; image: string; icon: string }
> = {
  piano: {
    label: '流行 / 古典鋼琴',
    instrument: 'Piano & Keyboard',
    subtitle: '從五線譜空間幾何、流行 4 和弦到雙手流暢合奏',
    image: pianoImg,
    icon: '🎹'
  },
  guitar: {
    label: '民謠吉他 / 烏克麗麗',
    instrument: 'Guitar & Ukulele',
    subtitle: '六線 TAB 快速識譜、克服 F 封閉和弦到動感指彈',
    image: guitarImg,
    icon: '🎸'
  },
  drums: {
    label: '爵士鼓 & 律動節奏',
    instrument: 'Drums & Percussion',
    subtitle: '肢體協調、8 拍搖滾律動、切分音符與震撼過門',
    image: drumsImg,
    icon: '🥁'
  },
  dtm: {
    label: '數位音樂創作 (DTM / 詞曲)',
    instrument: 'Songwriting & DAW',
    subtitle: '作曲黃金結構、王道和弦色彩、MIDI 編曲與填詞律動',
    image: dtmImg,
    icon: '🎛️'
  }
};

export const SkillTreeMap: React.FC<SkillTreeMapProps> = ({
  onAskCoachAboutSkill,
  onNavigateToSynergy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InstrumentCategory>('piano');
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mustudio_completed_milestones');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const currentTrack = TRACK_CONFIG[selectedCategory];
  const nodes = SKILL_TREE_DATA[selectedCategory] || [];

  const toggleMilestone = (key: string) => {
    const next = { ...completedMilestones, [key]: !completedMilestones[key] };
    setCompletedMilestones(next);
    try {
      localStorage.setItem('mustudio_completed_milestones', JSON.stringify(next));
    } catch (e) {
      console.warn(e);
    }
  };

  const playAudioDemo = (node: SkillNode) => {
    if (isPlayingDemo) return;
    setIsPlayingDemo(true);

    if (node.audioDemoNotes && node.audioDemoNotes.length > 0) {
      const sequence = node.audioDemoNotes.map(n => ({
        freq: n.freq,
        durationSeconds: n.duration,
        label: n.note
      }));
      audioEngine.playScoreSequence(sequence, undefined, () => {
        setIsPlayingDemo(false);
      });
    } else if (node.category === 'piano') {
      audioEngine.playChord([261.63, 329.63, 392.0, 523.25], true, 1.5, false);
      setTimeout(() => setIsPlayingDemo(false), 1600);
    } else if (node.category === 'guitar') {
      audioEngine.playChord([196.0, 246.94, 293.66, 392.0], true, 1.6, true);
      setTimeout(() => setIsPlayingDemo(false), 1700);
    } else if (node.category === 'drums') {
      audioEngine.playDrumSound('kick', 0);
      audioEngine.playDrumSound('hihat', 0);
      audioEngine.playDrumSound('snare', 0.4);
      audioEngine.playDrumSound('hihat', 0.4);
      audioEngine.playDrumSound('kick', 0.8);
      audioEngine.playDrumSound('hihat', 0.8);
      audioEngine.playDrumSound('snare', 1.2);
      audioEngine.playDrumSound('hihat', 1.2);
      setTimeout(() => setIsPlayingDemo(false), 1500);
    } else {
      // DTM chords: Fmaj7 -> G7 -> Em7 -> Am7
      audioEngine.playChord([174.61, 220.0, 261.63, 329.63], true, 1.2);
      setTimeout(() => {
        audioEngine.playChord([196.0, 246.94, 293.66, 349.23], true, 1.2);
      }, 700);
      setTimeout(() => setIsPlayingDemo(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Segmented Controller (Buttons with explicit active states) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">主題式技能路線圖</h2>
          <p className="text-sm text-slate-400 mt-1">
            拋棄死記硬背，以目標實戰為中心；每一步皆配有發聲示範與引導練習。
          </p>
        </div>

        {/* 4 Track Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
          {(Object.keys(TRACK_CONFIG) as InstrumentCategory[]).map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <span>{TRACK_CONFIG[cat].icon}</span>
                <span>{TRACK_CONFIG[cat].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Track Spotlight Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="p-6 md:p-8 md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
              <span>{currentTrack.instrument}</span>
              <span aria-hidden="true">·</span>
              <span>4 大漸進式里程碑</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{currentTrack.label} 學習路線</h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              {currentTrack.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span>點擊下方任何節點檢視核心概念與音訊示範</span>
              {onNavigateToSynergy && (
                <>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={onNavigateToSynergy}
                    className="text-amber-400 hover:text-amber-300 font-medium underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>⚡ 哪兩個技能搭配學最快？查看弱項補強指南</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="md:col-span-4 h-44 md:h-full relative overflow-hidden">
            <img
              src={currentTrack.image}
              alt={currentTrack.label}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* 4 Progressive Stages Visual Tree */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {nodes.map((node, idx) => {
          const completedCount = node.milestones.filter(
            (_, mIdx) => completedMilestones[`${node.id}-${mIdx}`]
          ).length;
          const isAllCompleted = completedCount === node.milestones.length;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="group relative rounded-xl p-5 border border-slate-800/90 bg-slate-900/70 hover:bg-slate-900 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-amber-400/90 font-mono font-semibold">
                    {node.stageTitle}
                  </span>
                  <span className="text-slate-400 text-[11px] px-2 py-0.5 rounded bg-slate-800/80">
                    {node.level}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {node.title}
                </h4>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {node.subtitle}
                </p>
              </div>

              {/* Footer Progress & Action */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      isAllCompleted ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <span className="font-mono tabular-nums">
                    {completedCount}/{node.milestones.length}
                  </span>
                  <span>達成</span>
                </div>

                <span className="text-amber-400 text-xs font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  進入練習
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Interactive Modal / Drawer */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
                  <span>{selectedNode.stageTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedNode.level}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedNode.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {selectedNode.subtitle}
                </p>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {selectedNode.description}
            </div>

            {/* Key Concept Box */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200 leading-relaxed">
              <strong className="text-amber-300 font-semibold block mb-1">💡 核心樂理觀念：</strong>
              {selectedNode.keyConcept}
            </div>

            {/* Audio Demo Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => playAudioDemo(selectedNode)}
                  disabled={isPlayingDemo}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingDemo ? '正在播放中...' : '聆聽概念聲音示範'}</span>
                </button>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Web Audio 即時聲學合成
                </span>
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">實戰訓練檢核點 (點擊勾選記錄肌肉記憶)：</h4>
              <div className="space-y-2">
                {selectedNode.milestones.map((m, mIdx) => {
                  const key = `${selectedNode.id}-${mIdx}`;
                  const isChecked = !!completedMilestones[key];
                  return (
                    <div
                      key={mIdx}
                      onClick={() => toggleMilestone(key)}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer text-xs sm:text-sm ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span>{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Practical Tips */}
            {selectedNode.tips.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">導師私房避坑訣竅：</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedNode.tips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Coach Action Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                卡在練習環節或左右手互卡？
              </span>
              <button
                onClick={() => {
                  const title = selectedNode.title;
                  setSelectedNode(null);
                  onAskCoachAboutSkill(
                    title,
                    `老師好，我在練習「${title}」時遇到瓶頸，請用拋磚引玉的方式引導我如何循序漸進突破！`
                  );
                }}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>向 AI 音樂教練請教此關卡</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
