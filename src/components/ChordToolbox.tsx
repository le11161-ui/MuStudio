import React, { useState } from 'react';
import { Volume2, Music, Search, Play, RefreshCw, HelpCircle, Sparkles } from 'lucide-react';
import { CHORD_DATABASE } from '../data/chordDatabase';
import { audioEngine } from '../utils/audioEngine';

interface ChordToolboxProps {
  onAskCoachAboutChord?: (chordName: string) => void;
}

export const ChordToolbox: React.FC<ChordToolboxProps> = ({ onAskCoachAboutChord }) => {
  const [selectedChordKey, setSelectedChordKey] = useState<string>('Cmaj7');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fretboardInstrument, setFretboardInstrument] = useState<'guitar' | 'ukulele'>('guitar');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const chord = CHORD_DATABASE[selectedChordKey] || CHORD_DATABASE['C'];

  // Piano keys definition (2 Octaves: C3 to B4)
  // C3 is MIDI 12 in our relative system
  const PIANO_OCTAVES = [
    { note: 'C', isBlack: false, midi: 12 },
    { note: 'C#', isBlack: true, midi: 13 },
    { note: 'D', isBlack: false, midi: 14 },
    { note: 'D#', isBlack: true, midi: 15 },
    { note: 'E', isBlack: false, midi: 16 },
    { note: 'F', isBlack: false, midi: 17 },
    { note: 'F#', isBlack: true, midi: 18 },
    { note: 'G', isBlack: false, midi: 19 },
    { note: 'G#', isBlack: true, midi: 20 },
    { note: 'A', isBlack: false, midi: 21 },
    { note: 'A#', isBlack: true, midi: 22 },
    { note: 'B', isBlack: false, midi: 23 },
    // Octave 4
    { note: 'C', isBlack: false, midi: 24 },
    { note: 'C#', isBlack: true, midi: 25 },
    { note: 'D', isBlack: false, midi: 26 },
    { note: 'D#', isBlack: true, midi: 27 },
    { note: 'E', isBlack: false, midi: 28 },
    { note: 'F', isBlack: false, midi: 29 },
    { note: 'F#', isBlack: true, midi: 30 },
    { note: 'G', isBlack: false, midi: 31 },
    { note: 'G#', isBlack: true, midi: 32 },
    { note: 'A', isBlack: false, midi: 33 },
    { note: 'A#', isBlack: true, midi: 34 },
    { note: 'B', isBlack: false, midi: 35 },
  ];

  const playFullChord = (arpeggiate: boolean = false) => {
    if (isPlaying) return;
    setIsPlaying(true);

    // Convert notes to frequencies
    const freqs = chord.notes.map((n, i) => {
      const octave = i === 0 ? 3 : 4;
      return audioEngine.noteToFreq(`${n}${octave}`);
    });

    audioEngine.playChord(freqs, arpeggiate, 1.8, false);
    setTimeout(() => setIsPlaying(false), 1900);
  };

  const playFretboardStrum = () => {
    if (isPlaying) return;
    setIsPlaying(true);

    if (fretboardInstrument === 'guitar') {
      // Guitar tuning: E2, A2, D3, G3, B3, E4
      const baseFreqs = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
      const activeFreqs: number[] = [];

      chord.guitar.frets.forEach((fret, stringIdx) => {
        if (fret !== 'x') {
          const freq = baseFreqs[stringIdx] * Math.pow(2, (fret as number) / 12);
          activeFreqs.push(freq);
        }
      });
      audioEngine.playChord(activeFreqs, true, 1.6, true);
    } else {
      // Ukulele tuning: G4, C4, E4, A4
      const baseFreqs = [392.0, 261.63, 329.63, 440.0];
      const activeFreqs: number[] = [];

      chord.ukulele.frets.forEach((fret, stringIdx) => {
        if (fret !== 'x') {
          const freq = baseFreqs[stringIdx] * Math.pow(2, (fret as number) / 12);
          activeFreqs.push(freq);
        }
      });
      audioEngine.playChord(activeFreqs, true, 1.5, true);
    }

    setTimeout(() => setIsPlaying(false), 1700);
  };

  const handleKeyClick = (noteName: string, octave: number) => {
    const freq = audioEngine.noteToFreq(`${noteName}${octave}`);
    audioEngine.playPianoNote(freq, 1.0);
  };

  const allChordKeys = Object.keys(CHORD_DATABASE);
  const filteredChords = searchQuery
    ? allChordKeys.filter(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
    : allChordKeys;

  return (
    <div className="space-y-8">
      {/* Header and Quick Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">線上和弦庫與指法圖</h2>
          <p className="text-sm text-slate-400 mt-1">
            即時查詢流行和弦，同步對照鋼琴鍵盤、民謠吉他與烏克麗麗指法。
          </p>
        </div>

        {/* Search & Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜尋和弦 (如 Cmaj7, Am)"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>
      </div>

      {/* Popular Chords Tag Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-slate-400 mr-2">常用和弦：</span>
        {filteredChords.map(k => (
          <button
            key={k}
            onClick={() => setSelectedChordKey(k)}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedChordKey === k
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Main Chord Showcase Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Chord Overview Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {chord.name}
              </h3>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                和弦公式：{chord.formula}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {chord.description}
            </p>
          </div>

          {/* Action Play Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => playFullChord(false)}
              disabled={isPlaying}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/10 disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>齊奏和弦</span>
            </button>

            <button
              onClick={() => playFullChord(true)}
              disabled={isPlaying}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>分解琶音</span>
            </button>

            {onAskCoachAboutChord && (
              <button
                onClick={() => onAskCoachAboutChord(chord.name)}
                className="px-3 py-2 bg-slate-950 border border-amber-500/30 text-amber-300 font-medium text-xs rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>問教練用法</span>
              </button>
            )}
          </div>
        </div>

        {/* Dual Layout: Piano Keyboard + Guitar/Ukulele Fretboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Section A: Piano Keyboard Visualizer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🎹 鋼琴鍵盤按法</span>
                <span className="text-xs font-normal text-slate-400">(點擊琴鍵可單音發聲)</span>
              </h4>
              <div className="text-xs text-amber-400 font-mono">
                組成音：{chord.notes.join(' - ')}
              </div>
            </div>

            {/* Interactive SVG / CSS Piano Keyboard */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <div className="relative flex justify-center min-w-[520px] select-none h-44">
                {/* White Keys */}
                {PIANO_OCTAVES.filter(k => !k.isBlack).map((k, wIndex) => {
                  const isChordNote = chord.pianoKeys.includes(k.midi);
                  const fingeringIdx = chord.pianoKeys.indexOf(k.midi);
                  const finger = fingeringIdx >= 0 ? chord.pianoFingerings[fingeringIdx] : null;

                  return (
                    <div
                      key={`white-${k.midi}`}
                      onClick={() => handleKeyClick(k.note, k.midi < 24 ? 3 : 4)}
                      className={`relative w-9 h-40 border-r border-slate-700 rounded-b-md cursor-pointer transition-all flex flex-col justify-end items-center pb-2 ${
                        isChordNote
                          ? 'bg-gradient-to-b from-amber-100 to-amber-300 shadow-inner'
                          : 'bg-white hover:bg-slate-100 active:bg-slate-200'
                      }`}
                    >
                      {isChordNote && (
                        <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shadow-md mb-1">
                          {finger || '•'}
                        </div>
                      )}
                      <span className={`text-[10px] font-mono font-semibold ${isChordNote ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        {k.note}
                      </span>
                    </div>
                  );
                })}

                {/* Black Keys Layer */}
                <div className="absolute inset-0 flex justify-center pointer-events-none">
                  <div className="relative flex min-w-[520px]">
                    {PIANO_OCTAVES.map((k, idx) => {
                      if (!k.isBlack) return null;
                      const isChordNote = chord.pianoKeys.includes(k.midi);
                      const fingeringIdx = chord.pianoKeys.indexOf(k.midi);
                      const finger = fingeringIdx >= 0 ? chord.pianoFingerings[fingeringIdx] : null;

                      // Calculate absolute left offset based on piano pattern
                      // White key width is 36px (w-9)
                      const whiteKeysBefore = PIANO_OCTAVES.slice(0, idx).filter(item => !item.isBlack).length;
                      const leftPx = whiteKeysBefore * 36 - 12;

                      return (
                        <div
                          key={`black-${k.midi}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleKeyClick(k.note, k.midi < 24 ? 3 : 4);
                          }}
                          style={{ left: `${leftPx}px` }}
                          className={`absolute top-0 w-6 h-24 rounded-b-sm cursor-pointer pointer-events-auto transition-all flex flex-col justify-end items-center pb-2 z-10 ${
                            isChordNote
                              ? 'bg-amber-400 border border-amber-300 text-slate-950'
                              : 'bg-slate-900 border border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          {isChordNote && (
                            <span className="text-[10px] font-mono font-bold text-slate-950">
                              {finger || '•'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fingering Hint Indicator */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>標記數字為推薦右手指法 (1拇指、2食指、3中指、4無名指、5小指)</span>
                <span className="font-mono text-amber-400">中央 C = C4</span>
              </div>
            </div>
          </div>

          {/* Section B: Guitar / Ukulele Fretboard Diagram */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{fretboardInstrument === 'guitar' ? '🎸 吉他六線指法' : '🪵 烏克麗麗四線指法'}</span>
              </h4>

              {/* Instrument Toggle */}
              <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  onClick={() => setFretboardInstrument('guitar')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                    fretboardInstrument === 'guitar'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  民謠吉他
                </button>
                <button
                  onClick={() => setFretboardInstrument('ukulele')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                    fretboardInstrument === 'ukulele'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  烏克麗麗
                </button>
              </div>
            </div>

            {/* Fretboard SVG Display */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
              {fretboardInstrument === 'guitar' ? (
                <GuitarFretboard chord={chord} />
              ) : (
                <UkuleleFretboard chord={chord} />
              )}

              {/* Strum Sound Button */}
              <button
                onClick={playFretboardStrum}
                disabled={isPlaying}
                className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>撥弦試聽 ({fretboardInstrument === 'guitar' ? '吉他' : '烏克麗麗'})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Clean SVG Guitar Fretboard Renderer
const GuitarFretboard: React.FC<{ chord: any }> = ({ chord }) => {
  const frets = chord.guitar.frets as (number | 'x')[];
  const fingers = chord.guitar.fingers as (number | null)[];
  const stringNames = ['6E', '5A', '4D', '3G', '2B', '1e'];

  return (
    <svg width="220" height="240" viewBox="0 0 220 240" className="select-none">
      {/* Top nut (fret 0) */}
      <rect x="30" y="30" width="160" height="6" fill="#f59e0b" rx="2" />

      {/* 5 Frets horizontal lines */}
      {[0, 1, 2, 3, 4, 5].map((fret) => (
        <line
          key={fret}
          x1="30"
          y1={36 + fret * 34}
          x2="190"
          y2={36 + fret * 34}
          stroke="#475569"
          strokeWidth="2"
        />
      ))}

      {/* 6 Strings vertical lines */}
      {[0, 1, 2, 3, 4, 5].map((str) => (
        <line
          key={str}
          x1={30 + str * 32}
          y1="36"
          x2={30 + str * 32}
          y2="206"
          stroke="#94a3b8"
          strokeWidth={2.5 - str * 0.3}
        />
      ))}

      {/* String labels & Open/Muted indicators */}
      {frets.map((fretVal, strIdx) => {
        const x = 30 + strIdx * 32;
        const isMuted = fretVal === 'x';
        const isOpen = fretVal === 0;

        return (
          <g key={strIdx}>
            <text
              x={x}
              y="20"
              textAnchor="middle"
              className={`text-xs font-mono font-bold ${
                isMuted ? 'fill-red-400' : isOpen ? 'fill-emerald-400' : 'fill-slate-400'
              }`}
            >
              {isMuted ? '✕' : isOpen ? '○' : ''}
            </text>
            <text
              x={x}
              y="226"
              textAnchor="middle"
              className="text-[10px] font-mono fill-slate-400"
            >
              {stringNames[strIdx]}
            </text>
          </g>
        );
      })}

      {/* Finger placement dots */}
      {frets.map((fretVal, strIdx) => {
        if (typeof fretVal !== 'number' || fretVal <= 0) return null;
        const x = 30 + strIdx * 32;
        const y = 36 + (fretVal - 0.5) * 34;
        const finger = fingers[strIdx];

        return (
          <g key={`dot-${strIdx}`}>
            <circle cx={x} cy={y} r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            {finger && (
              <text
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                className="text-[11px] font-mono font-bold fill-slate-950"
              >
                {finger}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// Clean SVG Ukulele Fretboard Renderer
const UkuleleFretboard: React.FC<{ chord: any }> = ({ chord }) => {
  const frets = chord.ukulele.frets as (number | 'x')[];
  const fingers = chord.ukulele.fingers as (number | null)[];
  const stringNames = ['4G', '3C', '2E', '1A'];

  return (
    <svg width="200" height="240" viewBox="0 0 200 240" className="select-none">
      {/* Top nut */}
      <rect x="35" y="30" width="130" height="6" fill="#f59e0b" rx="2" />

      {/* 5 Frets horizontal lines */}
      {[0, 1, 2, 3, 4, 5].map((fret) => (
        <line
          key={fret}
          x1="35"
          y1={36 + fret * 34}
          x2="165"
          y2={36 + fret * 34}
          stroke="#475569"
          strokeWidth="2"
        />
      ))}

      {/* 4 Strings vertical lines */}
      {[0, 1, 2, 3].map((str) => (
        <line
          key={str}
          x1={35 + str * 43.3}
          y1="36"
          x2={35 + str * 43.3}
          y2="206"
          stroke="#94a3b8"
          strokeWidth="2"
        />
      ))}

      {/* Open / Muted and string names */}
      {frets.map((fretVal, strIdx) => {
        const x = 35 + strIdx * 43.3;
        const isMuted = fretVal === 'x';
        const isOpen = fretVal === 0;

        return (
          <g key={strIdx}>
            <text
              x={x}
              y="20"
              textAnchor="middle"
              className={`text-xs font-mono font-bold ${
                isMuted ? 'fill-red-400' : isOpen ? 'fill-emerald-400' : 'fill-slate-400'
              }`}
            >
              {isMuted ? '✕' : isOpen ? '○' : ''}
            </text>
            <text
              x={x}
              y="226"
              textAnchor="middle"
              className="text-[10px] font-mono fill-slate-400"
            >
              {stringNames[strIdx]}
            </text>
          </g>
        );
      })}

      {/* Dots */}
      {frets.map((fretVal, strIdx) => {
        if (typeof fretVal !== 'number' || fretVal <= 0) return null;
        const x = 35 + strIdx * 43.3;
        const y = 36 + (fretVal - 0.5) * 34;
        const finger = fingers[strIdx];

        return (
          <g key={`dot-uku-${strIdx}`}>
            <circle cx={x} cy={y} r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            {finger && (
              <text
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                className="text-[11px] font-mono font-bold fill-slate-950"
              >
                {finger}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
