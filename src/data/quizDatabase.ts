import { QuizQuestion } from '../types/music';

export const EAR_TRAINING_QUESTIONS: QuizQuestion[] = [
  {
    id: 'ear-1',
    type: 'pitch',
    question: '聽聽看這顆音，它是大調音階中的哪一個唱名？',
    hint: '提示：以中央 C (Do = 261.63Hz) 為基準，這顆音在第 5 階（高挺明亮的屬音）。',
    options: ['Do (C)', 'Mi (E)', 'Sol (G)', 'La (A)'],
    correctAnswer: 'Sol (G)',
    explanation: '這是 G4 (Sol，392.00 Hz)，是大調音階中除了 Do 以外最穩固明亮的五度音！',
    audioPayload: {
      frequencies: [392.00],
      duration: 1.2
    }
  },
  {
    id: 'ear-2',
    type: 'pitch',
    question: '聽聽看這顆音，它是哪一個唱名？',
    hint: '提示：給人溫暖、安定、像陽光一樣的大三度音。',
    options: ['Re (D)', 'Mi (E)', 'Fa (F)', 'Ti (B)'],
    correctAnswer: 'Mi (E)',
    explanation: '這是 E4 (Mi，329.63 Hz)，它是決定大調聽起來「開心」的關鍵第三階音！',
    audioPayload: {
      frequencies: [329.63],
      duration: 1.2
    }
  },
  {
    id: 'ear-3',
    type: 'chord_quality',
    question: '仔細聆聽這組同時彈下的和弦，它是「大調 (開心明亮)」還是「小調 (憂鬱深沉)」？',
    hint: '提示：注意中間的三音是開朗還是略帶嘆息感。',
    options: ['大三和弦 (Major)', '小三和弦 (Minor)', '減和弦 (Diminished)', '掛四和弦 (Sus4)'],
    correctAnswer: '小三和弦 (Minor)',
    explanation: '這是 A 小三和弦 (Am: A-C-E)，小三度音程賦予它深刻而柔和的憂鬱氣質。',
    audioPayload: {
      frequencies: [220.00, 261.63, 329.63],
      isChord: true,
      duration: 1.8
    }
  },
  {
    id: 'ear-4',
    type: 'chord_quality',
    question: '聽聽看這個和弦，它是屬於哪種情緒色彩？',
    hint: '提示：聲音寬廣、明亮、純淨、像陽光破雲而出。',
    options: ['大三和弦 (Major)', '小三和弦 (Minor)', '屬七和弦 (Dominant 7th)', '減七和弦 (Dim7)'],
    correctAnswer: '大三和弦 (Major)',
    explanation: '這是 C 大三和弦 (C-E-G)，由根音加上大三度與純五度構成，是最經典的明亮主和聲。',
    audioPayload: {
      frequencies: [261.63, 329.63, 392.00],
      isChord: true,
      duration: 1.8
    }
  },
  {
    id: 'ear-5',
    type: 'chord_quality',
    question: '聽聽看這個具有懸疑期待感、帶著「藍調」色彩的和弦？',
    hint: '提示：大三和弦疊加了小七度音，具有強烈的想要解決回家的推力。',
    options: ['大七和弦 (maj7)', '屬七和弦 (7th)', '小三和弦 (m)', '增和弦 (Aug)'],
    correctAnswer: '屬七和弦 (7th)',
    explanation: '這是 G 屬七和弦 (G7: G-B-D-F)，三全音 (B-F) 形成張力，讓耳朵強烈渴望回到 C 和弦！',
    audioPayload: {
      frequencies: [196.00, 246.94, 293.66, 349.23],
      isChord: true,
      duration: 1.8
    }
  }
];

export const RHYTHM_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'rhythm-1',
    type: 'rhythm',
    question: '仔細聽這段節奏，它的拍號與基本律動型態是什麼？',
    hint: '提示：數數看小鼓落在哪幾拍？（1-2-3-4，大鼓-小鼓-大鼓-小鼓）',
    options: ['4/4 拍 基礎 8 拍搖滾 (Basic 8-Beat)', '3/4 拍 華爾滋圓舞曲 (Waltz)', '6/8 拍 搖擺藍調 (Shuffle)', '2/4 拍 行進進行曲 (March)'],
    correctAnswer: '4/4 拍 基礎 8 拍搖滾 (Basic 8-Beat)',
    explanation: '大鼓在第 1、3 拍，小鼓在第 2、4 拍（Backbeat），搭配穩定八分音符 Hi-Hat，是經典 8-Beat！',
    audioPayload: {
      bpm: 100,
      rhythmPattern: [
        { sound: 'kick', time: 0 },
        { sound: 'hihat', time: 0 },
        { sound: 'hihat', time: 0.3 },
        { sound: 'snare', time: 0.6 },
        { sound: 'hihat', time: 0.6 },
        { sound: 'hihat', time: 0.9 },
        { sound: 'kick', time: 1.2 },
        { sound: 'hihat', time: 1.2 },
        { sound: 'hihat', time: 1.5 },
        { sound: 'snare', time: 1.8 },
        { sound: 'hihat', time: 1.8 },
        { sound: 'hihat', time: 2.1 }
      ]
    }
  },
  {
    id: 'rhythm-2',
    type: 'rhythm',
    question: '聽聽這段跳躍有彈性的鼓點，大鼓在第幾拍出現了切分音（提前/延遲踩踏）？',
    hint: '提示：第 3 拍的後半拍是不是有一顆踢鼓搶先蹬出來？',
    options: ['第 3 拍後半拍 (3 and) 切分', '第 2 拍前半拍', '第 4 拍正拍', '沒有任何切分音'],
    correctAnswer: '第 3 拍後半拍 (3 and) 切分',
    explanation: '大鼓在 3 拍後半拍切入，帶動身體微微向前傾的動感，是流行音樂最受歡迎的律動加花！',
    audioPayload: {
      bpm: 105,
      rhythmPattern: [
        { sound: 'kick', time: 0 },
        { sound: 'hihat', time: 0 },
        { sound: 'snare', time: 0.57 },
        { sound: 'kick', time: 1.42 }, // 3 and syncopation
        { sound: 'snare', time: 1.71 }
      ]
    }
  }
];

export const SIGHT_READING_NOTES = [
  { note: 'C4', name: '中央 C (Do)', staffPos: 10, clef: 'treble', key: 'C' },
  { note: 'D4', name: 'D (Re)', staffPos: 9, clef: 'treble', key: 'D' },
  { note: 'E4', name: '第一線 E (Mi)', staffPos: 8, clef: 'treble', key: 'E' },
  { note: 'F4', name: '第一間 F (Fa)', staffPos: 7, clef: 'treble', key: 'F' },
  { note: 'G4', name: '第二線 G (Sol)', staffPos: 6, clef: 'treble', key: 'G' },
  { note: 'A4', name: '第二間 A (La)', staffPos: 5, clef: 'treble', key: 'A' },
  { note: 'B4', name: '第三線 B (Ti)', staffPos: 4, clef: 'treble', key: 'B' },
  { note: 'C5', name: '第三間 高音 C', staffPos: 3, clef: 'treble', key: 'C' },
  { note: 'D5', name: '第四線 D', staffPos: 2, clef: 'treble', key: 'D' },
  { note: 'E5', name: '第四間 E', staffPos: 1, clef: 'treble', key: 'E' },
  { note: 'F5', name: '第五線 F', staffPos: 0, clef: 'treble', key: 'F' },
];
