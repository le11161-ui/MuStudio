import React, { useState } from 'react';
import { Play, Square, Music2, Sparkles, RotateCcw, Volume2, Copy, Check } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface ParsedNote {
  raw: string;
  isBar: boolean;
  isRest: boolean;
  digit: number; // 1-7
  octaveOffset: number; // -1, 0, 1
  durationBeats: number;
  pitchName: string;
  noteFrequency: number;
  staffY: number; // Y coordinate on staff
  needsLedgerLine: boolean;
}

export const ScoreConverter: React.FC = () => {
  const [notationInput, setNotationInput] = useState<string>('1 1 5 5 | 6 6 5 - | 4 4 3 3 | 2 2 1 -');
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(-1);
  const [copied, setCopied] = useState<boolean>(false);

  // Parse Numbered notation into structured note objects
  const parseNotation = (input: string): ParsedNote[] => {
    const tokens = input.trim().split(/\s+/);
    const parsed: ParsedNote[] = [];

    // Scale mappings (C Major reference):
    // 1=C4, 2=D4, 3=E4, 4=F4, 5=G4, 6=A4, 7=B4
    // Staff lines: E4=line 1 (y=80), G4=line 2 (y=66), B4=line 3 (y=52), D5=line 4 (y=38), F5=line 5 (y=24)
    // C4 is below line 1: y = 94 (needs ledger line at y=94)
    const baseStaffY: Record<number, number> = {
      1: 94, // C4 (Middle C)
      2: 87, // D4
      3: 80, // E4 (Line 1)
      4: 73, // F4 (Space 1)
      5: 66, // G4 (Line 2)
      6: 59, // A4 (Space 2)
      7: 52, // B4 (Line 3)
    };

    const pitchNames: Record<number, string> = {
      1: 'C', 2: 'D', 3: 'E', 4: 'F', 5: 'G', 6: 'A', 7: 'B'
    };

    let i = 0;
    while (i < tokens.length) {
      const tok = tokens[i];

      if (tok === '|') {
        parsed.push({
          raw: '|',
          isBar: true,
          isRest: false,
          digit: 0,
          octaveOffset: 0,
          durationBeats: 0,
          pitchName: '',
          noteFrequency: 0,
          staffY: 0,
          needsLedgerLine: false,
        });
        i++;
        continue;
      }

      if (tok === '0') {
        parsed.push({
          raw: '0',
          isBar: false,
          isRest: true,
          digit: 0,
          octaveOffset: 0,
          durationBeats: 1,
          pitchName: '休止',
          noteFrequency: 0,
          staffY: 52,
          needsLedgerLine: false,
        });
        i++;
        continue;
      }

      // Check octave: 1' is high, _1 is low
      let octaveOffset = 0;
      let cleanTok = tok;
      if (tok.includes("'") || tok.includes("’")) {
        octaveOffset = 1;
        cleanTok = tok.replace(/['’]/g, '');
      } else if (tok.startsWith('_')) {
        octaveOffset = -1;
        cleanTok = tok.replace(/^_/, '');
      }

      const digit = parseInt(cleanTok[0], 10);
      if (digit >= 1 && digit <= 7) {
        // Calculate duration: count following '-' tokens
        let durationBeats = 1;
        let lookAhead = i + 1;
        while (lookAhead < tokens.length && tokens[lookAhead] === '-') {
          durationBeats++;
          lookAhead++;
        }

        // Calculate staff Y: each octave is 7 diatonic steps (7 * 7px = 49px)
        const baseY = baseStaffY[digit];
        const staffY = baseY - octaveOffset * 49;
        const noteFreq = audioEngine.numberedToFreq(digit, octaveOffset);
        const pitchName = `${pitchNames[digit]}${4 + octaveOffset}`;

        parsed.push({
          raw: tok,
          isBar: false,
          isRest: false,
          digit,
          octaveOffset,
          durationBeats,
          pitchName,
          noteFrequency: noteFreq,
          staffY,
          needsLedgerLine: staffY >= 94 || staffY <= 17,
        });

        i = lookAhead;
        continue;
      }

      i++;
    }

    return parsed;
  };

  const parsedNotes = parseNotation(notationInput);

  // Play score with active note progression
  const handlePlayScore = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveNoteIndex(-1);

    const secondsPerBeat = 60 / bpm;
    const playableNotes = parsedNotes
      .filter(n => !n.isBar)
      .map(n => ({
        freq: n.isRest ? 0 : n.noteFrequency,
        durationSeconds: n.durationBeats * secondsPerBeat,
        label: n.pitchName,
      }));

    let currentNoteCounter = 0;
    // Map playable note index to parsed note index
    const noteIndices: number[] = [];
    parsedNotes.forEach((n, idx) => {
      if (!n.isBar) noteIndices.push(idx);
    });

    audioEngine.playScoreSequence(
      playableNotes,
      (idx) => {
        setActiveNoteIndex(noteIndices[idx]);
      },
      () => {
        setIsPlaying(false);
        setActiveNoteIndex(-1);
      }
    );
  };

  const handleStopScore = () => {
    setIsPlaying(false);
    setActiveNoteIndex(-1);
  };

  const setPreset = (presetNotation: string) => {
    handleStopScore();
    setNotationInput(presetNotation);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notationInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">線上簡譜 / 五線譜轉換器</h2>
          <p className="text-sm text-slate-400 mt-1">
            輸入簡譜數字（1 2 3 5），自動計算音高幾何與小節線，即時生成標準五線譜並同步發聲。
          </p>
        </div>

        {/* Copy Notation */}
        <button
          onClick={copyToClipboard}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '已複製簡譜' : '複製簡譜字串'}</span>
        </button>
      </div>

      {/* Quick Song Presets */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 mr-1">經典試聽範例：</span>
        {[
          { label: '🌟 小星星', score: '1 1 5 5 | 6 6 5 - | 4 4 3 3 | 2 2 1 -' },
          { label: '🏰 天空之城', score: "6 7 | 1' 7 1' 3' | 7 - - 3 | 6 5 6 1' | 5 - -" },
          { label: '🎻 卡農主題', score: "1' 7 6 5 | 4 3 4 5 | 1 5 6 3 | 4 1 4 5" },
          { label: '☀️ 歡樂頌', score: '3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3 - 2 2' }
        ].map(p => (
          <button
            key={p.label}
            onClick={() => setPreset(p.score)}
            className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-amber-500/50 hover:text-amber-300 transition-colors cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Music2 className="w-4 h-4 text-amber-400" />
            <span>簡譜輸入欄 (支援 1-7、高音點 1'、減時/延音線 -、小節線 |、休止符 0)</span>
          </label>
          <span className="text-xs font-mono text-amber-400">調性：C Major</span>
        </div>

        <textarea
          rows={2}
          value={notationInput}
          onChange={e => setNotationInput(e.target.value)}
          placeholder="例如：1 2 3 5 6 | 5 3 2 1 | 3 5 6 1' | 5 - - -"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-amber-300 font-mono text-sm leading-relaxed focus:outline-none focus:border-amber-500/50"
        />

        {/* Playback Controls Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? handleStopScore : handlePlayScore}
              className={`px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10'
              }`}
            >
              {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? '停止演奏' : '播放五線譜旋律'}</span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Web Audio 即時逐音跟隨導引
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>速度：</span>
            <input
              type="range"
              min="50"
              max="160"
              value={bpm}
              onChange={e => setBpm(parseInt(e.target.value, 10))}
              className="w-24 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono text-white font-bold tabular-nums">{bpm} BPM</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Five-Line Staff Viewport */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🎼 自動生成之高音五線譜 (Standard Treble Stave)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {parsedNotes.filter(n => !n.isBar).length} 顆音符
          </span>
        </div>

        {/* Stave SVG Canvas */}
        <div className="bg-slate-950 rounded-xl p-4 sm:p-6 border border-slate-800 overflow-x-auto">
          <div className="min-w-[640px] flex justify-center py-2">
            <svg
              width={Math.max(680, parsedNotes.length * 48 + 120)}
              height="150"
              viewBox={`0 0 ${Math.max(680, parsedNotes.length * 48 + 120)} 150`}
              className="select-none"
            >
              {/* 5 Staff Lines */}
              {/* Line 5: y=24, Line 4: y=38, Line 3: y=52, Line 2: y=66, Line 1: y=80 */}
              {[24, 38, 52, 66, 80].map((y, lineIdx) => (
                <line
                  key={lineIdx}
                  x1="20"
                  y1={y}
                  x2={Math.max(660, parsedNotes.length * 48 + 100)}
                  y2={y}
                  stroke="#475569"
                  strokeWidth="1.5"
                />
              ))}

              {/* Treble Clef Graphic at Start */}
              <text
                x="30"
                y="74"
                fontSize="56"
                fill="#f59e0b"
                fontFamily="serif"
                className="select-none"
              >
                𝄞
              </text>

              {/* Time signature (4/4 default) */}
              <text x="80" y="52" fontSize="22" fontWeight="bold" fill="#94a3b8" fontFamily="serif" textAnchor="middle">
                4
              </text>
              <text x="80" y="78" fontSize="22" fontWeight="bold" fill="#94a3b8" fontFamily="serif" textAnchor="middle">
                4
              </text>

              {/* Render Notes & Bar lines */}
              {parsedNotes.map((item, idx) => {
                const x = 120 + idx * 46;
                const isCurrentActive = activeNoteIndex === idx;

                if (item.isBar) {
                  return (
                    <line
                      key={`bar-${idx}`}
                      x1={x}
                      y1="24"
                      x2={x}
                      y2="80"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                  );
                }

                if (item.isRest) {
                  return (
                    <g key={`rest-${idx}`}>
                      <text
                        x={x}
                        y="58"
                        textAnchor="middle"
                        fill={isCurrentActive ? '#f59e0b' : '#64748b'}
                        fontSize="20"
                        fontWeight="bold"
                      >
                        𝄽
                      </text>
                      <text
                        x={x}
                        y="125"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        休止
                      </text>
                    </g>
                  );
                }

                // Determine if stem points up or down (stems down for B4 y<=52)
                const stemDown = item.staffY <= 52;
                const noteColor = isCurrentActive ? '#f59e0b' : '#f8fafc';

                return (
                  <g key={`note-${idx}`} className="cursor-pointer">
                    {/* Ledger Line for C4 (y=94) */}
                    {item.needsLedgerLine && (
                      <line
                        x1={x - 12}
                        y1="94"
                        x2={x + 12}
                        y2="94"
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Active Halo Glow */}
                    {isCurrentActive && (
                      <circle
                        cx={x}
                        cy={item.staffY}
                        r="14"
                        fill="rgba(245, 158, 11, 0.25)"
                        className="animate-ping"
                      />
                    )}

                    {/* Notehead (slanted oval) */}
                    <ellipse
                      cx={x}
                      cy={item.staffY}
                      rx="7"
                      ry="5"
                      fill={noteColor}
                      transform={`rotate(-25 ${x} ${item.staffY})`}
                    />

                    {/* Stem */}
                    {item.durationBeats < 4 && (
                      <line
                        x1={stemDown ? x - 6.5 : x + 6.5}
                        y1={item.staffY}
                        x2={stemDown ? x - 6.5 : x + 6.5}
                        y2={stemDown ? item.staffY + 32 : item.staffY - 32}
                        stroke={noteColor}
                        strokeWidth="1.75"
                      />
                    )}

                    {/* Note name & Numbered notation label under stave */}
                    <text
                      x={x}
                      y="118"
                      textAnchor="middle"
                      fill={isCurrentActive ? '#f59e0b' : '#cbd5e1'}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {item.raw}
                    </text>

                    <text
                      x={x}
                      y="134"
                      textAnchor="middle"
                      fill={isCurrentActive ? '#f59e0b' : '#64748b'}
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {item.pitchName}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>當前播放音符高亮</span>
            </span>
            <span>下加一線 = 中央 C (C4 / Do)</span>
          </div>
          <span>點擊任意音符對齊視奏</span>
        </div>
      </div>
    </div>
  );
};
