import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  Gauge,
  Sliders,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export type TunerInstrument = 'guitar' | 'ukulele' | 'violin' | 'bass' | 'chromatic';

interface InstrumentPreset {
  id: TunerInstrument;
  name: string;
  icon: string;
  strings: { label: string; note: string; octave: number; freq: number }[];
}

const INSTRUMENTS: InstrumentPreset[] = [
  {
    id: 'guitar',
    name: '民謠/電吉他',
    icon: '🎸',
    strings: [
      { label: '6 弦', note: 'E', octave: 2, freq: 82.41 },
      { label: '5 弦', note: 'A', octave: 2, freq: 110.0 },
      { label: '4 弦', note: 'D', octave: 3, freq: 146.83 },
      { label: '3 弦', note: 'G', octave: 3, freq: 196.0 },
      { label: '2 弦', note: 'B', octave: 3, freq: 246.94 },
      { label: '1 弦', note: 'E', octave: 4, freq: 329.63 },
    ],
  },
  {
    id: 'ukulele',
    name: '烏克麗麗',
    icon: '🌴',
    strings: [
      { label: '4 弦', note: 'G', octave: 4, freq: 392.0 },
      { label: '3 弦', note: 'C', octave: 4, freq: 261.63 },
      { label: '2 弦', note: 'E', octave: 4, freq: 329.63 },
      { label: '1 弦', note: 'A', octave: 4, freq: 440.0 },
    ],
  },
  {
    id: 'violin',
    name: '小提琴',
    icon: '🎻',
    strings: [
      { label: '4 弦', note: 'G', octave: 3, freq: 196.0 },
      { label: '3 弦', note: 'D', octave: 4, freq: 293.66 },
      { label: '2 弦', note: 'A', octave: 4, freq: 440.0 },
      { label: '1 弦', note: 'E', octave: 5, freq: 659.25 },
    ],
  },
  {
    id: 'bass',
    name: '電貝斯',
    icon: '⚡',
    strings: [
      { label: '4 弦', note: 'E', octave: 1, freq: 41.2 },
      { label: '3 弦', note: 'A', octave: 1, freq: 55.0 },
      { label: '2 弦', note: 'D', octave: 2, freq: 73.42 },
      { label: '1 弦', note: 'G', octave: 2, freq: 98.0 },
    ],
  },
  {
    id: 'chromatic',
    name: '全音域半音階 (管弦/歌聲)',
    icon: '🌈',
    strings: [],
  },
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const InteractiveTuner: React.FC = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<TunerInstrument>('guitar');
  const [selectedStringIndex, setSelectedStringIndex] = useState<number | null>(null);
  const [a4Calibration, setA4Calibration] = useState<number>(440);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [detectedPitch, setDetectedPitch] = useState<number | null>(null);
  const [detectedNote, setDetectedNote] = useState<string>('--');
  const [detectedOctave, setDetectedOctave] = useState<number | null>(null);
  const [centsDiff, setCentsDiff] = useState<number>(0);
  const [targetFreq, setTargetFreq] = useState<number | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [clarity, setClarity] = useState<number>(0);
  const [playingToneNote, setPlayingToneNote] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentPreset = INSTRUMENTS.find((inst) => inst.id === selectedInstrument) || INSTRUMENTS[0];

  // Pitch calculation with autocorrelation
  const detectPitch = (buf: Float32Array, sampleRate: number): { pitch: number; clarity: number } => {
    const SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.012) return { pitch: -1, clarity: 0 }; // Too quiet

    let r1 = 0;
    let r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }
    }

    const trimmed = buf.slice(r1, r2);
    const c = new Float32Array(trimmed.length);
    for (let i = 0; i < trimmed.length; i++) {
      let sum = 0;
      for (let j = 0; j < trimmed.length - i; j++) {
        sum += trimmed[j] * trimmed[j + i];
      }
      c[i] = sum;
    }

    let d = 0;
    while (d < c.length - 1 && c[d] > c[d + 1]) {
      d++;
    }

    let maxval = -1;
    let maxpos = -1;
    for (let i = d; i < c.length; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    if (maxpos === -1 || maxval <= 0 || c[0] <= 0) {
      return { pitch: -1, clarity: 0 };
    }

    let T0 = maxpos;
    if (T0 > 0 && T0 < c.length - 1) {
      const x1 = c[T0 - 1];
      const x2 = c[T0];
      const x3 = c[T0 + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) T0 = T0 - b / (2 * a);
    }

    const pitch = sampleRate / T0;
    const normClarity = Math.min(1, Math.max(0, maxval / c[0]));
    return { pitch, clarity: normClarity };
  };

  const getNoteData = (frequency: number, a4 = 440) => {
    const noteNum = 12 * (Math.log(frequency / a4) / Math.log(2));
    const midi = Math.round(noteNum) + 69;
    const note = NOTE_NAMES[((midi % 12) + 12) % 12];
    const octave = Math.floor(midi / 12) - 1;
    const noteFreq = a4 * Math.pow(2, (midi - 69) / 12);
    const cents = Math.round(1200 * Math.log2(frequency / noteFreq));
    return { note, octave, cents, targetFreq: noteFreq };
  };

  const updatePitchLoop = () => {
    if (!analyserRef.current || !audioContextRef.current) return;
    const analyser = analyserRef.current;
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    const { pitch, clarity: soundClarity } = detectPitch(buffer, audioContextRef.current.sampleRate);
    setClarity(soundClarity);

    if (pitch > 35 && pitch < 2200 && soundClarity > 0.6) {
      setDetectedPitch(Math.round(pitch * 10) / 10);

      // If user pinned a specific string, tune against that string
      if (selectedStringIndex !== null && currentPreset.strings[selectedStringIndex]) {
        const target = currentPreset.strings[selectedStringIndex];
        setDetectedNote(target.note);
        setDetectedOctave(target.octave);
        setTargetFreq(target.freq);
        const cents = Math.round(1200 * Math.log2(pitch / target.freq));
        setCentsDiff(Math.max(-50, Math.min(50, cents)));
      } else {
        // Auto detect nearest chromatic note
        const data = getNoteData(pitch, a4Calibration);
        setDetectedNote(data.note);
        setDetectedOctave(data.octave);
        setTargetFreq(Math.round(data.targetFreq * 10) / 10);
        setCentsDiff(Math.max(-50, Math.min(50, data.cents)));
      }
    }

    animationFrameRef.current = requestAnimationFrame(updatePitchLoop);
  };

  const startListening = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      mediaStreamRef.current = stream;

      setIsListening(true);
      animationFrameRef.current = requestAnimationFrame(updatePitchLoop);
    } catch (err: unknown) {
      console.error('Microphone error:', err);
      setMicError(
        '無法取得麥克風收音權限。請確認瀏覽器已允許使用麥克風，或改用下方「標準參考音試聽」調音。'
      );
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
    setIsListening(false);
    setDetectedPitch(null);
    setCentsDiff(0);
    setClarity(0);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const playReferenceTone = (noteStr: string, freq: number) => {
    setPlayingToneNote(noteStr);
    audioEngine.playPianoNote(freq, 2.5, 0, 0.7);
    setTimeout(() => {
      setPlayingToneNote(null);
    }, 2500);
  };

  const isExactTune = isListening && detectedPitch && Math.abs(centsDiff) <= 3;
  const isCloseTune = isListening && detectedPitch && Math.abs(centsDiff) <= 10;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-amber-950/40 border border-teal-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-inner">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                專業實時樂器調音器 (Pro Instrument Tuner)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                ±1 Cent 高精準度
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              支援吉他、烏克麗麗、小提琴、貝斯及全音域半音階，配備實時音分指針與標準參考音
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* A4 Calibration button */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">A4:</span>
            <select
              value={a4Calibration}
              onChange={(e) => setA4Calibration(parseInt(e.target.value, 10))}
              className="bg-transparent text-amber-300 font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value="432" className="bg-slate-900 text-white">432 Hz (療癒)</option>
              <option value="440" className="bg-slate-900 text-white">440 Hz (國際標準)</option>
              <option value="442" className="bg-slate-900 text-white">442 Hz (交響樂)</option>
              <option value="444" className="bg-slate-900 text-white">444 Hz (明亮)</option>
            </select>
          </div>

          {/* Start/Stop Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md ${
              isListening
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-gradient-to-r from-teal-500 to-teal-600 text-slate-950 hover:brightness-110 shadow-teal-500/25'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>停止收音</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>啟動麥克風調音</span>
              </>
            )}
          </button>
        </div>
      </div>

      {micError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Instrument Preset Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl">
        {INSTRUMENTS.map((inst) => {
          const active = selectedInstrument === inst.id;
          return (
            <button
              key={inst.id}
              onClick={() => {
                setSelectedInstrument(inst.id);
                setSelectedStringIndex(null);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{inst.icon}</span>
              <span>{inst.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tuner Gauge Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Background glow based on tune accuracy */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
            isExactTune
              ? 'bg-emerald-500/15'
              : isCloseTune
              ? 'bg-teal-500/10'
              : isListening && detectedPitch
              ? 'bg-amber-500/5'
              : 'bg-transparent'
          }`}
        />

        {/* Central Display: Big Note & Octave */}
        <div className="text-center my-3 relative z-10">
          <div className="flex items-baseline justify-center gap-2">
            <span
              className={`text-6xl sm:text-7xl font-black font-mono tracking-tight transition-colors ${
                isExactTune
                  ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                  : isCloseTune
                  ? 'text-teal-300'
                  : isListening && detectedPitch
                  ? 'text-amber-400'
                  : 'text-slate-600'
              }`}
            >
              {detectedNote}
            </span>
            {detectedOctave !== null && (
              <span className="text-2xl font-mono text-slate-400 font-bold">
                {detectedOctave}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-center gap-2 text-xs font-mono">
            {isListening ? (
              detectedPitch ? (
                <>
                  <span className="text-slate-300 font-bold">{detectedPitch} Hz</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">目標: {targetFreq || '--'} Hz</span>
                  <span className="text-slate-500">•</span>
                  <span
                    className={`font-bold ${
                      Math.abs(centsDiff) <= 3
                        ? 'text-emerald-400'
                        : centsDiff < 0
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {centsDiff > 0 ? `+${centsDiff}` : centsDiff} Cents
                  </span>
                </>
              ) : (
                <span className="text-teal-400 animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  請撥動琴弦或發出聲音...
                </span>
              )
            ) : (
              <span className="text-slate-500">麥克風未啟動，請點擊上方按鈕開始調音</span>
            )}
          </div>
        </div>

        {/* Needle Gauge / Meter */}
        <div className="w-full max-w-md my-6 relative z-10">
          {/* Tick Marks */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1 mb-1">
            <span>-50¢ (偏低 Flat)</span>
            <span className="text-emerald-400 font-bold">0¢ (標準 In Tune)</span>
            <span>+50¢ (偏高 Sharp)</span>
          </div>

          {/* Meter Track */}
          <div className="h-4 bg-slate-950 rounded-full border border-slate-800 relative overflow-hidden flex items-center">
            {/* Center target line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-emerald-500/80 -translate-x-1/2 z-10" />
            <div className="absolute left-[45%] right-[45%] top-0 bottom-0 bg-emerald-500/10 z-0" />

            {/* Moving Indicator */}
            {isListening && detectedPitch && (
              <div
                className={`absolute top-0 bottom-0 w-3 rounded-full transition-all duration-75 -translate-x-1/2 shadow-md ${
                  isExactTune
                    ? 'bg-emerald-400 shadow-emerald-400/80 scale-125'
                    : 'bg-amber-400 shadow-amber-400/50'
                }`}
                style={{
                  left: `${((centsDiff + 50) / 100) * 100}%`,
                }}
              />
            )}
          </div>

          {/* Tune status text */}
          <div className="mt-3 text-center">
            {isExactTune ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                音準完全鎖定！(In Tune)
              </span>
            ) : centsDiff < -3 && isListening && detectedPitch ? (
              <span className="text-xs font-mono text-amber-300 font-bold">
                ▲ 音高偏低，請將弦軸轉緊少許 (Tune Up)
              </span>
            ) : centsDiff > 3 && isListening && detectedPitch ? (
              <span className="text-xs font-mono text-rose-300 font-bold">
                ▼ 音高偏高，請將弦軸放鬆少許 (Tune Down)
              </span>
            ) : null}
          </div>
        </div>

        {/* String Presets Buttons (for Guitar / Ukulele / Violin / Bass) */}
        {currentPreset.strings.length > 0 && (
          <div className="w-full max-w-lg mt-2 pt-4 border-t border-slate-800/80 relative z-10">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
              <span className="font-semibold text-slate-300">
                {currentPreset.name} 各弦音高標準（可單獨鎖定或聽參考音）
              </span>
              {selectedStringIndex !== null && (
                <button
                  onClick={() => setSelectedStringIndex(null)}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  切回全自動識別
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {currentPreset.strings.map((str, idx) => {
                const isSelected = selectedStringIndex === idx;
                const isPlayingThis = playingToneNote === `${str.note}${str.octave}`;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400/80 text-amber-300 ring-1 ring-amber-400/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedStringIndex(isSelected ? null : idx)}
                      className="text-left cursor-pointer w-full"
                    >
                      <div className="text-[10px] text-slate-400 font-mono">{str.label}</div>
                      <div className="text-base font-bold font-mono text-white">
                        {str.note}
                        <span className="text-xs text-slate-400">{str.octave}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{str.freq} Hz</div>
                    </button>

                    {/* Reference tone button */}
                    <button
                      onClick={() => playReferenceTone(`${str.note}${str.octave}`, str.freq)}
                      className={`w-full py-1 rounded text-[10px] font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        isPlayingThis
                          ? 'bg-teal-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title="試聽標準參考音"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isPlayingThis ? '發聲中' : '聽音'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Guide & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>弦樂調音口訣</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            調弦時建議「由低往高調」，若原本音偏高，先轉鬆至低於標準音，再慢慢轉緊升上來，音準不易跑掉。
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
            <Sliders className="w-4 h-4" />
            <span>基準音 A4 選擇</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            現代流行樂與電子琴標準為 440 Hz；歐洲交響樂團常用 442 Hz 增添明亮感；吉他自彈自唱亦可嘗試 432 Hz 溫潤頻率。
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>免麥克風聽音調弦法</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            在吵雜環境中，可點選各弦的「聽音」按鈕，聆聽標準鋼琴純音，憑聽覺對齊琴弦共振與泛音拍頻。
          </p>
        </div>
      </div>
    </div>
  );
};
