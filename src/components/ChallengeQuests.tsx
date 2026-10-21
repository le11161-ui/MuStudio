import React, { useState, useEffect } from 'react';
import { Volume2, Award, Zap, CheckCircle2, XCircle, RotateCcw, Clock, Music, Play, Sparkles } from 'lucide-react';
import { EAR_TRAINING_QUESTIONS, RHYTHM_QUIZ_QUESTIONS, SIGHT_READING_NOTES } from '../data/quizDatabase';
import { QuizQuestion } from '../types/music';
import { audioEngine } from '../utils/audioEngine';

export const ChallengeQuests: React.FC = () => {
  const [activeQuizType, setActiveQuizType] = useState<'ear' | 'rhythm' | 'sight'>('ear');

  // Ear Training & Rhythm Quiz State
  const [currentEarIndex, setCurrentEarIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Sight Reading Flashcard State
  const [sightNoteIndex, setSightNoteIndex] = useState<number>(() => Math.floor(Math.random() * SIGHT_READING_NOTES.length));
  const [sightScore, setSightScore] = useState<number>(0);
  const [sightStreak, setSightStreak] = useState<number>(0);
  const [sightTimeLeft, setSightTimeLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [sightFeedback, setSightFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Active Questions set based on tab
  const currentQuestions = activeQuizType === 'ear' ? EAR_TRAINING_QUESTIONS : RHYTHM_QUIZ_QUESTIONS;
  const currentQ = currentQuestions[currentEarIndex % currentQuestions.length];

  // Play audio for current question
  const playCurrentQuestionAudio = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    const payload = currentQ.audioPayload;
    if (payload.frequencies && payload.frequencies.length > 0) {
      if (payload.isChord) {
        audioEngine.playChord(payload.frequencies, false, payload.duration || 1.8);
      } else {
        audioEngine.playPianoNote(payload.frequencies[0], payload.duration || 1.2);
      }
      setTimeout(() => setIsPlayingAudio(false), (payload.duration || 1.2) * 1000 + 100);
    } else if (payload.rhythmPattern) {
      // Play drum rhythm pattern
      payload.rhythmPattern.forEach((item) => {
        audioEngine.playDrumSound(item.sound, item.time);
      });
      const maxTime = Math.max(...payload.rhythmPattern.map(p => p.time));
      setTimeout(() => setIsPlayingAudio(false), (maxTime + 0.6) * 1000);
    }
  };

  const handleSelectAnswer = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(s => s + 100 + streak * 20);
      setStreak(st => st + 1);
      audioEngine.playPianoNote(523.25, 0.4); // C5 cheerful bell
    } else {
      setStreak(0);
      audioEngine.playPianoNote(185.0, 0.5); // low buzz
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentEarIndex(i => (i + 1) % currentQuestions.length);
  };

  // Sight Reading Timer
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && sightTimeLeft > 0) {
      interval = window.setInterval(() => {
        setSightTimeLeft(t => t - 1);
      }, 1000);
    } else if (sightTimeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, sightTimeLeft]);

  const handleSightAnswer = (key: string) => {
    const currentSight = SIGHT_READING_NOTES[sightNoteIndex];
    const isCorrect = currentSight.key === key;

    // Play note sound
    audioEngine.playPianoNote(audioEngine.noteToFreq(currentSight.note), 0.6);

    if (isCorrect) {
      setSightScore(s => s + 10);
      setSightStreak(st => st + 1);
      setSightFeedback('correct');
    } else {
      setSightStreak(0);
      setSightFeedback('wrong');
    }

    setTimeout(() => {
      setSightFeedback(null);
      // Pick next random note different from current
      let nextIdx = Math.floor(Math.random() * SIGHT_READING_NOTES.length);
      if (nextIdx === sightNoteIndex) nextIdx = (nextIdx + 1) % SIGHT_READING_NOTES.length;
      setSightNoteIndex(nextIdx);
    }, 280);
  };

  return (
    <div className="space-y-8">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">自主挑戰與實戰測驗卷</h2>
          <p className="text-sm text-slate-400 mt-1">
            不是死記考卷，而是訓練耳朵與雙手的實戰音樂關卡。
          </p>
        </div>

        {/* 3 Quiz Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {[
            { id: 'ear', label: '👂 聽力音感挑戰' },
            { id: 'rhythm', label: '🥁 節奏大考驗' },
            { id: 'sight', label: '⚡ 視奏快刷測驗' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveQuizType(tab.id as any);
                setIsAnswered(false);
                setSelectedOption(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeQuizType === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode A & B: Ear Training / Rhythm Quiz */}
      {activeQuizType !== 'sight' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-mono font-bold">
                關卡 {currentEarIndex + 1} / {currentQuestions.length}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">
                {activeQuizType === 'ear' ? '音高唱名與和弦明暗色彩判定' : '鼓點節奏型態與切分拍號'}
              </span>
            </div>

            <div className="flex items-center gap-4 font-mono tabular-nums">
              <span className="text-slate-400">
                得分：<strong className="text-white text-sm">{score}</strong>
              </span>
              <span className="text-amber-400 font-bold">
                連擊 Streak: {streak}🔥
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {currentQ.question}
            </h3>
            <p className="text-xs text-slate-400">{currentQ.hint}</p>
          </div>

          {/* Play Audio Trigger Button */}
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-3 text-center">
            <button
              onClick={playCurrentQuestionAudio}
              disabled={isPlayingAudio}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 hover:scale-105 active:scale-95 text-slate-950 flex items-center justify-center transition-transform shadow-xl shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <span className="text-xs text-amber-300 font-medium">
              {isPlayingAudio ? '正在播放音訊中...' : '點擊聆聽測驗題目聲音'}
            </span>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt) => {
              const isChosen = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-300';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectAnswer(opt)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-sm font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isAnswered && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner & Next Question Button */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in">
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-amber-400 block mb-1">💡 導師解析：</strong>
                {currentQ.explanation}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
                >
                  <span>進入下一題</span>
                  <Zap className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode C: Sight Reading Speed Challenge (視奏快刷測驗) */}
      {activeQuizType === 'sight' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Header Strip */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-mono font-bold">視奏極限挑戰</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">看懂音符幾何位置，按下對應英文字母</span>
            </div>

            <div className="flex items-center gap-4 font-mono tabular-nums">
              <span className="text-slate-400">
                答對：<strong className="text-emerald-400 text-sm">{sightScore / 10} 題</strong>
              </span>
              <span className="text-amber-400 font-bold">
                連擊 Streak: {sightStreak}🔥
              </span>
              <span className="text-slate-300 flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {sightTimeLeft}s
              </span>
            </div>
          </div>

          {/* Stave Flashcard Viewport */}
          <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Visual Flash Feedback */}
            {sightFeedback === 'correct' && (
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none transition-opacity" />
            )}
            {sightFeedback === 'wrong' && (
              <div className="absolute inset-0 bg-rose-500/10 pointer-events-none transition-opacity" />
            )}

            {/* SVG Single Stave Note */}
            <svg width="260" height="150" viewBox="0 0 260 150" className="select-none">
              {/* 5 Staff lines */}
              {[24, 38, 52, 66, 80].map((y, idx) => (
                <line key={idx} x1="20" y1={y} x2="240" y2={y} stroke="#475569" strokeWidth="2" />
              ))}

              {/* Treble Clef */}
              <text x="30" y="74" fontSize="56" fill="#f59e0b" fontFamily="serif">
                𝄞
              </text>

              {/* Current Random Notehead */}
              {(() => {
                const currentNote = SIGHT_READING_NOTES[sightNoteIndex];
                const noteY = 24 + currentNote.staffPos * 7;
                const noteX = 140;
                const needsLedger = noteY >= 94 || noteY <= 17;
                const stemDown = noteY <= 52;

                return (
                  <g>
                    {needsLedger && (
                      <line x1={noteX - 16} y1="94" x2={noteX + 16} y2="94" stroke="#64748b" strokeWidth="2" />
                    )}
                    <ellipse
                      cx={noteX}
                      cy={noteY}
                      rx="8"
                      ry="6"
                      fill="#f59e0b"
                      transform={`rotate(-25 ${noteX} ${noteY})`}
                    />
                    <line
                      x1={stemDown ? noteX - 7 : noteX + 7}
                      y1={noteY}
                      x2={stemDown ? noteX - 7 : noteX + 7}
                      y2={stemDown ? noteY + 36 : noteY - 36}
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                  </g>
                );
              })()}
            </svg>

            <span className="text-xs text-slate-400 mt-2 font-mono">
              請快速輸入下方音名按鍵
            </span>
          </div>

          {/* Note Answer Buttons: C, D, E, F, G, A, B */}
          <div className="grid grid-cols-7 gap-2">
            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  if (!isTimerRunning && sightTimeLeft === 60) {
                    setIsTimerRunning(true);
                  }
                  handleSightAnswer(letter);
                }}
                className="py-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-white font-mono font-bold text-lg active:scale-95 transition-all cursor-pointer shadow-md"
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Timer and Reset Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              點擊任一字母將自動啟動 60 秒計時！
            </span>
            <button
              onClick={() => {
                setSightTimeLeft(60);
                setSightScore(0);
                setSightStreak(0);
                setIsTimerRunning(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新開始 60s 挑戰</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
