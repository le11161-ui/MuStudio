export type InstrumentCategory = 'piano' | 'guitar' | 'drums' | 'dtm';

export interface SkillNode {
  id: string;
  category: InstrumentCategory;
  stage: number;
  stageTitle: string;
  title: string;
  subtitle: string;
  level: '入門' | '進階' | '實戰' | '大師';
  description: string;
  milestones: string[];
  keyConcept: string;
  chordProgressionExample?: string[];
  tips: string[];
  audioDemoNotes?: { note: string; freq: number; duration: number }[];
  completed?: boolean;
}

export interface ChordDefinition {
  root: string;
  quality: string;
  name: string;
  description: string;
  formula: string;
  notes: string[];
  pianoKeys: number[]; // MIDI note or index from C3 (e.g. 0 = C3, 4 = E3, 7 = G3)
  pianoFingerings: string[]; // e.g. ["1", "3", "5"]
  guitar: {
    frets: (number | 'x')[]; // 6 strings: [E, A, D, G, B, e]
    fingers: (number | null)[]; // 1=index, 2=middle, 3=ring, 4=pinky
    baseFret: number;
  };
  ukulele: {
    frets: (number | 'x')[]; // 4 strings: [G, C, E, A]
    fingers: (number | null)[];
    baseFret: number;
  };
}

export type TimeSignature = '4/4' | '3/4' | '2/4' | '6/8';
export type Subdivision = 'quarter' | 'eighth' | 'sixteenth' | 'triplet' | 'swing';

export interface QuizQuestion {
  id: string;
  type: 'pitch' | 'chord_quality' | 'rhythm';
  question: string;
  hint: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  audioPayload: {
    frequencies?: number[];
    isChord?: boolean;
    duration?: number;
    rhythmPattern?: { sound: 'kick' | 'snare' | 'hihat'; time: number }[];
    bpm?: number;
  };
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  imagePreview?: string;
  audioPreview?: string;
  socraticSuggestions?: string[];
  interactiveDemo?: {
    type: 'chord' | 'rhythm' | 'melody';
    title: string;
    notes?: string[];
  };
}
