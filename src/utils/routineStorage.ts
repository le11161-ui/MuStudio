export interface RoutineStep {
  id: string;
  order: number;
  title: string;
  targetMinutes: number;
  category: 'warmup' | 'chords' | 'song' | 'ear' | 'rhythm' | 'theory' | 'review';
  categoryLabel: string;
  toolRoute: string; // 'tools', 'metronome', 'circle', 'ear', 'songguide', 'skilltree', 'coach', 'profile'
  toolLabel: string;
  notes: string;
  completed: boolean;
}

export interface DailyRoutinePlan {
  date: string; // YYYY-MM-DD
  routineName: string;
  totalPlannedMinutes: number;
  steps: RoutineStep[];
  updatedAt: number;
}

const STORAGE_KEY = 'mustudio_today_routine_plan';

export const DEFAULT_PRESET_ROUTINES: {
  id: string;
  name: string;
  badge: string;
  description: string;
  steps: Omit<RoutineStep, 'id' | 'order' | 'completed'>[];
}[] = [
  {
    id: 'preset-quick-30',
    name: '⚡ 30分鐘超高效每日精修單',
    badge: '日常首選 · 30m',
    description: '適合上課或工作之餘的短時間練習，熱身、和弦、曲目攻克與打卡一步到位。',
    steps: [
      {
        title: 'Step 1: 五度圈哈農爬音與音階熱身',
        targetMinutes: 5,
        category: 'warmup',
        categoryLabel: '熱身暖手',
        toolRoute: 'circle',
        toolLabel: '五度圈轉調盤',
        notes: '順著 C 大調爬 1-2-3-4-5-4-3-2 音階，手指放鬆自然垂直觸鍵。',
      },
      {
        title: 'Step 2: 4536251 與流行常態和弦轉換',
        targetMinutes: 10,
        category: 'chords',
        categoryLabel: '和聲練習',
        toolRoute: 'toolbox',
        toolLabel: '和弦指法庫',
        notes: '練習 Fmaj7 換 Em7 換 Dm7，左手根音無延遲滑入，消除停頓。',
      },
      {
        title: 'Step 3: 主攻曲目難點段落慢速攻克',
        targetMinutes: 10,
        category: 'song',
        categoryLabel: '曲目實戰',
        toolRoute: 'songguide',
        toolLabel: '曲目高效練法與琴鍵',
        notes: '打開雙八度發光琴鍵導引，先以原速 60% 練熟副歌前 4 小節。',
      },
      {
        title: 'Step 4: 今日成果驗收與打卡寫日誌',
        targetMinutes: 5,
        category: 'review',
        categoryLabel: '打卡反思',
        toolRoute: 'profile',
        toolLabel: '今日練習日誌',
        notes: '總結今天手感，評選 1~5 顆星並記錄做得很棒的優點與弱項。',
      },
    ],
  },
  {
    id: 'preset-pop-45',
    name: '🎹 45分鐘流行彈唱實戰特訓單',
    badge: '彈唱進階 · 45m',
    description: '著重雙手獨立、七和弦質感與即興彈唱，配合智慧節拍器穩固律動感。',
    steps: [
      {
        title: 'Step 1: 節拍器 65 BPM 慢速拍點穩定暖手',
        targetMinutes: 10,
        category: 'rhythm',
        categoryLabel: '律動熱身',
        toolRoute: 'metronome',
        toolLabel: '智慧節拍器',
        notes: '配合節拍器打點，每拍均勻彈奏八分音符，不搶拍不拖拍。',
      },
      {
        title: 'Step 2: 大七和弦 (Maj7) 與九和弦色彩堆疊',
        targetMinutes: 15,
        category: 'chords',
        categoryLabel: '大師和聲',
        toolRoute: 'toolbox',
        toolLabel: '和弦指法庫',
        notes: '右手彈 3-5-7-9 音，左手彈根音與八度，體會 Neo-Soul 慵懶色彩。',
      },
      {
        title: 'Step 3: 攻克曲目《晴天》前奏吉他分解與副歌',
        targetMinutes: 15,
        category: 'song',
        categoryLabel: '曲目攻克',
        toolRoute: 'songguide',
        toolLabel: '曲目高效練法',
        notes: '對照琴鍵指引練習切分音節奏，邊彈邊跟著輕聲哼唱旋律。',
      },
      {
        title: 'Step 4: 聽音盲測 3 題驗收耳朵敏銳度',
        targetMinutes: 5,
        category: 'ear',
        categoryLabel: '耳力盲測',
        toolRoute: 'ear',
        toolLabel: '聽音盲測中心',
        notes: '閉上眼睛分辨大三和弦與小三和弦的色彩明暗，賺取連勝 XP！',
      },
    ],
  },
  {
    id: 'preset-deep-60',
    name: '🧗 60分鐘大師級深度破關單',
    badge: '深度破關 · 60m',
    description: '針對手指卡關瓶頸、背譜盲彈與大師即興進行深耕突破，收穫感最強。',
    steps: [
      {
        title: 'Step 1: 左右手獨立節奏分拍特訓 (Polyrhythm)',
        targetMinutes: 10,
        category: 'rhythm',
        categoryLabel: '獨立熱身',
        toolRoute: 'metronome',
        toolLabel: '智慧節拍器',
        notes: '左手打四分音符，右手打附點或切分音，打通左右大腦協調。',
      },
      {
        title: 'Step 2: 難點段落循環慢練 3 次無失誤法',
        targetMinutes: 20,
        category: 'song',
        categoryLabel: '難點粉碎',
        toolRoute: 'songguide',
        toolLabel: '曲目高效練法',
        notes: '鎖定最容易彈錯的那 2 個小節，連續彈對 3 次才能每次 +5 BPM。',
      },
      {
        title: 'Step 3: 不看手盲彈與全曲一氣呵成背彈',
        targetMinutes: 15,
        category: 'song',
        categoryLabel: '全曲連貫',
        toolRoute: 'profile',
        toolLabel: '練琴碼表計時',
        notes: '抬頭看前方或閉眼彈奏，完全依靠指尖空間記憶完成整首曲目。',
      },
      {
        title: 'Step 4: 技能地圖探索新樂理與弱項體檢',
        targetMinutes: 10,
        category: 'theory',
        categoryLabel: '樂理進階',
        toolRoute: 'skilltree',
        toolLabel: '4大樂器技能樹',
        notes: '點選一個尚未點亮的技能（如離調轉調或減七和弦），研讀核心觀念。',
      },
      {
        title: 'Step 5: AI 音樂教練複盤諮詢與成果存檔',
        targetMinutes: 5,
        category: 'review',
        categoryLabel: '教練複盤',
        toolRoute: 'coach',
        toolLabel: 'AI 個人教練',
        notes: '向教練提問今天卡關最久的問題，獲取下次練習的分解改善方案。',
      },
    ],
  },
  {
    id: 'preset-create-25',
    name: '🎧 25分鐘音感與創作靈感單',
    badge: '創作靈感 · 25m',
    description: '專為寫歌、抓歌、配和聲打造，啟發無限音樂靈感與旋律動機。',
    steps: [
      {
        title: 'Step 1: 五度圈尋找迷人調式互換和弦',
        targetMinutes: 8,
        category: 'chords',
        categoryLabel: '和聲探索',
        toolRoute: 'circle',
        toolLabel: '五度圈轉調盤',
        notes: '在大調進行中嘗試借用同名小調的 bVI (如 C調借用 Abmaj7)。',
      },
      {
        title: 'Step 2: 單音與和弦盲測喚醒耳朵共鳴',
        targetMinutes: 8,
        category: 'ear',
        categoryLabel: '耳力抓歌',
        toolRoute: 'ear',
        toolLabel: '聽音盲測中心',
        notes: '聽辨 Bass 根音跳動，提升日常聽歌時盲抓和弦的精準度。',
      },
      {
        title: 'Step 3: AI 教練重配和聲機發想副歌動機',
        targetMinutes: 9,
        category: 'theory',
        categoryLabel: 'AI創作',
        toolRoute: 'coach',
        toolLabel: 'AI 個人教練',
        notes: '輸入一段喜歡的簡單旋律，讓 AI 教練給出 2 組全新高級進行！',
      },
    ],
  },
];

export const loadDailyRoutinePlan = (): DailyRoutinePlan => {
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DailyRoutinePlan = JSON.parse(raw);
      // If plan is from today, return it
      if (parsed.date === todayStr && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse daily routine plan', e);
  }

  // Fallback: initialize with preset 1
  return buildPlanFromPreset(DEFAULT_PRESET_ROUTINES[0]);
};

export const saveDailyRoutinePlan = (plan: DailyRoutinePlan) => {
  try {
    plan.updatedAt = Date.now();
    plan.totalPlannedMinutes = plan.steps.reduce((acc, s) => acc + (Number(s.targetMinutes) || 0), 0);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed to save daily routine plan', e);
  }
};

export const buildPlanFromPreset = (preset: typeof DEFAULT_PRESET_ROUTINES[0]): DailyRoutinePlan => {
  const todayStr = new Date().toISOString().split('T')[0];
  const steps: RoutineStep[] = preset.steps.map((st, idx) => ({
    ...st,
    id: `step-${Date.now()}-${idx}`,
    order: idx + 1,
    completed: false,
  }));

  const plan: DailyRoutinePlan = {
    date: todayStr,
    routineName: preset.name,
    totalPlannedMinutes: steps.reduce((sum, s) => sum + s.targetMinutes, 0),
    steps,
    updatedAt: Date.now(),
  };

  saveDailyRoutinePlan(plan);
  return plan;
};
