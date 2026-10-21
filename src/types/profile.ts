export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'performer';
export type PracticeCondition = 'superb' | 'good' | 'normal' | 'struggling';

export interface PracticeLogEntry {
  id: string;
  date: string;
  minutes: number;
  category: 'piano' | 'guitar' | 'drums' | 'dtm' | 'theory' | 'sight_reading';
  condition: PracticeCondition; // 練習手感與狀況
  rating?: number; // 1 to 5 本次練習自我評量星星數 ⭐
  strengths: string[]; // 今天做得很好 / 突破點
  needsImprovement: string[]; // 今天需要加強 / 待攻克瓶頸
  practiceItems?: string[]; // 練習的和弦或曲目
  notes: string;
}

export interface SkillBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserMusicProfile {
  username: string;
  level: number;
  levelTitle: string;
  totalXp: number;
  selfAssessment: ExperienceLevel;
  primaryGoal: string;
  practiceDaysStreak: number;
  lastPracticeDate: string;
  totalPracticeMinutes: number;
  instrumentProficiency: {
    piano: number; // 1 to 5
    guitar: number; // 1 to 5
    drums: number; // 1 to 5
    dtm: number; // 1 to 5
  };
  badges: SkillBadge[];
  logs: PracticeLogEntry[];
  aiAssessment?: {
    evaluatedAt: string;
    levelName: string;
    summary: string;
    strengths: string[];
    recommendedMilestone: string;
    weaknessRemedy?: string;
  };
}

export const LEVEL_TITLES = [
  { level: 1, title: '樂理探險新手 (Novice Explorer)', minXp: 0 },
  { level: 2, title: '和弦節拍學徒 (Chord Apprentice)', minXp: 200 },
  { level: 3, title: '流暢視奏樂手 (Groove Navigator)', minXp: 500 },
  { level: 4, title: '流行彈唱好手 (Ballad Performer)', minXp: 900 },
  { level: 5, title: '多聲部合奏專家 (Ensemble Specialist)', minXp: 1400 },
  { level: 6, title: '全能音樂創作者 (Master Producer)', minXp: 2000 },
];
