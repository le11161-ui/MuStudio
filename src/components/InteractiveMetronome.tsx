import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Plus, Minus, Volume2, Target, RotateCcw, Activity } from 'lucide-react';
import { TimeSignature, Subdivision } from '../types/music';
import { audioEngine } from '../utils/audioEngine';

export const InteractiveMetronome: React.FC = () => {
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [subdivision, setSubdivision] = useState<Subdivision>('quarter');
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  // Tap Tempo state
  const tapTimesRef = useRef<number[]>([]);
  const [tapDisplay, setTapDisplay] = useState<string>('點擊測速');

  // Rhythm Accuracy Challenge state
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testPhase, setTestPhase] = useState<'idle' | 'count_in' | 'testing' | 'result'>('idle');
  const [testBeatsLeft, setTestBeatsLeft] = useState<number>(8);
  const [accuracyResults, setAccuracyResults] = useState<{ offsetMs: number; rating: '完美' | '略快' | '略慢' | '脫靶' }[]>([]);

  // Web Audio Scheduling Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  const beatCountRef = useRef<number>(0);

  const beatsPerMeasure = timeSignature === '4/4' ? 4 : timeSignature === '3/4' ? 3 : timeSignature === '2/4' ? 2 : 6;

  // Tap Tempo Handler
  const handleTapTempo = () => {
    const now = performance.now();
    const taps = tapTimesRef.current;

    // Reset if more than 2.5 seconds since last tap
    if (taps.length > 0 && now - taps[taps.length - 1] > 2500) {
      taps.length = 0;
    }

    taps.push(now);
    if (taps.length > 5) taps.shift();

    if (taps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 30 && calculatedBpm <= 260) {
        setBpm(calculatedBpm);
        setTapDisplay(`${calculatedBpm} BPM`);
      }
    } else {
      setTapDisplay('繼續點擊...');
    }
  };

  // Metronome Sound Engine Loop
  const scheduleNote = (beatNumber: number, time: number) => {
    const isAccent = beatNumber % beatsPerMeasure === 0;
    const ctx = audioEngine.getContext();
    const relativeTime = Math.max(0, time - ctx.currentTime);
    audioEngine.playClick(isAccent, relativeTime);

    // Schedule visual beat
    setTimeout(() => {
      setCurrentBeat(beatNumber % beatsPerMeasure);
    }, Math.max(0, (time - ctx.currentTime) * 1000));
  };

  const scheduler = () => {
    const ctx = audioEngine.getContext();
    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      scheduleNote(beatCountRef.current, nextNoteTimeRef.current);

      // Compute step interval based on subdivision
      let secondsPerBeat = 60.0 / bpm;
      if (subdivision === 'eighth') secondsPerBeat /= 2;
      else if (subdivision === 'sixteenth') secondsPerBeat /= 4;
      else if (subdivision === 'triplet') secondsPerBeat /= 3;

      nextNoteTimeRef.current += secondsPerBeat;
      beatCountRef.current++;
    }
    timerIDRef.current = window.setTimeout(scheduler, 25);
  };

  const startMetronome = () => {
    const ctx = audioEngine.getContext();
    nextNoteTimeRef.current = ctx.currentTime + 0.05;
    beatCountRef.current = 0;
    setIsPlaying(true);
    scheduler();
  };

  const stopMetronome = () => {
    if (timerIDRef.current) {
      clearTimeout(timerIDRef.current);
      timerIDRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  };

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
    return () => {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
    };
  }, [bpm, timeSignature, subdivision]);

  // Rhythm Accuracy Challenge
  const targetBeatTimeRef = useRef<number>(0);
  const handleStartRhythmTest = () => {
    setIsTesting(true);
    setTestPhase('count_in');
    setAccuracyResults([]);
    setTestBeatsLeft(8);

    if (!isPlaying) startMetronome();

    // 4 beats count-in then start collecting taps
    setTimeout(() => {
      setTestPhase('testing');
    }, (60 / bpm) * 4 * 1000);
  };

  const handleTestTap = () => {
    if (testPhase !== 'testing') return;

    const ctx = audioEngine.getContext();
    const tapTime = ctx.currentTime;
    const secondsPerBeat = 60 / bpm;

    // Calculate nearest beat
    const timeSinceStart = tapTime - (nextNoteTimeRef.current - secondsPerBeat * beatCountRef.current);
    const closestBeatIndex = Math.round(timeSinceStart / secondsPerBeat);
    const idealBeatTime = closestBeatIndex * secondsPerBeat;
    const diffMs = Math.round((timeSinceStart - idealBeatTime) * 1000);

    let rating: '完美' | '略快' | '略慢' | '脫靶' = '完美';
    if (Math.abs(diffMs) <= 25) rating = '完美';
    else if (diffMs < -25 && diffMs > -70) rating = '略快';
    else if (diffMs > 25 && diffMs < 70) rating = '略慢';
    else rating = '脫靶';

    setAccuracyResults(prev => [...prev, { offsetMs: diffMs, rating }]);

    setTestBeatsLeft(prev => {
      if (prev <= 1) {
        setTestPhase('result');
        return 0;
      }
      return prev - 1;
    });
  };

  // Keyboard Spacebar listener for Tap Tempo & Rhythm Test
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        if (testPhase === 'testing') {
          handleTestTap();
        } else {
          handleTapTempo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testPhase, bpm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">智慧節拍器 & 節奏準心儀</h2>
        <p className="text-sm text-slate-400 mt-1">
          高精準度 Web Audio 時鐘合成，支援多種切分音型態與跟拍準心挑戰。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Metronome Main Console */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* BPM Display & Dial */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-extrabold text-white font-mono tabular-nums tracking-tighter">
                {bpm}
              </span>
              <span className="text-sm font-bold text-amber-400 font-mono">BPM</span>
            </div>

            {/* Visual Beat Indicator Dots */}
            <div className="flex items-center gap-3 pt-2">
              {Array.from({ length: beatsPerMeasure }).map((_, idx) => {
                const isActive = isPlaying && currentBeat === idx;
                const isDownbeat = idx === 0;

                return (
                  <div
                    key={idx}
                    className={`transition-all duration-75 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      isActive
                        ? isDownbeat
                          ? 'w-10 h-10 bg-amber-400 text-slate-950 scale-110 shadow-lg shadow-amber-400/30'
                          : 'w-8 h-8 bg-amber-200 text-slate-950 scale-105'
                        : 'w-7 h-7 bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BPM Slider with Increment Buttons */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setBpm(b => Math.max(30, b - 1))}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="range"
                min="30"
                max="240"
                value={bpm}
                onChange={e => setBpm(parseInt(e.target.value, 10))}
                className="flex-1 accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              <button
                onClick={() => setBpm(b => Math.min(240, b + 1))}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick BPM Presets */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              {[
                { label: '慢板 Largo', val: 56 },
                { label: '行板 Andante', val: 80 },
                { label: '中板 Moderato', val: 108 },
                { label: '快板 Allegro', val: 132 },
                { label: '急板 Presto', val: 168 }
              ].map(preset => (
                <button
                  key={preset.val}
                  onClick={() => setBpm(preset.val)}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {preset.label} ({preset.val})
                </button>
              ))}
            </div>
          </div>

          {/* Primary Play & Tap Controls */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => (isPlaying ? stopMetronome() : startMetronome())}
              className={`py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? '停止節拍器' : '啟動節拍器'}</span>
            </button>

            <button
              onClick={handleTapTempo}
              className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>{tapDisplay} (可按空白鍵)</span>
            </button>
          </div>

          {/* Time Signature & Subdivision Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            {/* Time Signature */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">拍號設定：</label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                {(['4/4', '3/4', '2/4', '6/8'] as TimeSignature[]).map(ts => (
                  <button
                    key={ts}
                    onClick={() => setTimeSignature(ts)}
                    className={`py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer ${
                      timeSignature === ts
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ts}
                  </button>
                ))}
              </div>
            </div>

            {/* Subdivisions */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">音符細分：</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                {[
                  { id: 'quarter', label: '四分音符' },
                  { id: 'eighth', label: '八分音符' },
                  { id: 'triplet', label: '三連音' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSubdivision(s.id as Subdivision)}
                    className={`py-1 rounded transition-colors cursor-pointer ${
                      subdivision === s.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rhythm Accuracy Challenge (節奏準心測驗) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>節奏準心度實戰測驗</span>
              </h3>
              <span className="text-xs text-slate-400">毫秒級檢測</span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              許多學生「以為自己跟上了節拍」，但實際上有微小的搶拍或拖拍。按下開始後，節拍器將倒數 4 拍，請跟隨拍點按下空白鍵或點擊按鈕，測量你的體內節奏時鐘！
            </p>

            {/* Active Challenge Box */}
            <div className="mt-5 p-5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4">
              {testPhase === 'idle' && (
                <div className="py-4 space-y-2">
                  <div className="text-sm font-semibold text-white">準備好挑戰了嗎？</div>
                  <div className="text-xs text-slate-400">目前設定速度：{bpm} BPM</div>
                </div>
              )}

              {testPhase === 'count_in' && (
                <div className="py-4 space-y-2 animate-pulse">
                  <div className="text-base font-bold text-amber-400">預備倒數中...</div>
                  <div className="text-xs text-slate-400">聆聽 4 拍後開始跟敲！</div>
                </div>
              )}

              {testPhase === 'testing' && (
                <div className="space-y-3">
                  <div className="text-xs text-emerald-400 font-bold">請敲擊拍點！剩餘 {testBeatsLeft} 拍</div>
                  <button
                    onClick={handleTestTap}
                    className="w-full py-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-lg active:scale-95 transition-transform shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    點擊或按空白鍵 TAP!
                  </button>
                </div>
              )}

              {testPhase === 'result' && (
                <div className="space-y-3 text-left">
                  <div className="text-center font-bold text-amber-400 text-base">測驗完成！</div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">完美拍點 (±25ms)</span>
                      <span className="text-emerald-400 font-bold text-sm tabular-nums">
                        {accuracyResults.filter(r => r.rating === '完美').length} 次
                      </span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">平均誤差</span>
                      <span className="text-amber-400 font-bold text-sm tabular-nums">
                        {Math.round(
                          accuracyResults.reduce((acc, curr) => acc + Math.abs(curr.offsetMs), 0) /
                            (accuracyResults.length || 1)
                        )}{' '}
                        ms
                      </span>
                    </div>
                  </div>

                  {/* Feedback verdict */}
                  <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300">
                    💡 導師回饋：
                    {accuracyResults.filter(r => r.rating === '完美').length >= 6
                      ? ' 卓越！你的體內時鐘穩定度堪比專業錄音室鼓手！'
                      : ' 有些許搶拍傾向，建議先以慢速 70 BPM 搭配腳尖點拍練習。'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test Action Button */}
          <div>
            {testPhase === 'result' ? (
              <button
                onClick={() => {
                  setTestPhase('idle');
                  setAccuracyResults([]);
                }}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>再次測試</span>
              </button>
            ) : testPhase === 'idle' ? (
              <button
                onClick={handleStartRhythmTest}
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md shadow-amber-500/10"
              >
                開始 8 拍精準度測驗
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
