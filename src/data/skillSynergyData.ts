export interface SkillSynergyItem {
  id: string;
  primarySkill: string;
  category: 'piano' | 'guitar' | 'drums' | 'dtm' | 'general';
  categoryLabel: string;
  icon: string;
  tagline: string;
  bestPairing: {
    skillName: string;
    whyPair: string;
    synergyScore: number; // e.g. 98%
    category: string;
  };
  hiddenWeakness: {
    symptom: string;
    rootCause: string;
    dangerLevel: '高' | '中' | '關鍵';
  };
  remedyRoutine: {
    step1: string;
    step2: string;
    step3: string;
    dailyMinutes: number;
  };
  targetToolTab: 'toolbox' | 'metronome' | 'stave' | 'quiz' | 'coach';
  targetToolLabel: string;
  coachPrompt: string;
}

export const SKILL_SYNERGY_LIST: SkillSynergyItem[] = [
  {
    id: 'piano-chords',
    primarySkill: '鋼琴常用和弦切換 (C、G、Am、F)',
    category: 'piano',
    categoryLabel: '流行鋼琴',
    icon: '🎹',
    tagline: '手指不再像機器人般卡頓，實現無縫換和弦流動感',
    bestPairing: {
      skillName: '爵士鼓 8 拍大鼓後拍定錨 + 節拍器 60 BPM',
      whyPair: '和弦卡頓 80% 不是手指按不準，而是「體內沒有固定時鐘」。讓節拍器在第 4 拍發出預備訊號，大腦提前 0.5 拍移位！',
      synergyScore: 98,
      category: '節奏穩定度'
    },
    hiddenWeakness: {
      symptom: '換和弦時前一拍最後半拍突然停頓，或者右手低頭找鍵盤導致左手斷音。',
      rootCause: '死記「柱狀形狀」而沒有找出「共同音 (Common Tone)」，每次換和弦手掌都完全懸空重擺。',
      dangerLevel: '關鍵'
    },
    remedyRoutine: {
      step1: '【共同音固定法】：從 C (C-E-G) 換到 Am (A-C-E)，C 與 E 手指完全不離鍵，只動無名指/小指換 A！',
      step2: '【左手先發】：左右手分開時，強迫左手在第 1 拍正拍落下，右手哪怕慢半拍也不許拖住左手。',
      step3: '【極限 60 秒計數】：開節拍器 60 BPM，只在 C 和 Am 之間反覆切換，目標連續 20 次無雜音。',
      dailyMinutes: 12
    },
    targetToolTab: 'toolbox',
    targetToolLabel: '打開線上和弦庫查看共同音',
    coachPrompt: '老師好，我在練習鋼琴 C-G-Am-F 和弦轉換時，換和弦前總是會停頓半拍，該如何用共同音與肌肉記憶克服？'
  },
  {
    id: 'guitar-f-chord',
    primarySkill: '吉他 F 封閉和弦克服 (Barre Chord)',
    category: 'guitar',
    categoryLabel: '民謠吉他',
    icon: '🎸',
    tagline: '告別虎口抽筋，用身體槓桿重量壓出 6 條清脆琴音',
    bestPairing: {
      skillName: '烏克麗麗四線手感 + 左手食指外側 15 度轉角',
      whyPair: '先在琴弦張力較小、弦數較少的烏克麗麗上建立封閉手指側骨受力記憶，再轉移到 6 弦民謠吉他，成功率提高 3 倍！',
      synergyScore: 95,
      category: '人體工學'
    },
    hiddenWeakness: {
      symptom: '大拇指死命捏住琴頸後方，練習 2 分鐘虎口劇痛抽筋，第 2 弦和第 1 弦依然發出「噗噗」悶音。',
      rootCause: '誤用「手掌捏力」而非「整條手臂向後沉的重量」，且食指用柔軟指腹平貼而非堅硬的側骨接觸琴弦。',
      dangerLevel: '關鍵'
    },
    remedyRoutine: {
      step1: '【食指外轉 15 度】：食指略微向琴頭方向傾斜，用靠近大拇指那一側的堅硬骨頭貼緊琴弦。',
      step2: '【手肘放鬆下沉】：大拇指甚至可以暫時不碰琴頸，僅靠右手小臂壓住吉他琴身、左手臂像衣架般自然後拉下沉發力。',
      step3: '【由簡入繁】：先從第 5 品格的 A 和弦開始練封閉（品位越寬張力越低），熟練後再逐步往前移到第 1 品的 F 和弦。',
      dailyMinutes: 15
    },
    targetToolTab: 'toolbox',
    targetToolLabel: '前往吉他/烏克麗麗和弦庫檢驗指位',
    coachPrompt: '老師好，我的吉他 F 封閉和弦第 2 弦總是悶音，大拇指也很容易酸痛，請教我如何用手臂下沉槓桿力學克服？'
  },
  {
    id: 'piano-hands-together',
    primarySkill: '鋼琴雙手獨立合奏 (Hands Coordination)',
    category: 'piano',
    categoryLabel: '流行鋼琴',
    icon: '🎹',
    tagline: '突破左右手互卡大魔王，打造左右大腦雙核心多工模式',
    bestPairing: {
      skillName: '爵士鼓四肢脫鉤節奏訓練 (Polyrhythm)',
      whyPair: '雙手合奏打架本質上是「節奏神經互牽連」。透過鼓手的左右手交替節奏與幽靈音訓練，雙手獨立性將飛躍提升！',
      synergyScore: 99,
      category: '神經多工'
    },
    hiddenWeakness: {
      symptom: '右手旋律單獨彈極其流暢，左手和弦也能單獨彈好，但雙手一碰在一起，右手就跟著左手節奏走樣。',
      rootCause: '沒有把其中一隻手（通常是伴奏左手）訓練至「無需視覺思考的純肌肉記憶自動化」。',
      dangerLevel: '高'
    },
    remedyRoutine: {
      step1: '【閉眼左手盲彈】：左手彈奏 1-5-8 低音分解，強迫自己閉上雙眼或看天花板，直到完全不出錯。',
      step2: '【一動一靜對位法】：左手維持穩定的四分音符一拍一下，右手只在第 1 拍落音，隨後逐小節增加音符。',
      step3: '【極慢速 50% 拼裝】：將原曲速度降到 50 BPM，像慢動作電影一樣，觀察雙手音符在時間軸上的垂直對齊點。',
      dailyMinutes: 15
    },
    targetToolTab: 'metronome',
    targetToolLabel: '開啟節拍器 50 BPM 慢速拼裝',
    coachPrompt: '老師好，我的鋼琴左右手分開彈都沒問題，但一合奏右手節奏就會被左手拉跑，有什麼具體的三步脫鉤練習？'
  },
  {
    id: 'dtm-songwriting',
    primarySkill: '流行旋律創作與寫歌 (Songwriting & Hook)',
    category: 'dtm',
    categoryLabel: '數位音樂',
    icon: '🎛️',
    tagline: '不寫口水歌！寫出讓人一聽就記住的洗腦副歌與金句',
    bestPairing: {
      skillName: '4536251 王道和弦色彩 + 聽力音感大七度跳進',
      whyPair: '旋律是飄在空中的風箏，和弦是拉著風箏的線。熟練王道進行的「張力與解決」，旋律就能自然搭乘和聲浪潮直衝情緒頂點！',
      synergyScore: 97,
      category: '情感共鳴'
    },
    hiddenWeakness: {
      symptom: '寫出來的副歌平淡如流水，主歌和副歌音高區間重疊，聽眾完全聽不出情緒爆發點。',
      rootCause: '缺乏「動機 (Motif) 重複」與「音域音高對比（主歌中音、副歌高音）」的架構思維。',
      dangerLevel: '關鍵'
    },
    remedyRoutine: {
      step1: '【副歌第一音跳進】：副歌第一句的第一顆音，直接比主歌結尾高出四度或五度（如主歌停在 G4，副歌直衝 C5）！',
      step2: '【長短呼吸對照】：主歌字數密集如說話，副歌第一句立刻拉長 2~3 拍長音，製造宣洩感。',
      step3: '【避開中文倒字】：一邊哼唱一邊念歌詞四聲，確認「你」是一聲、「愛」是四聲，不把詞義唱歪。',
      dailyMinutes: 20
    },
    targetToolTab: 'stave',
    targetToolLabel: '使用簡譜轉換器譜寫動機旋律',
    coachPrompt: '老師好，我想寫一首有夏天熱血感的流行歌，但副歌總覺得不夠抓耳，該如何運用音高跳進與王道進行設計 Hook？'
  },
  {
    id: 'drums-fillin',
    primarySkill: '爵士鼓過門 Fill-in 與段落推進',
    category: 'drums',
    categoryLabel: '爵士鼓',
    icon: '🥁',
    tagline: '過門不搶拍！在主副歌交界處精準點燃情緒核爆',
    bestPairing: {
      skillName: '智慧節拍器 16 分音符細分 + 重音位移',
      whyPair: '過門搶拍是因為手部動作變大、心理變興奮。在心中維持清晰的「1-e-and-a」次級時鐘，銅鈸才能在第 1 拍乾淨砸下！',
      synergyScore: 96,
      category: '時鐘微調'
    },
    hiddenWeakness: {
      symptom: '平時打 8-Beat 很穩，一到第 4 小節過門就越打越快，回到第 1 拍銅鈸時搶了將近半拍。',
      rootCause: '過門時鼓槌移動距離變長，手臂本能性過度發力加速。',
      dangerLevel: '高'
    },
    remedyRoutine: {
      step1: '【原地單鼓練習】：先不要在不同通鼓之間大範圍移動，只在小鼓上把過門的 16 分節奏打穩打勻。',
      step2: '【第 1 拍腳步先行】：在砸響 Crash 銅鈸前，大腳大鼓先踩穩落地，讓身體重心穩定。',
      step3: '【跟拍準心挑戰】：打開智慧節拍器，刻意在過門第 4 拍跟隨敲擊，檢視毫秒誤差是否壓在 ±20ms 內。',
      dailyMinutes: 15
    },
    targetToolTab: 'metronome',
    targetToolLabel: '前往智慧節拍器進行過門準心測驗',
    coachPrompt: '老師好，我在打爵士鼓過門時總是會越打越快，進入副歌 Crash 銅鈸時常常搶拍，該如何建立穩定的體內次級時鐘？'
  },
  {
    id: 'sight-reading',
    primarySkill: '五線譜視奏快速識譜 (Sight Reading)',
    category: 'general',
    categoryLabel: '視奏樂理',
    icon: '⚡',
    tagline: '擺脫逐音數數，像閱讀中文一樣「一眼看懂整組樂句」',
    bestPairing: {
      skillName: '線間幾何音程辨識 + 視奏快刷 60 秒挑戰',
      whyPair: '專業演奏家不認單顆音名，而是認「距離」：兩顆音都在線上或都在間上就是三度；一線一間就是二度或四度！',
      synergyScore: 99,
      category: '空間認知'
    },
    hiddenWeakness: {
      symptom: '看到一個高音音符，必須從中央 C 下加一線開始往上數「線、間、線、間」，彈一首曲子停頓數十次。',
      rootCause: '把五線譜當成文字密碼逐字解碼，而不是當成連續的空間高度地圖。',
      dangerLevel: '關鍵'
    },
    remedyRoutine: {
      step1: '【記住三大地標音】：只記住三個錨點：中央 C4 (下加一線)、高音 G4 (第二線/高音譜號中心)、高音 C5 (第三間)。',
      step2: '【音程相對跳躍】：看到音符在上一個音的隔壁線，直接知道「手指跨過一個鍵」彈三度，不需心算音名！',
      step3: '【每日 3 分鐘快刷】：在視奏練習挑戰中，強迫眼睛看著下一顆音，不低頭看手。',
      dailyMinutes: 10
    },
    targetToolTab: 'quiz',
    targetToolLabel: '開啟 60 秒視奏快刷挑戰',
    coachPrompt: '老師好，我五線譜看得很慢，每次都要從中央 C 往上數，該如何建立音程幾何地圖來達到一眼視奏？'
  }
];
