import { UserMusicProfile, LEVEL_TITLES, SkillBadge, PracticeLogEntry, PracticeCondition } from '../types/profile';

const STORAGE_KEY = 'mustudio_user_music_profile';

const DEFAULT_BADGES: SkillBadge[] = [
  {
    id: 'badge-first-step',
    title: '啟航第一步',
    description: '完成第一項技能樹里程碑或完成一次聽力測驗',
    icon: '🌱',
    unlocked: true,
    unlockedAt: '今日',
  },
  {
    id: 'badge-chord-hero',
    title: '和弦征服者',
    description: '熟悉 C、G、Am、F 四大流行王道和弦指法',
    icon: '🎹',
    unlocked: false,
  },
  {
    id: 'badge-rhythm-master',
    title: '人體節拍器',
    description: '在智慧節拍器挑戰中達成 6 次以上完美拍點 (±25ms)',
    icon: '🥁',
    unlocked: false,
  },
  {
    id: 'badge-sight-reader',
    title: '五線譜破譯專家',
    description: '在 60 秒視奏快刷挑戰中連續答對 10 題以上',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'badge-song-creator',
    title: '創作初啼',
    description: '使用簡譜轉換器或向 AI 教練請教一首原創段落',
    icon: '✍️',
    unlocked: false,
  },
  {
    id: 'badge-daily-streak',
    title: '毅力音樂人',
    description: '連續 3 天以上打卡記錄練習時間',
    icon: '🔥',
    unlocked: false,
  },
];

export const loadUserProfile = (): UserMusicProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.badges || parsed.badges.length === 0) {
        parsed.badges = DEFAULT_BADGES;
      }
      // Migrate old logs if needed
      if (parsed.logs) {
        parsed.logs = parsed.logs.map((log: any) => ({
          ...log,
          condition: log.condition || 'good',
          rating: typeof log.rating === 'number' ? log.rating : 5,
          strengths: log.strengths || ['節奏穩定度保持良好'],
          needsImprovement: log.needsImprovement || ['特定和弦轉換仍需提速'],
        }));
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Error loading user profile:', err);
  }

  // Calculate initial XP from checked milestones if any exist
  let initialXp = 100;
  try {
    const milestones = localStorage.getItem('mustudio_completed_milestones');
    if (milestones) {
      const parsedM = JSON.parse(milestones);
      const checkedCount = Object.values(parsedM).filter(Boolean).length;
      initialXp += checkedCount * 50;
    }
  } catch {}

  const currentLevelInfo =
    [...LEVEL_TITLES].reverse().find((l) => initialXp >= l.minXp) || LEVEL_TITLES[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const defaultProfile: UserMusicProfile = {
    username: '音樂學員',
    level: currentLevelInfo.level,
    levelTitle: currentLevelInfo.title,
    totalXp: initialXp,
    selfAssessment: 'beginner',
    primaryGoal: '流暢彈唱一首流行歌並搞懂 4536 和弦進行',
    practiceDaysStreak: 2,
    lastPracticeDate: todayStr,
    totalPracticeMinutes: 75,
    instrumentProficiency: {
      piano: 2,
      guitar: 1,
      drums: 1,
      dtm: 1,
    },
    badges: DEFAULT_BADGES,
    logs: [
      {
        id: 'log-1',
        date: todayStr,
        minutes: 45,
        category: 'piano',
        condition: 'good',
        strengths: ['C 換到 Am 共同音保留得很乾淨', '能跟隨 70 BPM 節拍器四分音符'],
        needsImprovement: ['左手彈到 F 和弦時第 1 指容易過度緊繃', '換和弦速度仍需提升'],
        practiceItems: ['C', 'G', 'Am', 'F'],
        notes: '今天以慢速 70 BPM 練習四大王道和弦，左手先落拍的習慣漸漸建立起來了。',
      },
      {
        id: 'log-2',
        date: yesterdayStr,
        minutes: 30,
        category: 'sight_reading',
        condition: 'superb',
        strengths: ['視奏快刷測驗答對 12 題', '中央 C 到 G4 的位置一眼認出'],
        needsImprovement: ['高音譜號上加線的音符容易猶豫數數'],
        practiceItems: ['C4-C5 視奏快刷'],
        notes: '利用「線間幾何音程」的方法，不再每次都從下加一線往上數，視奏反應速度明顯變快！',
      },
    ],
  };

  saveUserProfile(defaultProfile);
  return defaultProfile;
};

export const saveUserProfile = (profile: UserMusicProfile) => {
  try {
    const currentLevelInfo =
      [...LEVEL_TITLES].reverse().find((l) => profile.totalXp >= l.minXp) || LEVEL_TITLES[0];
    profile.level = currentLevelInfo.level;
    profile.levelTitle = currentLevelInfo.title;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Error saving user profile:', err);
  }
};

export const addDetailedPracticeLog = (payload: {
  minutes: number;
  category: PracticeLogEntry['category'];
  condition: PracticeCondition;
  rating?: number;
  strengths: string[];
  needsImprovement: string[];
  practiceItems?: string[];
  notes: string;
}): UserMusicProfile => {
  const profile = loadUserProfile();
  const today = new Date().toISOString().split('T')[0];

  // Update streak if consecutive day
  if (profile.lastPracticeDate !== today) {
    const lastDate = new Date(profile.lastPracticeDate);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      profile.practiceDaysStreak += 1;
    } else if (diffDays > 1) {
      profile.practiceDaysStreak = 1;
    }
    profile.lastPracticeDate = today;
  }

  // Check 3-day streak badge
  if (profile.practiceDaysStreak >= 3) {
    const badge = profile.badges.find((b) => b.id === 'badge-daily-streak');
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      badge.unlockedAt = today;
    }
  }

  profile.totalPracticeMinutes += payload.minutes;
  // Award 2 XP per minute of practice + 20 XP bonus for detailed reflections
  profile.totalXp += payload.minutes * 2 + 20;

  profile.logs.unshift({
    id: `log-${Date.now()}`,
    date: today,
    minutes: payload.minutes,
    category: payload.category,
    condition: payload.condition,
    rating: payload.rating || 5,
    strengths: payload.strengths.filter(Boolean),
    needsImprovement: payload.needsImprovement.filter(Boolean),
    practiceItems: payload.practiceItems || [],
    notes: payload.notes,
  });

  saveUserProfile(profile);
  return profile;
};

export const deletePracticeLog = (logId: string): UserMusicProfile => {
  const profile = loadUserProfile();
  const target = profile.logs.find((l) => l.id === logId);
  if (target) {
    profile.totalPracticeMinutes = Math.max(0, profile.totalPracticeMinutes - target.minutes);
    profile.totalXp = Math.max(0, profile.totalXp - target.minutes * 2);
    profile.logs = profile.logs.filter((l) => l.id !== logId);
    saveUserProfile(profile);
  }
  return profile;
};

export const addXp = (amount: number): UserMusicProfile => {
  const profile = loadUserProfile();
  profile.totalXp += amount;
  saveUserProfile(profile);
  return profile;
};
