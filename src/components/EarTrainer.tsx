import React, { useState, useEffect } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { addXp } from '../utils/profileStorage';
import {
  Volume2,
  Sparkles,
  Flame,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Music,
  Headphones,
  Zap,
} from 'lucide-react';

type TrainingMode = 'pitch' | 'chord' | 'interval';

interface QuestionState {
  targetNote?: string;
  targetChord?: { name: string; type: string; quality: string; notes: string[]; desc: string };
  targetInterval?: { name: string; semitones: number; notes: [string, string]; mnemonic: string };
}

// Single Notes pool
const BASIC_NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const ADVANCED_NOTES = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'];

// Chord Quality pool
const CHORD_QUALITIES = [
  {
    type: 'Major (大三和弦)',
    quality: 'major',
    name: '大三和弦',
    desc: '明亮、開朗、陽光正面',
    generate: (root: string) => {
      const base = audioEngine.noteToFreq(`${root}3`) || 261.63;
      return [base, base * Math.pow(2, 4 / 12), base * Math.pow(2, 7 / 12)];
    },
  },
  {
    type: 'Minor (小三和弦)',
    quality: 'minor',
    name: '小三和弦',
    desc: '憂鬱、抒情、柔和感傷',
    generate: (root: string) => {
      const base = audioEngine.noteToFreq(`${root}3`) || 261.63;
      return [base, base * Math.pow(2, 3 / 12), base * Math.pow(2, 7 / 12)];
    },
  },
  {
    type: 'Dominant 7th (屬七和弦)',
    quality: 'dom7',
    name: '屬七和弦',
    desc: '懸疑、張力、強烈渴望解決回主和弦',
    generate: (root: string) => {
      const base = audioEngine.noteToFreq(`${root}3`) || 261.63;
      return [base, base * Math.pow(2, 4 / 12), base * Math.pow(2, 7 / 12), base * Math.pow(2, 10 / 12)];
    },
  },
  {
    type: 'Diminished (減三和弦)',
    quality: 'dim',
    name: '減三和弦',
    desc: '緊張、驚悚、收縮感強烈',
    generate: (root: string) => {
      const base = audioEngine.noteToFreq(`${root}3`) || 261.63;
      return [base, base * Math.pow(2, 3 / 12), base * Math.pow(2, 6 / 12)];
    },
  },
  {
    type: 'Sus4 (掛留和弦)',
    quality: 'sus4',
    name: 'Sus4 和弦',
    desc: '空靈、漂浮、現代流行過門感',
    generate: (root: string) => {
      const base = audioEngine.noteToFreq(`${root}3`) || 261.63;
      return [base, base * Math.pow(2, 5 / 12), base * Math.pow(2, 7 / 12)];
    },
  },
];

// Intervals pool
const INTERVALS_DATA = [
  { name: '小二度 (半音)', semitones: 1, mnemonic: '經典《大白鯊》海面逼近主題' },
  { name: '大二度 (全音)', semitones: 2, mnemonic: '《Happy Birthday》前兩音 (祝你~)' },
  { name: '小三度', semitones: 3, mnemonic: '抒情名曲《綠袖子》開頭 / 催眠搖籃曲' },
  { name: '大三度', semitones: 4, mnemonic: '童謠《當我們同在一起》開頭 / 學校下課鐘聲' },
  { name: '純四度', semitones: 5, mnemonic: '《婚禮進行曲》叮叮噹 / 國歌「三民主義」前兩音' },
  { name: '純五度', semitones: 7, mnemonic: '《小星星》(一閃一閃) /《星際大戰》主題曲開頭' },
  { name: '純八度', semitones: 12, mnemonic: '《Somewhere Over the Rainbow》前兩音' },
];

export const EarTrainer: React.FC = () => {
  const [mode, setMode] = useState<TrainingMode>('pitch');
  const [isAdvancedNotes, setIsAdvancedNotes] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState>({});
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Stats
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalAttempted, setTotalAttempted] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [earnedXpTotal, setEarnedXpTotal] = useState<number>(0);

  // Initialize new question
  const generateNewQuestion = () => {
    setUserSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);

    if (mode === 'pitch') {
      const pool = isAdvancedNotes ? ADVANCED_NOTES : BASIC_NOTES;
      const target = pool[Math.floor(Math.random() * pool.length)];
      setCurrentQuestion({ targetNote: target });
      playNoteAudio(target);
    } else if (mode === 'chord') {
      const roots = ['C', 'D', 'E', 'F', 'G', 'A'];
      const root = roots[Math.floor(Math.random() * roots.length)];
      const qualityObj = CHORD_QUALITIES[Math.floor(Math.random() * CHORD_QUALITIES.length)];
      setCurrentQuestion({
        targetChord: {
          name: `${root} ${qualityObj.name}`,
          type: qualityObj.type,
          quality: qualityObj.quality,
          notes: [root],
          desc: qualityObj.desc,
        },
      });
      playChordAudio(root, qualityObj);
    } else if (mode === 'interval') {
      const intervalObj = INTERVALS_DATA[Math.floor(Math.random() * INTERVALS_DATA.length)];
      const baseNote = 'C4';
      const baseFreq = audioEngine.noteToFreq(baseNote) || 261.63;
      const targetFreq = baseFreq * Math.pow(2, intervalObj.semitones / 12);
      setCurrentQuestion({
        targetInterval: {
          name: intervalObj.name,
          semitones: intervalObj.semitones,
          notes: [baseNote, 'Target'],
          mnemonic: intervalObj.mnemonic,
        },
      });
      playIntervalAudio(baseFreq, targetFreq);
    }
  };

  const playNoteAudio = (note: string) => {
    setIsPlayingAudio(true);
    const freq = audioEngine.noteToFreq(note);
    if (freq > 0) {
      audioEngine.playPianoNote(freq, 1.2);
    }
    setTimeout(() => setIsPlayingAudio(false), 800);
  };

  const playChordAudio = (root: string, qualityObj: (typeof CHORD_QUALITIES)[0]) => {
    setIsPlayingAudio(true);
    const freqs = qualityObj.generate(root);
    audioEngine.playChord(freqs, true, 1.5);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  const playIntervalAudio = (f1: number, f2: number) => {
    setIsPlayingAudio(true);
    audioEngine.playPianoNote(f1, 0.9, 0);
    audioEngine.playPianoNote(f2, 1.1, 0.5);
    setTimeout(() => setIsPlayingAudio(false), 1600);
  };

  // Play again current question
  const replayCurrentSound = () => {
    if (mode === 'pitch' && currentQuestion.targetNote) {
      playNoteAudio(currentQuestion.targetNote);
    } else if (mode === 'chord' && currentQuestion.targetChord) {
      const qualityObj = CHORD_QUALITIES.find((q) => q.quality === currentQuestion.targetChord?.quality);
      if (qualityObj) {
        playChordAudio(currentQuestion.targetChord.notes[0], qualityObj);
      }
    } else if (mode === 'interval' && currentQuestion.targetInterval) {
      const baseFreq = audioEngine.noteToFreq('C4') || 261.63;
      const targetFreq = baseFreq * Math.pow(2, currentQuestion.targetInterval.semitones / 12);
      playIntervalAudio(baseFreq, targetFreq);
    }
  };

  // Handle user's guess
  const handleAnswer = (choice: string) => {
    if (isAnswered) return;
    setUserSelectedAnswer(choice);
    setIsAnswered(true);
    setTotalAttempted((prev) => prev + 1);

    let correct = false;
    if (mode === 'pitch') {
      correct = choice === currentQuestion.targetNote;
    } else if (mode === 'chord') {
      correct = choice === currentQuestion.targetChord?.quality;
    } else if (mode === 'interval') {
      correct = choice === currentQuestion.targetInterval?.name;
    }

    setIsCorrect(correct);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Award XP
      const awardedXp = 10;
      setEarnedXpTotal((prev) => prev + awardedXp);
      addXp(awardedXp);
    } else {
      setStreak(0);
      // Play target sound so they can hear what the correct one sounds like
      replayCurrentSound();
    }
  };

  useEffect(() => {
    generateNewQuestion();
  }, [mode, isAdvancedNotes]);

  const accuracyRate = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold tracking-wide">
              <Headphones className="w-4 h-4" />
              <span>聽力與音感實戰健身房 · 耳朵聽覺盲測訓練</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              聽力盲測與和弦色彩聽辨 (Ear Training Gym)
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              拋開死背樂理，用耳朵聽出單音高低、和弦的情緒色彩與名曲音程！答對即時累積 XP 提升等級。
            </p>
          </div>

          {/* Gamified Scoreboard */}
          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-mono">命中率</span>
              <span className="text-base font-bold text-emerald-400 font-mono">{accuracyRate}%</span>
              <span className="text-[9px] text-slate-500">
                ({correctCount}/{totalAttempted})
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-mono">連續答對</span>
              <span className="text-base font-bold text-amber-400 font-mono flex items-center justify-center gap-0.5">
                <Flame className="w-4 h-4 text-rose-500 fill-current" />
                <span>{streak}</span>
              </span>
              <span className="text-[9px] text-slate-500">最佳 {bestStreak}</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-mono">已賺取 XP</span>
              <span className="text-base font-bold text-amber-300 font-mono">+{earnedXpTotal}</span>
              <span className="text-[9px] text-emerald-400 font-medium">已同步存檔</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-lg">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('pitch')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'pitch'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 單音盲測 (Pitch)
          </button>
          <button
            onClick={() => setMode('chord')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'chord'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎹 和弦色彩聽辨 (Chords)
          </button>
          <button
            onClick={() => setMode('interval')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'interval'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎵 名曲音程聽辨 (Intervals)
          </button>
        </div>

        {mode === 'pitch' && (
          <div className="flex items-center gap-2 px-3 text-xs text-slate-300">
            <span>難度：</span>
            <button
              onClick={() => setIsAdvancedNotes(false)}
              className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                !isAdvancedNotes
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              白鍵基礎 (C4~C5)
            </button>
            <button
              onClick={() => setIsAdvancedNotes(true)}
              className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                isAdvancedNotes
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              包含黑鍵 (12 半音)
            </button>
          </div>
        )}
      </div>

      {/* Main Testing Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xl text-center">
        {/* Audio Player Trigger Area */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <button
            onClick={replayCurrentSound}
            className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all cursor-pointer shadow-2xl ${
              isPlayingAudio
                ? 'bg-amber-500 border-amber-300 text-slate-950 scale-105 shadow-amber-500/50'
                : 'bg-slate-950 border-amber-500/40 text-amber-400 hover:border-amber-400 hover:bg-slate-900'
            }`}
            title="點擊再聽一次"
          >
            <Volume2 className={`w-8 h-8 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
            <span className="text-[10px] font-bold mt-1">
              {isPlayingAudio ? '播放中...' : '再聽一次'}
            </span>
          </button>
          <div className="text-xs text-slate-400">
            點擊上方按鈕可重複播放題目音頻。聽聽看，這是哪一個？
          </div>
        </div>

        {/* MODE 1: PITCH NOTE CHOICES */}
        {mode === 'pitch' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {(isAdvancedNotes ? ADVANCED_NOTES : BASIC_NOTES).map((note) => {
                const isSelected = userSelectedAnswer === note;
                const isTarget = isAnswered && note === currentQuestion.targetNote;
                const isWrong = isAnswered && isSelected && !isCorrect;

                return (
                  <button
                    key={note}
                    onClick={() => handleAnswer(note)}
                    disabled={isAnswered}
                    className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl border font-mono font-bold text-sm sm:text-base transition-all flex flex-col items-center justify-center gap-1 cursor-pointer disabled:cursor-default ${
                      isTarget
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black scale-105 shadow-lg shadow-emerald-500/30'
                        : isWrong
                          ? 'bg-rose-500 border-rose-400 text-white'
                          : isSelected
                            ? 'bg-amber-500 border-amber-400 text-slate-950'
                            : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-850'
                    }`}
                  >
                    <span>{note}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {note.includes('#') ? '升半音' : '自然音'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 2: CHORD QUALITY CHOICES */}
        {mode === 'chord' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left">
            {CHORD_QUALITIES.map((q) => {
              const isSelected = userSelectedAnswer === q.quality;
              const isTarget = isAnswered && q.quality === currentQuestion.targetChord?.quality;
              const isWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={q.quality}
                  onClick={() => handleAnswer(q.quality)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-xs transition-all flex flex-col justify-between gap-2 cursor-pointer disabled:cursor-default ${
                    isTarget
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500'
                      : isWrong
                        ? 'bg-rose-950/60 border-rose-400 text-rose-200'
                        : isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{q.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{q.type.split(' ')[0]}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{q.desc}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* MODE 3: INTERVALS CHOICES */}
        {mode === 'interval' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
            {INTERVALS_DATA.map((interval) => {
              const isSelected = userSelectedAnswer === interval.name;
              const isTarget = isAnswered && interval.name === currentQuestion.targetInterval?.name;
              const isWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={interval.name}
                  onClick={() => handleAnswer(interval.name)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-xs transition-all flex flex-col justify-between gap-1.5 cursor-pointer disabled:cursor-default ${
                    isTarget
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500'
                      : isWrong
                        ? 'bg-rose-950/60 border-rose-400 text-rose-200'
                        : isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{interval.name}</span>
                    <span className="font-mono text-[10px] text-amber-400">
                      {interval.semitones} 個半音
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1">
                    <span>💡 聯想口訣：</span>
                    <span className="text-slate-300 font-medium">{interval.mnemonic}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* FEEDBACK & NEXT QUESTION BAR */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in ${
              isCorrect
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              {isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {isCorrect ? '太棒了，完全答對！+10 XP' : '答錯了，再接再厲！'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  正確答案是：
                  <strong className="text-white ml-1 font-mono">
                    {mode === 'pitch'
                      ? currentQuestion.targetNote
                      : mode === 'chord'
                        ? currentQuestion.targetChord?.name
                        : currentQuestion.targetInterval?.name}
                  </strong>
                  {mode === 'interval' && currentQuestion.targetInterval && (
                    <span className="ml-2 text-slate-300">
                      ({currentQuestion.targetInterval.mnemonic})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={generateNewQuestion}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 whitespace-nowrap shrink-0"
            >
              下一題 ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
