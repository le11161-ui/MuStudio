import React, { useState, useEffect } from 'react';
import { ChordToolbox } from './ChordToolbox';
import { CircleOfFifths } from './CircleOfFifths';
import { EarTrainer } from './EarTrainer';
import { InteractiveMetronome } from './InteractiveMetronome';
import { ScoreConverter } from './ScoreConverter';
import { ChallengeQuests } from './ChallengeQuests';
import { AiMusicCoach } from './AiMusicCoach';
import { InteractiveTuner } from './InteractiveTuner';
import { Music, Clock, FileText, Award, Disc3, Headphones, BookOpen, Sparkles, Gauge } from 'lucide-react';

export type ToolType = 'chord' | 'circle' | 'tuner' | 'ear' | 'metronome' | 'score' | 'quiz' | 'coach';

interface UnifiedToolboxProps {
  onAskCoachAboutChord?: (chordName: string) => void;
  initialTool?: ToolType;
  coachPrompt?: string;
  onClearCoachPrompt?: () => void;
  onOpenGuide?: () => void;
}

export const UnifiedToolbox: React.FC<UnifiedToolboxProps> = ({
  onAskCoachAboutChord,
  initialTool = 'chord',
  coachPrompt = '',
  onClearCoachPrompt,
  onOpenGuide,
}) => {
  const [activeTool, setActiveTool] = useState<ToolType>(initialTool);
  const [internalCoachPrompt, setInternalCoachPrompt] = useState<string>(coachPrompt);

  useEffect(() => {
    setActiveTool(initialTool);
  }, [initialTool]);

  useEffect(() => {
    if (coachPrompt) {
      setInternalCoachPrompt(coachPrompt);
      setActiveTool('coach');
    }
  }, [coachPrompt]);

  const handleInternalAskCoach = (chordName: string) => {
    if (onAskCoachAboutChord) {
      onAskCoachAboutChord(chordName);
    }
    setInternalCoachPrompt(
      `老師好，我在和弦庫看見了「${chordName}」，請問在流行歌創作中，它最常用在什麼情緒的段落？有什麼推薦的和弦進行搭配嗎？`
    );
    setActiveTool('coach');
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar inside Toolbox */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTool('chord')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === 'chord'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>和弦指法庫</span>
          </button>

          <button
            onClick={() => setActiveTool('circle')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === 'circle'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5 text-amber-400" />
            <span>五度圈轉調盤</span>
          </button>

          <button
            onClick={() => setActiveTool('tuner')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === 'tuner'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-bold'
                : 'text-teal-300 hover:text-white hover:bg-slate-900 border border-teal-500/20'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-teal-400" />
            <span>實時調音器</span>
          </button>

          <button
            onClick={() => setActiveTool('ear')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === 'ear'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>聽音盲測中心</span>
          </button>

          <button
            onClick={() => setActiveTool('metronome')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === 'metronome'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>智慧節拍器</span>
          </button>

          <button
            onClick={() => setActiveTool('score')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === 'score'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>簡譜轉換器</span>
          </button>

          <button
            onClick={() => setActiveTool('quiz')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === 'quiz'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>實戰測驗卷</span>
          </button>

          {/* AI Coach Integrated Sub Tab */}
          <button
            onClick={() => setActiveTool('coach')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === 'coach'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-amber-300 hover:text-white hover:bg-slate-900 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI 個人教練</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 px-2 shrink-0">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              title="查看全站所有功能整理表與按鍵使用指南"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>📖 工具按鍵使用指南</span>
            </button>
          )}
        </div>
      </div>

      {/* Render selected tool */}
      {activeTool === 'chord' && <ChordToolbox onAskCoachAboutChord={handleInternalAskCoach} />}
      {activeTool === 'circle' && <CircleOfFifths />}
      {activeTool === 'tuner' && <InteractiveTuner />}
      {activeTool === 'ear' && <EarTrainer />}
      {activeTool === 'metronome' && <InteractiveMetronome />}
      {activeTool === 'score' && <ScoreConverter />}
      {activeTool === 'quiz' && <ChallengeQuests />}
      {activeTool === 'coach' && (
        <AiMusicCoach
          initialPrompt={internalCoachPrompt}
          onClearInitialPrompt={() => {
            setInternalCoachPrompt('');
            if (onClearCoachPrompt) onClearCoachPrompt();
          }}
        />
      )}
    </div>
  );
};
