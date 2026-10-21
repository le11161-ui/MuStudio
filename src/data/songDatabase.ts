export interface SongPracticeGuide {
  id: string;
  songName: string;
  artist: string;
  instrument: string;
  key: string;
  bpm: number;
  timeSignature: string;
  chords: string[];
  overview: string;
  previewMelody?: { note: string; duration: number }[];
  stages: {
    phase: string;
    phaseTitle: string;
    timeAllocation: string;
    focus: string;
    steps: string[];
    suggestedSpeed: string;
  }[];
  bottlenecks: {
    spot: string;
    issue: string;
    solution: string;
  }[];
  coachSecretTip: string;
}

export const PRESET_SONG_GUIDES: Record<string, SongPracticeGuide> = {
  '晴天': {
    id: 'qingtian',
    songName: '晴天 (Sunny Day)',
    artist: '周杰倫',
    instrument: '流行鋼琴 / 民謠吉他',
    key: 'G 大調 (轉 Em 小調)',
    bpm: 76,
    timeSignature: '4/4',
    chords: ['Em', 'C', 'G', 'D', 'Am', 'Bm'],
    overview: '華語流行青春神曲！前奏經典的木吉他/鋼琴分解和弦，搭配副歌「颳風這天我試過握著你手」的抒情爆發，是練習和弦轉換與彈唱咬合的教科書曲目。',
    previewMelody: [
      { note: 'B4', duration: 0.4 },
      { note: 'E5', duration: 0.4 },
      { note: 'D5', duration: 0.4 },
      { note: 'B4', duration: 0.4 },
      { note: 'A4', duration: 0.35 },
      { note: 'G4', duration: 0.35 },
      { note: 'A4', duration: 0.35 },
      { note: 'B4', duration: 0.7 },
      { note: 'G4', duration: 0.35 },
      { note: 'E4', duration: 0.35 },
      { note: 'G4', duration: 0.35 },
      { note: 'D4', duration: 0.7 },
      { note: 'E4', duration: 0.4 },
      { note: 'G4', duration: 0.4 },
      { note: 'A4', duration: 0.4 },
      { note: 'B4', duration: 0.8 },
    ],
    stages: [
      {
        phase: '第 1 階段',
        phaseTitle: '骨架定錨：右手單旋律與左手低音分拆',
        timeAllocation: '前 20% 練習時間',
        focus: '先建立乾淨的音符時值與指法記憶，切忌一開始就雙手合奏。',
        steps: [
          '開節拍器 55 BPM（降速 70%），單獨練熟右手主歌旋律，注意前八後十六分音符節奏。',
          '左手只彈單音根音 (Em 彈 E、C 彈 C、G 彈 G、D 彈 D)，在第 1 拍正拍垂直落下。',
          '在譜上標註「共同音」，例如 C 和弦與 Em 和弦都有 E 音，手掌不要大幅度跳離琴鍵。'
        ],
        suggestedSpeed: '55 BPM (慢速打底)'
      },
      {
        phase: '第 2 階段',
        phaseTitle: '瓶頸突破：副歌「颳風這天」換和弦大魔王專攻',
        timeAllocation: '中 40% 練習時間',
        focus: '針對全曲換和弦最容易卡頓的 4 個小節進行局部「高頻無間隙循環」。',
        steps: [
          '抽取第 13~16 小節（Em - C - G - D），只在這 4 個和弦之間反覆切換。',
          '左手切換原則：第 4 拍後半拍眼睛就要提前看向下一個和弦的鍵位，手指提前放鬆移位。',
          '吉他玩家重點：C 和弦換 D 和弦時，無名指先固定在第 2 弦第 3 品作為樞紐指 (Anchor Finger)！'
        ],
        suggestedSpeed: '65 BPM'
      },
      {
        phase: '第 3 階段',
        phaseTitle: '聲部合體：左手 1-5-8 抒情分解與音量平衡',
        timeAllocation: '後 25% 練習時間',
        focus: '讓伴奏流暢如流水，主歌中低音敘事、副歌高音爆發。',
        steps: [
          '左手由柱狀和弦升級為 1-5-8 (Root-5th-8ve) 分解音型。',
          '動態對比控制：右手主旋律音量佔 70%，左手和弦伴奏退居 30%，避免左手低音轟炸。',
          '踏板換踩時機：在每個小節第 1 拍落鍵的瞬間「抬起再踩下」，消除渾濁殘音。'
        ],
        suggestedSpeed: '72 BPM'
      },
      {
        phase: '第 4 階段',
        phaseTitle: '原速演繹與彈唱呼吸',
        timeAllocation: '最後 15% 練習時間',
        focus: '原速 76 BPM 完整演奏，並加入人聲呼吸與情感留白。',
        steps: [
          '恢復原速 76 BPM，先用嘴巴哼唱旋律，手部伴奏進入自動化肌肉記憶。',
          '尾奏電吉他 Solo 段落前做一個輕微的漸慢 (Ritardando)，製造青春悵惘感。'
        ],
        suggestedSpeed: '76 BPM (原速)'
      }
    ],
    bottlenecks: [
      {
        spot: '副歌換到 D 和弦容易慢半拍',
        issue: '大腦在找 3 根手指頭的位置，導致拍點拖拍。',
        solution: '保留無名指在第 2 弦第 3 品不離弦，食指中指自然像衣夾般夾下！'
      },
      {
        spot: '左右手合奏時右手跟著左手重音走樣',
        issue: '四肢獨立性神經尚未脫鉤。',
        solution: '強迫左手閉著眼睛彈伴奏，嘴巴唱右手旋律，直到左手不需要視覺監控。'
      }
    ],
    coachSecretTip: '練《晴天》最快的捷徑是「前奏循環練 50 遍」——前奏的 Em7-Cadd9-G-D 是整首歌的靈魂模組，前奏通了，整首歌就拿下 80% 了！'
  },

  '卡農': {
    id: 'canon',
    songName: '卡農 (Canon in D)',
    artist: '約翰·帕海貝爾 (Johann Pachelbel)',
    instrument: '古典 / 流行鋼琴',
    key: 'D 大調 (常用 C 大調簡化版)',
    bpm: 72,
    timeSignature: '4/4',
    chords: ['C', 'G', 'Am', 'Em', 'F', 'C', 'F', 'G'],
    overview: '跨越三百年最永恆的低音固定型 (Ground Bass)！8 個小節的和弦循環孕育出無數次複調變奏，是練習左右手複音層次與聲部平衡的至高典範。',
    previewMelody: [
      { note: 'E5', duration: 0.5 },
      { note: 'D5', duration: 0.5 },
      { note: 'C5', duration: 0.5 },
      { note: 'B4', duration: 0.5 },
      { note: 'A4', duration: 0.5 },
      { note: 'G4', duration: 0.5 },
      { note: 'A4', duration: 0.5 },
      { note: 'B4', duration: 0.5 },
      { note: 'C5', duration: 0.5 },
      { note: 'E5', duration: 0.5 },
      { note: 'G5', duration: 0.5 },
      { note: 'F5', duration: 0.5 },
      { note: 'E5', duration: 0.5 },
      { note: 'C5', duration: 0.5 },
      { note: 'E5', duration: 0.5 },
      { note: 'D5', duration: 0.8 },
    ],
    stages: [
      {
        phase: '第 1 階段',
        phaseTitle: '骨架定錨：掌握 8 小節黃金低音進行 (Bassline)',
        timeAllocation: '前 20% 練習時間',
        focus: '熟記 1-5-6-3-4-1-4-5 經典低音骨架。',
        steps: [
          '左手單獨走低音：C ➔ G ➔ Am ➔ Em ➔ F ➔ C ➔ F ➔ G，用節拍器 60 BPM 打底。',
          '大腦默背 8 個小節的走向，做到看都不看手就能盲彈。'
        ],
        suggestedSpeed: '60 BPM'
      },
      {
        phase: '第 2 階段',
        phaseTitle: '瓶頸突破：右手十六分音符流暢琶音 (Arpeggio)',
        timeAllocation: '中 40% 練習時間',
        focus: '解決大指穿指 (Thumb-under) 時手腕僵硬顛簸的毛病。',
        steps: [
          '針對變奏三的十六分連續流動音符，先以「附點節奏練習法 (前長後短、前短後長)」各練 5 遍。',
          '大拇指穿指時手腕保持平穩水準，不可像駝峰一樣劇烈上下跳動。'
        ],
        suggestedSpeed: '65 BPM'
      },
      {
        phase: '第 3 階段',
        phaseTitle: '聲部合體：強弱立體化與複調對話',
        timeAllocation: '後 25% 練習時間',
        focus: '右手旋律如歌唱般連音 (Legato)，左手和聲如溫柔浪潮。',
        steps: [
          '左手降至 pp (極弱)，右手保持 mp (中弱) 到 mf (中強) 的流暢歌唱感。',
          '遇到連續三度跳進時，手指放鬆以指腹肉墊輕盈觸鍵。'
        ],
        suggestedSpeed: '70 BPM'
      },
      {
        phase: '第 4 階段',
        phaseTitle: '原速演繹與古典呼吸感',
        timeAllocation: '最後 15% 練習時間',
        focus: '在每個變奏小節的末尾給予極其自然的呼吸微停頓。',
        steps: [
          '恢復原速 72~76 BPM，融入延音踏板的半踩技巧。'
        ],
        suggestedSpeed: '72 BPM'
      }
    ],
    bottlenecks: [
      {
        spot: '右手連續快速琶音手指打結',
        issue: '手指指尖垂直過度用力，導致手掌內側肌群僵死。',
        solution: '採用「變節奏變速練習法」：一次快-慢-快-慢，一次慢-快-慢-快，打散神經慣性！'
      }
    ],
    coachSecretTip: '卡農的靈魂在於「層層堆疊」——第一遍變奏要克制冷靜，第二遍加入八分音符，第三遍十六分音符情緒全面展開！'
  },

  'River Flows in You': {
    id: 'river-flows',
    songName: 'River Flows in You',
    artist: 'Yiruma (李閏珉)',
    instrument: '現代抒情鋼琴',
    key: 'A 大調 (F#m 小調)',
    bpm: 68,
    timeSignature: '4/4',
    chords: ['F#m', 'D', 'A', 'E'],
    overview: '現代新世紀鋼琴代表作！標誌性的右手倚音 (Grace Note) 與左手跨八度的大琶音，營造出流水般清澈空靈的情感氛圍。',
    previewMelody: [
      { note: 'A4', duration: 0.25 },
      { note: 'G#4', duration: 0.25 },
      { note: 'A4', duration: 0.6 },
      { note: 'E5', duration: 0.6 },
      { note: 'D5', duration: 0.4 },
      { note: 'C#5', duration: 0.4 },
      { note: 'B4', duration: 0.4 },
      { note: 'A4', duration: 0.7 },
      { note: 'A4', duration: 0.25 },
      { note: 'G#4', duration: 0.25 },
      { note: 'A4', duration: 0.6 },
      { note: 'E5', duration: 0.6 },
      { note: 'D5', duration: 0.4 },
      { note: 'C#5', duration: 0.4 },
      { note: 'B4', duration: 0.8 },
    ],
    stages: [
      {
        phase: '第 1 階段',
        phaseTitle: '骨架定錨：右手雙倚音 (Grace Note) 輕巧度拆解',
        timeAllocation: '前 25% 練習時間',
        focus: '倚音不可佔用正拍時值，手腕要像天鵝羽毛般輕盈彈起。',
        steps: [
          '先不彈小裝飾音，只彈主旋律長音，把核心拍點定在節拍器上。',
          '加入倚音時，手指輕輕拂過，力量只放在後面的主音上。'
        ],
        suggestedSpeed: '55 BPM'
      },
      {
        phase: '第 2 階段',
        phaseTitle: '瓶頸突破：左手跨八度流暢大跳 (Wide Arpeggios)',
        timeAllocation: '中 35% 練習時間',
        focus: '克服左手從低音 1 級跨越五度、八度甚至十度的摸鍵遲疑。',
        steps: [
          '練習「盲跳」：眼睛看著琴鍵中央，左手靠手臂側向位移擺盪，建立肌肉距離感。',
          '手臂像鐘擺一樣平移，不要把手指死命撐開跨大跳。'
        ],
        suggestedSpeed: '60 BPM'
      },
      {
        phase: '第 3 階段',
        phaseTitle: '聲部合體：弱音層次與延音踏板無縫銜接',
        timeAllocation: '後 25% 練習時間',
        focus: '避免踏板踩死導致低音與裝飾音融成一片泥濘。',
        steps: [
          '換和弦落鍵的瞬間抬起踏板，在手指按穩後立即踩下 1/2 踏板深度。'
        ],
        suggestedSpeed: '65 BPM'
      },
      {
        phase: '第 4 階段',
        phaseTitle: '原速與 Rubato 自由速度表現',
        timeAllocation: '最後 15% 練習時間',
        focus: '適度加入彈性速度 (Rubato)，在情緒高潮處微微延展。',
        steps: [
          '原速 68 BPM 演奏，音色要像清晨水滴落在荷葉上般晶瑩剔透。'
        ],
        suggestedSpeed: '68 BPM'
      }
    ],
    bottlenecks: [
      {
        spot: '左手大琶音聲音太重太吵',
        issue: '大拇指落鍵時沒有收住力量，把伴奏彈成了重擊。',
        solution: '大拇指改用側邊指腹滑過，想像撫摸絲綢般的力量觸鍵。'
      }
    ],
    coachSecretTip: '這首曲子的「高級感」全在倚音的微小延遲感——不要像打字機一樣搶著把它彈完，稍微帶著一絲嘆息的呼吸感！'
  },

  '天空之城': {
    id: 'laputa',
    songName: '天空之城 (Carrying You)',
    artist: '久石讓 (Joe Hisaishi)',
    instrument: '流行鋼琴 / 吉他指彈',
    key: 'Am 小調',
    bpm: 80,
    timeSignature: '4/4',
    chords: ['Am', 'F', 'G', 'C', 'Dm', 'E7'],
    overview: '吉卜力宮崎駿動畫最催淚深沉的主題曲。經典的 Am-F-G-C 進行，旋律如孤獨空靈的飛鳥，是練習小調哀傷色彩與和弦分解的絕佳曲目。',
    previewMelody: [
      { note: 'A4', duration: 0.35 },
      { note: 'B4', duration: 0.35 },
      { note: 'C5', duration: 0.6 },
      { note: 'B4', duration: 0.35 },
      { note: 'C5', duration: 0.6 },
      { note: 'E5', duration: 0.8 },
      { note: 'B4', duration: 0.8 },
      { note: 'E4', duration: 0.35 },
      { note: 'E4', duration: 0.35 },
      { note: 'A4', duration: 0.6 },
      { note: 'G4', duration: 0.35 },
      { note: 'A4', duration: 0.6 },
      { note: 'C5', duration: 0.8 },
      { note: 'G4', duration: 0.8 },
    ],
    stages: [
      {
        phase: '第 1 階段',
        phaseTitle: '骨架定錨：前奏弱起拍 (Pickup Measure) 呼吸感',
        timeAllocation: '前 20% 練習時間',
        focus: '第 4 拍後半拍進入的弱起旋律，切勿把第一音彈成重音。',
        steps: [
          '在節拍器數「1, 2, 3, (吸氣)」在 4 拍後半輕柔落指。',
          '左手 Am-F-G-C-Dm-Am-E7 和弦進行單獨彈順。'
        ],
        suggestedSpeed: '65 BPM'
      },
      {
        phase: '第 2 階段',
        phaseTitle: '瓶頸突破：副歌高潮旋律與左手八度低音',
        timeAllocation: '中 40% 練習時間',
        focus: '副歌拉高八度時，左手低音要有支撐力，右手旋律線條要連貫。',
        steps: [
          '練習 E7 屬和弦解決到 Am 和弦時的導音升號 (G#) 表現力。'
        ],
        suggestedSpeed: '72 BPM'
      },
      {
        phase: '第 3 階段',
        phaseTitle: '聲部合體：琶音與踏板交織',
        timeAllocation: '後 25% 練習時間',
        focus: '把左手琶音彈成如電影配樂般的浩瀚空氣感。',
        steps: [
          '雙手對位，左手 1-5-8-10 連續琶音，右手保持旋律突出。'
        ],
        suggestedSpeed: '78 BPM'
      },
      {
        phase: '第 4 階段',
        phaseTitle: '原速完整演繹',
        timeAllocation: '最後 15% 練習時間',
        focus: '原速 80~84 BPM，結尾以漸弱 (Decrescendo) 飄散在風中。',
        steps: [
          '結尾最後一個 Am 和弦不要踩死踏板，讓琴音自然衰減。'
        ],
        suggestedSpeed: '80 BPM'
      }
    ],
    bottlenecks: [
      {
        spot: 'E7 和弦轉換時容易彈錯升 G 音',
        issue: '黑鍵 G# 容易滑落到旁邊的白鍵 G 或 A。',
        solution: '手位提前稍微往黑鍵內側推移 1 公分，指尖正對 G# 黑鍵頂端。'
      }
    ],
    coachSecretTip: '小調曲子的情感不要「用力擠出來」，而是靠「減法」——越是悲傷的句子，彈奏時越要內斂放鬆，留給聽眾想像空間。'
  }
};
