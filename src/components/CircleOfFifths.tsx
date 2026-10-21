import React, { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { Play, Volume2, ArrowRight, RotateCcw, Sparkles, Music, HelpCircle, Layers } from 'lucide-react';

interface KeyInfo {
  name: string;
  minor: string;
  accidentals: string;
  accidentalCount: number;
  accidentalType: 'sharp' | 'flat' | 'natural';
  angle: number; // 0 is top (12 o'clock)
  scale: string[];
  chords: {
    degree: string;
    roman: string;
    name: string;
    type: 'major' | 'minor' | 'diminished';
    notes: string[];
  }[];
  progressions: {
    name: string;
    progression: string;
    chords: string[];
    description: string;
  }[];
}

const KEYS_DATA: KeyInfo[] = [
  {
    name: 'C',
    minor: 'Am',
    accidentals: '無升降',
    accidentalCount: 0,
    accidentalType: 'natural',
    angle: 0,
    scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    chords: [
      { degree: '主和弦 (Tonic)', roman: 'I', name: 'C', type: 'major', notes: ['C4', 'E4', 'G4'] },
      { degree: '上主和弦', roman: 'ii', name: 'Dm', type: 'minor', notes: ['D4', 'F4', 'A4'] },
      { degree: '中和弦', roman: 'iii', name: 'Em', type: 'minor', notes: ['E4', 'G4', 'B4'] },
      { degree: '下屬和弦 (Subdominant)', roman: 'IV', name: 'F', type: 'major', notes: ['F4', 'A4', 'C5'] },
      { degree: '屬和弦 (Dominant)', roman: 'V', name: 'G', type: 'major', notes: ['G4', 'B4', 'D5'] },
      { degree: '關係小調 (Submediant)', roman: 'vi', name: 'Am', type: 'minor', notes: ['A4', 'C5', 'E5'] },
      { degree: '導和弦', roman: 'vii°', name: 'Bdim', type: 'diminished', notes: ['B4', 'D5', 'F5'] },
    ],
    progressions: [
      { name: '流行萬能進行', progression: 'I - V - vi - IV', chords: ['C', 'G', 'Am', 'F'], description: '流行音樂中最常見的走法，情感自然流暢' },
      { name: '日系動漫抒情', progression: 'IV - V - iii - vi', chords: ['F', 'G', 'Em', 'Am'], description: '王道進行，帶有希望與微酸的情緒' },
      { name: '爵士經典解決', progression: 'ii - V - I', chords: ['Dm', 'G', 'C'], description: '最具方向感與歸屬感的爵士和聲循環' },
    ],
  },
  {
    name: 'G',
    minor: 'Em',
    accidentals: '1 個升號 (F#)',
    accidentalCount: 1,
    accidentalType: 'sharp',
    angle: 30,
    scale: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    chords: [
      { degree: '主和弦 (Tonic)', roman: 'I', name: 'G', type: 'major', notes: ['G3', 'B3', 'D4'] },
      { degree: '上主和弦', roman: 'ii', name: 'Am', type: 'minor', notes: ['A3', 'C4', 'E4'] },
      { degree: '中和弦', roman: 'iii', name: 'Bm', type: 'minor', notes: ['B3', 'D4', 'F#4'] },
      { degree: '下屬和弦 (Subdominant)', roman: 'IV', name: 'C', type: 'major', notes: ['C4', 'E4', 'G4'] },
      { degree: '屬和弦 (Dominant)', roman: 'V', name: 'D', type: 'major', notes: ['D4', 'F#4', 'A4'] },
      { degree: '關係小調 (Submediant)', roman: 'vi', name: 'Em', type: 'minor', notes: ['E4', 'G4', 'B4'] },
      { degree: '導和弦', roman: 'vii°', name: 'F#dim', type: 'diminished', notes: ['F#4', 'A4', 'C5'] },
    ],
    progressions: [
      { name: '流行萬能進行', progression: 'I - V - vi - IV', chords: ['G', 'D', 'Em', 'C'], description: '吉他民謠最經典的清爽彈唱進行' },
      { name: '抒情卡農進行', progression: 'I - V - vi - iii - IV - I', chords: ['G', 'D', 'Em', 'Bm', 'C', 'G'], description: '旋律層層堆疊的和聲色彩' },
    ],
  },
  {
    name: 'D',
    minor: 'Bm',
    accidentals: '2 個升號 (F#, C#)',
    accidentalCount: 2,
    accidentalType: 'sharp',
    angle: 60,
    scale: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    chords: [
      { degree: '主和弦 (Tonic)', roman: 'I', name: 'D', type: 'major', notes: ['D4', 'F#4', 'A4'] },
      { degree: '上主和弦', roman: 'ii', name: 'Em', type: 'minor', notes: ['E4', 'G4', 'B4'] },
      { degree: '中和弦', roman: 'iii', name: 'F#m', type: 'minor', notes: ['F#4', 'A4', 'C#5'] },
      { degree: '下屬和弦', roman: 'IV', name: 'G', type: 'major', notes: ['G4', 'B4', 'D5'] },
      { degree: '屬和弦', roman: 'V', name: 'A', type: 'major', notes: ['A4', 'C#5', 'E5'] },
      { degree: '關係小調', roman: 'vi', name: 'Bm', type: 'minor', notes: ['B4', 'D5', 'F#5'] },
      { degree: '導和弦', roman: 'vii°', name: 'C#dim', type: 'diminished', notes: ['C#4', 'E4', 'G4'] },
    ],
    progressions: [
      { name: '搖滾力量進行', progression: 'I - IV - V - I', chords: ['D', 'G', 'A', 'D'], description: '開朗且富有衝擊感的正向進行' },
      { name: '王道抒情進行', progression: 'IV - V - iii - vi', chords: ['G', 'A', 'F#m', 'Bm'], description: '極受歡迎的情歌過門結構' },
    ],
  },
  {
    name: 'A',
    minor: 'F#m',
    accidentals: '3 個升號 (F#, C#, G#)',
    accidentalCount: 3,
    accidentalType: 'sharp',
    angle: 90,
    scale: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    chords: [
      { degree: '主和弦 (Tonic)', roman: 'I', name: 'A', type: 'major', notes: ['A3', 'C#4', 'E4'] },
      { degree: '上主和弦', roman: 'ii', name: 'Bm', type: 'minor', notes: ['B3', 'D4', 'F#4'] },
      { degree: '中和弦', roman: 'iii', name: 'C#m', type: 'minor', notes: ['C#4', 'E4', 'G#4'] },
      { degree: '下屬和弦', roman: 'IV', name: 'D', type: 'major', notes: ['D4', 'F#4', 'A4'] },
      { degree: '屬和弦', roman: 'V', name: 'E', type: 'major', notes: ['E4', 'G#4', 'B4'] },
      { degree: '關係小調', roman: 'vi', name: 'F#m', type: 'minor', notes: ['F#4', 'A4', 'C#5'] },
      { degree: '導和弦', roman: 'vii°', name: 'G#dim', type: 'diminished', notes: ['G#4', 'B4', 'D5'] },
    ],
    progressions: [
      { name: '萬能抒情進行', progression: 'I - V - vi - IV', chords: ['A', 'E', 'F#m', 'D'], description: '明亮通透的男聲/女聲熱門調性' },
    ],
  },
  {
    name: 'E',
    minor: 'C#m',
    accidentals: '4 個升號 (F#, C#, G#, D#)',
    accidentalCount: 4,
    accidentalType: 'sharp',
    angle: 120,
    scale: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    chords: [
      { degree: '主和弦 (Tonic)', roman: 'I', name: 'E', type: 'major', notes: ['E3', 'G#3', 'B3'] },
      { degree: '上主和弦', roman: 'ii', name: 'F#m', type: 'minor', notes: ['F#3', 'A3', 'C#4'] },
      { degree: '中和弦', roman: 'iii', name: 'G#m', type: 'minor', notes: ['G#3', 'B3', 'D#4'] },
      { degree: '下屬和弦', roman: 'IV', name: 'A', type: 'major', notes: ['A3', 'C#4', 'E4'] },
      { degree: '屬和弦', roman: 'V', name: 'B', type: 'major', notes: ['B3', 'D#4', 'F#4'] },
      { degree: '關係小調', roman: 'vi', name: 'C#m', type: 'minor', notes: ['C#4', 'E4', 'G#4'] },
      { degree: '導和弦', roman: 'vii°', name: 'D#dim', type: 'diminished', notes: ['D#4', 'F#4', 'A4'] },
    ],
    progressions: [
      { name: '經典流行進行', progression: 'I - V - vi - IV', chords: ['E', 'B', 'C#m', 'A'], description: '吉他空弦共鳴極佳的調性' },
    ],
  },
  {
    name: 'B',
    minor: 'G#m',
    accidentals: '5 個升號 (F#, C#, G#, D#, A#)',
    accidentalCount: 5,
    accidentalType: 'sharp',
    angle: 150,
    scale: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
    chords: [
      { degree: '主和弦', roman: 'I', name: 'B', type: 'major', notes: ['B3', 'D#4', 'F#4'] },
      { degree: '上主和弦', roman: 'ii', name: 'C#m', type: 'minor', notes: ['C#4', 'E4', 'G#4'] },
      { degree: '中和弦', roman: 'iii', name: 'D#m', type: 'minor', notes: ['D#4', 'F#4', 'A#4'] },
      { degree: '下屬和弦', roman: 'IV', name: 'E', type: 'major', notes: ['E4', 'G#4', 'B4'] },
      { degree: '屬和弦', roman: 'V', name: 'F#', type: 'major', notes: ['F#4', 'A#4', 'C#5'] },
      { degree: '關係小調', roman: 'vi', name: 'G#m', type: 'minor', notes: ['G#4', 'B4', 'D#5'] },
      { degree: '導和弦', roman: 'vii°', name: 'A#dim', type: 'diminished', notes: ['A#4', 'C#5', 'E5'] },
    ],
    progressions: [
      { name: '流行萬能進行', progression: 'I - V - vi - IV', chords: ['B', 'F#', 'G#m', 'E'], description: '華麗且具張力的高音調' },
    ],
  },
  {
    name: 'F#',
    minor: 'D#m',
    accidentals: '6 個升號 (等音 Gb / 6 降號)',
    accidentalCount: 6,
    accidentalType: 'sharp',
    angle: 180,
    scale: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
    chords: [
      { degree: '主和弦', roman: 'I', name: 'F#', type: 'major', notes: ['F#3', 'A#3', 'C#4'] },
      { degree: '上主和弦', roman: 'ii', name: 'G#m', type: 'minor', notes: ['G#3', 'B3', 'D#4'] },
      { degree: '中和弦', roman: 'iii', name: 'A#m', type: 'minor', notes: ['A#3', 'C#4', 'E#4'] },
      { degree: '下屬和弦', roman: 'IV', name: 'B', type: 'major', notes: ['B3', 'D#4', 'F#4'] },
      { degree: '屬和弦', roman: 'V', name: 'C#', type: 'major', notes: ['C#4', 'E#4', 'G#4'] },
      { degree: '關係小調', roman: 'vi', name: 'D#m', type: 'minor', notes: ['D#4', 'F#4', 'A#4'] },
      { degree: '導和弦', roman: 'vii°', name: 'E#dim', type: 'diminished', notes: ['E#4', 'G#4', 'B4'] },
    ],
    progressions: [
      { name: '抒情進行', progression: 'I - V - vi - IV', chords: ['F#', 'C#', 'D#m', 'B'], description: '鋼琴黑鍵豐富的深邃色彩' },
    ],
  },
  {
    name: 'Db',
    minor: 'Bbm',
    accidentals: '5 個降號 (Bb, Eb, Ab, Db, Gb)',
    accidentalCount: 5,
    accidentalType: 'flat',
    angle: 210,
    scale: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
    chords: [
      { degree: '主和弦', roman: 'I', name: 'Db', type: 'major', notes: ['C#3', 'F3', 'G#3'] },
      { degree: '上主和弦', roman: 'ii', name: 'Ebm', type: 'minor', notes: ['D#3', 'F#3', 'A#3'] },
      { degree: '中和弦', roman: 'iii', name: 'Fm', type: 'minor', notes: ['F3', 'G#3', 'C4'] },
      { degree: '下屬和弦', roman: 'IV', name: 'Gb', type: 'major', notes: ['F#3', 'A#3', 'C#4'] },
      { degree: '屬和弦', roman: 'V', name: 'Ab', type: 'major', notes: ['G#3', 'C4', 'D#4'] },
      { degree: '關係小調', roman: 'vi', name: 'Bbm', type: 'minor', notes: ['A#3', 'C#4', 'F4'] },
      { degree: '導和弦', roman: 'vii°', name: 'Cdim', type: 'diminished', notes: ['C4', 'D#4', 'F#4'] },
    ],
    progressions: [
      { name: 'R&B 經典進行', progression: 'IV - V - iii - vi', chords: ['Gb', 'Ab', 'Fm', 'Bbm'], description: '極度溫柔深情的 R&B / Soul 進行' },
    ],
  },
  {
    name: 'Ab',
    minor: 'Fm',
    accidentals: '4 個降號 (Bb, Eb, Ab, Db)',
    accidentalCount: 4,
    accidentalType: 'flat',
    angle: 240,
    scale: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
    chords: [
      { degree: '主和弦', roman: 'I', name: 'Ab', type: 'major', notes: ['G#3', 'C4', 'D#4'] },
      { degree: '上主和弦', roman: 'ii', name: 'Bbm', type: 'minor', notes: ['A#3', 'C#4', 'F4'] },
      { degree: '中和弦', roman: 'iii', name: 'Cm', type: 'minor', notes: ['C4', 'D#4', 'G4'] },
      { degree: '下屬和弦', roman: 'IV', name: 'Db', type: 'major', notes: ['C#4', 'F4', 'G#4'] },
      { degree: '屬和弦', roman: 'V', name: 'Eb', type: 'major', notes: ['D#4', 'G4', 'A#4'] },
      { degree: '關係小調', roman: 'vi', name: 'Fm', type: 'minor', notes: ['F4', 'G#4', 'C5'] },
      { degree: '導和弦', roman: 'vii°', name: 'Gdim', type: 'diminished', notes: ['G4', 'A#4', 'C#5'] },
    ],
    progressions: [
      { name: '經典進行', progression: 'I - V - vi - IV', chords: ['Ab', 'Eb', 'Fm', 'Db'], description: '溫暖醇厚的流行女聲調性' },
    ],
  },
  {
    name: 'Eb',
    minor: 'Cm',
    accidentals: '3 個降號 (Bb, Eb, Ab)',
    accidentalCount: 3,
    accidentalType: 'flat',
    angle: 270,
    scale: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
    chords: [
      { degree: '主和弦', roman: 'I', name: 'Eb', type: 'major', notes: ['D#3', 'G3', 'A#3'] },
      { degree: '上主和弦', roman: 'ii', name: 'Fm', type: 'minor', notes: ['F3', 'G#3', 'C4'] },
      { degree: '中和弦', roman: 'iii', name: 'Gm', type: 'minor', notes: ['G3', 'A#3', 'D4'] },
      { degree: '下屬和弦', roman: 'IV', name: 'Ab', type: 'major', notes: ['G#3', 'C4', 'D#4'] },
      { degree: '屬和弦', roman: 'V', name: 'Bb', type: 'major', notes: ['A#3', 'D4', 'F4'] },
      { degree: '關係小調', roman: 'vi', name: 'Cm', type: 'minor', notes: ['C4', 'D#4', 'G4'] },
      { degree: '導和弦', roman: 'vii°', name: 'Ddim', type: 'diminished', notes: ['D4', 'F4', 'G#4'] },
    ],
    progressions: [
      { name: '讚美詩/爵士進行', progression: 'I - vi - ii - V', chords: ['Eb', 'Cm', 'Fm', 'Bb'], description: '銅管樂隊最愛調性，端莊高雅' },
    ],
  },
  {
    name: 'Bb',
    minor: 'Gm',
    accidentals: '2 個降號 (Bb, Eb)',
    accidentalCount: 2,
    accidentalType: 'flat',
    angle: 300,
    scale: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
    chords: [
      { degree: '主和弦', roman: 'I', name: 'Bb', type: 'major', notes: ['A#3', 'D4', 'F4'] },
      { degree: '上主和弦', roman: 'ii', name: 'Cm', type: 'minor', notes: ['C4', 'D#4', 'G4'] },
      { degree: '中和弦', roman: 'iii', name: 'Dm', type: 'minor', notes: ['D4', 'F4', 'A4'] },
      { degree: '下屬和弦', roman: 'IV', name: 'Eb', type: 'major', notes: ['D#4', 'G4', 'A#4'] },
      { degree: '屬和弦', roman: 'V', name: 'F', type: 'major', notes: ['F4', 'A4', 'C5'] },
      { degree: '關係小調', roman: 'vi', name: 'Gm', type: 'minor', notes: ['G4', 'A#4', 'D5'] },
      { degree: '導和弦', roman: 'vii°', name: 'Adim', type: 'diminished', notes: ['A4', 'C5', 'D#5'] },
    ],
    progressions: [
      { name: '抒情進行', progression: 'I - V - vi - IV', chords: ['Bb', 'F', 'Gm', 'Eb'], description: '流行情歌與薩克斯風標準調性' },
    ],
  },
  {
    name: 'F',
    minor: 'Dm',
    accidentals: '1 個降號 (Bb)',
    accidentalCount: 1,
    accidentalType: 'flat',
    angle: 330,
    scale: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    chords: [
      { degree: '主和弦 (Tonic)', roman: 'I', name: 'F', type: 'major', notes: ['F3', 'A3', 'C4'] },
      { degree: '上主和弦', roman: 'ii', name: 'Gm', type: 'minor', notes: ['G3', 'A#3', 'D4'] },
      { degree: '中和弦', roman: 'iii', name: 'Am', type: 'minor', notes: ['A3', 'C4', 'E4'] },
      { degree: '下屬和弦 (Subdominant)', roman: 'IV', name: 'Bb', type: 'major', notes: ['A#3', 'D4', 'F4'] },
      { degree: '屬和弦 (Dominant)', roman: 'V', name: 'C', type: 'major', notes: ['C4', 'E4', 'G4'] },
      { degree: '關係小調 (Submediant)', roman: 'vi', name: 'Dm', type: 'minor', notes: ['D4', 'F4', 'A4'] },
      { degree: '導和弦', roman: 'vii°', name: 'Edim', type: 'diminished', notes: ['E4', 'G4', 'A#4'] },
    ],
    progressions: [
      { name: '王道抒情進行', progression: 'I - V - vi - IV', chords: ['F', 'C', 'Dm', 'Bb'], description: '清澈感人，常見於吉他與鋼琴抒情名作' },
    ],
  },
];

// Semitone map for Transposition tool
const SEMITONES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const EQUIVALENT_MAP: Record<string, string> = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

export const CircleOfFifths: React.FC = () => {
  const [selectedKeyName, setSelectedKeyName] = useState<string>('C');
  const [isPlayingChord, setIsPlayingChord] = useState<string | null>(null);

  // Transposition tool state
  const [transSourceKey, setTransSourceKey] = useState<string>('G');
  const [transTargetKey, setTransTargetKey] = useState<string>('C');
  const [customChordsText, setCustomChordsText] = useState<string>('G - D - Em - C');

  const currentKey = KEYS_DATA.find((k) => k.name === selectedKeyName) || KEYS_DATA[0];

  const playChordNotes = (notes: string[], label: string) => {
    setIsPlayingChord(label);
    const freqs = notes.map((n) => audioEngine.noteToFreq(n)).filter((f) => f > 0);
    audioEngine.playChord(freqs, true, 1.4);
    setTimeout(() => {
      setIsPlayingChord(null);
    }, 1200);
  };

  const playProgression = (chords: string[]) => {
    let delay = 0;
    chords.forEach((ch, idx) => {
      setTimeout(() => {
        setIsPlayingChord(ch);
        const chordObj = currentKey.chords.find((c) => c.name === ch);
        if (chordObj) {
          playChordNotes(chordObj.notes, ch);
        } else {
          // Fallback root note arpeggio
          const root = ch.replace(/m|dim|7|maj/g, '');
          const baseFreq = audioEngine.noteToFreq(`${root}3`) || 261.63;
          audioEngine.playPianoNote(baseFreq, 1.2);
        }
      }, delay * 1000);
      delay += 1.2;
    });

    setTimeout(() => {
      setIsPlayingChord(null);
    }, delay * 1000 + 300);
  };

  // Transpose calculation
  const getSemitoneIndex = (key: string): number => {
    const normalized = EQUIVALENT_MAP[key] || key;
    return SEMITONES.indexOf(normalized);
  };

  const calculateTransposedChords = (): string[] => {
    const srcIdx = getSemitoneIndex(transSourceKey);
    const tgtIdx = getSemitoneIndex(transTargetKey);
    if (srcIdx === -1 || tgtIdx === -1) return [];

    let diff = tgtIdx - srcIdx;
    if (diff < -6) diff += 12;
    if (diff > 6) diff -= 12;

    const rawList = customChordsText
      .split(/[\s,-]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return rawList.map((ch) => {
      // Parse root and quality
      const match = ch.match(/^([A-G][b#]?)(.*)$/);
      if (!match) return ch;
      const root = match[1];
      const suffix = match[2];
      const rootIdx = getSemitoneIndex(root);
      if (rootIdx === -1) return ch;

      let newIdx = (rootIdx + diff + 12) % 12;
      return `${SEMITONES[newIdx]}${suffix}`;
    });
  };

  const transposedList = calculateTransposedChords();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
              <Layers className="w-4 h-4" />
              <span>樂理核心羅盤 · 調性與和弦家族</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              五度圈轉調與家族和弦推算盤 (Circle of Fifths)
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              點擊圓盤任意調性，即時掌握其<strong>升降號數量</strong>、<strong>關係大小調</strong>與<strong>7 大家族和弦</strong>，並可一鍵試聽與即時移調計算！
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
            <span className="text-xs text-slate-400">當前鎖定調性：</span>
            <span className="text-lg font-bold text-amber-400 font-mono">{currentKey.name} 大調</span>
            <span className="text-xs text-slate-500">/</span>
            <span className="text-sm text-slate-300 font-mono">{currentKey.minor} 小調</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Circle of Fifths, Right Key Info & Family Chords */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual SVG Circle */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-5 shadow-xl">
          <div className="flex items-center justify-between w-full px-2 text-xs">
            <span className="text-slate-400">順時針：多一個升號 (♯)</span>
            <span className="text-slate-400">逆時針：多一個降號 (♭)</span>
          </div>

          {/* Interactive SVG Wheel */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none">
            {/* Center Hub */}
            <div className="absolute w-24 h-24 rounded-full bg-slate-950 border-2 border-amber-500/40 flex flex-col items-center justify-center shadow-lg shadow-amber-500/10 z-10">
              <span className="text-xs text-slate-400">當前調性</span>
              <span className="text-2xl font-bold text-amber-400 font-mono">{currentKey.name}</span>
              <span className="text-[11px] text-slate-300 font-mono">{currentKey.minor}</span>
            </div>

            {/* Render 12 Keys around the circle */}
            <svg className="w-full h-full" viewBox="0 0 320 320">
              {/* Outer guide ring */}
              <circle cx="160" cy="160" r="145" fill="none" stroke="#1e293b" strokeWidth="2" />
              <circle cx="160" cy="160" r="105" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

              {KEYS_DATA.map((k) => {
                const rad = ((k.angle - 90) * Math.PI) / 180;
                const xMajor = 160 + 124 * Math.cos(rad);
                const yMajor = 160 + 124 * Math.sin(rad);

                const xMinor = 160 + 82 * Math.cos(rad);
                const yMinor = 160 + 82 * Math.sin(rad);

                const isSelected = k.name === selectedKeyName;

                return (
                  <g
                    key={k.name}
                    className="cursor-pointer group"
                    onClick={() => setSelectedKeyName(k.name)}
                  >
                    {/* Key Button Circle */}
                    <circle
                      cx={xMajor}
                      cy={yMajor}
                      r="18"
                      className={`transition-all duration-200 ${
                        isSelected
                          ? 'fill-amber-500 stroke-amber-300 stroke-2 filter drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))'
                          : 'fill-slate-800 stroke-slate-700 hover:fill-slate-700 group-hover:stroke-amber-400'
                      }`}
                    />
                    <text
                      x={xMajor}
                      y={yMajor + 4}
                      textAnchor="middle"
                      className={`text-xs font-bold font-mono pointer-events-none select-none ${
                        isSelected ? 'fill-slate-950 font-black' : 'fill-white'
                      }`}
                    >
                      {k.name}
                    </text>

                    {/* Inner Relative Minor Label */}
                    <text
                      x={xMinor}
                      y={yMinor + 3}
                      textAnchor="middle"
                      className={`text-[10px] font-mono pointer-events-none select-none transition-colors ${
                        isSelected ? 'fill-amber-300 font-bold' : 'fill-slate-400 group-hover:fill-slate-200'
                      }`}
                    >
                      {k.minor}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xs text-amber-300 font-medium">
              調號特徵：{currentKey.accidentals}
            </div>
            <div className="text-[11px] text-slate-400">
              音階：{currentKey.scale.join(' - ')}
            </div>
          </div>
        </div>

        {/* Right Column: Diatonic Chords & Progressions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Diatonic Chord Family (7 和弦) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {currentKey.name} 大調家族和弦 (Diatonic Chords)
                </h3>
              </div>
              <span className="text-xs text-slate-400">點擊喇叭即時試聽和弦聲音</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {currentKey.chords.map((ch) => (
                <div
                  key={ch.roman}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-between gap-1.5 transition-all text-center ${
                    ch.roman === 'I' || ch.roman === 'IV' || ch.roman === 'V'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : ch.roman === 'vi'
                        ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400">{ch.roman} 級</span>
                  <span className="text-base font-bold font-mono text-white">{ch.name}</span>
                  <span className="text-[9px] text-slate-400 truncate max-w-full">
                    {ch.degree.split(' ')[0]}
                  </span>

                  <button
                    onClick={() => playChordNotes(ch.notes, ch.name)}
                    className={`mt-1 p-1.5 rounded-lg text-xs cursor-pointer transition-colors flex items-center justify-center ${
                      isPlayingChord === ch.name
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800'
                    }`}
                    title={`試聽 ${ch.name} 和弦`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40 border border-amber-400"></span>
                <span>I, IV, V：大三和弦 (三大正和弦)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/40 border border-indigo-400"></span>
                <span>vi：關係小調主和弦</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></span>
                <span>ii, iii, vii°：副三和弦</span>
              </span>
            </div>
          </div>

          {/* Common Chord Progressions in this key */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>此調熱門經典和弦進行 (Playable Progressions)</span>
              </h3>
            </div>

            <div className="space-y-3">
              {currentKey.progressions.map((prog, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{prog.name}</span>
                      <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {prog.progression}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-slate-200">
                      {prog.chords.map((c, cIdx) => (
                        <React.Fragment key={cIdx}>
                          <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                            {c}
                          </span>
                          {cIdx < prog.chords.length - 1 && <span className="text-slate-500">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">{prog.description}</p>
                  </div>

                  <button
                    onClick={() => playProgression(prog.chords)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md shadow-amber-500/10"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>依序試聽</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Smart Transposition Tool (實用曲目移調計算機) */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>曲目一鍵移調計算機 (Song Transposition Assistant)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                歌手定調 · 換調彈唱必備
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              遇上原調太高或太低？輸入整段和弦，選定原調與目標調，立即推算移調後的最佳和弦，不再手忙腳亂數半音！
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">原本歌曲調性 (From Key)：</label>
            <select
              value={transSourceKey}
              onChange={(e) => setTransSourceKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {KEYS_DATA.map((k) => (
                <option key={k.name} value={k.name}>
                  {k.name} 大調 ({k.minor} 小調)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">想移到的目標調 (To Key)：</label>
            <select
              value={transTargetKey}
              onChange={(e) => setTransTargetKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {KEYS_DATA.map((k) => (
                <option key={k.name} value={k.name}>
                  {k.name} 大調 ({k.minor} 小調)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">快速選擇常見進行：</label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setCustomChordsText('G - D - Em - C')}
                className="px-2.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 cursor-pointer"
              >
                1-5-6-4
              </button>
              <button
                type="button"
                onClick={() => setCustomChordsText('C - G/B - Am - F')}
                className="px-2.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 cursor-pointer"
              >
                卡農進行
              </button>
              <button
                type="button"
                onClick={() => setCustomChordsText('F - G - Em - Am')}
                className="px-2.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 cursor-pointer"
              >
                4-5-3-6
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">輸入原和弦 (可用空格或橫線分隔)：</label>
          <input
            type="text"
            value={customChordsText}
            onChange={(e) => setCustomChordsText(e.target.value)}
            placeholder="例如: G - D - Em - C 或 C Am F G"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Calculation Result Preview Box */}
        <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-medium">移調推算結果：</span>
            <div className="flex flex-wrap items-center gap-2 font-mono text-base font-bold text-amber-400">
              {transposedList.map((ch, i) => (
                <React.Fragment key={i}>
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300">
                    {ch}
                  </span>
                  {i < transposedList.length - 1 && <span className="text-slate-600">→</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="text-[11px] text-slate-400">
              從 {transSourceKey} 調 ➔ {transTargetKey} 調，半音差距：
              {(() => {
                const s = getSemitoneIndex(transSourceKey);
                const t = getSemitoneIndex(transTargetKey);
                let diff = t - s;
                if (diff < -6) diff += 12;
                if (diff > 6) diff -= 12;
                return diff >= 0 ? `+${diff} 個半音 (升調)` : `${diff} 個半音 (降調)`;
              })()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Play transposed chords
                let delay = 0;
                transposedList.forEach((ch) => {
                  setTimeout(() => {
                    const root = ch.replace(/m|dim|7|maj/g, '');
                    const freq = audioEngine.noteToFreq(`${root}3`) || 261.63;
                    const isMinor = ch.includes('m') && !ch.includes('maj');
                    const thirdFreq = freq * (isMinor ? Math.pow(2, 3 / 12) : Math.pow(2, 4 / 12));
                    const fifthFreq = freq * Math.pow(2, 7 / 12);
                    audioEngine.playChord([freq, thirdFreq, fifthFreq], true, 1.2);
                  }, delay * 1000);
                  delay += 1.0;
                });
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Volume2 className="w-4 h-4" />
              <span>試聽移調後和弦進行</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
