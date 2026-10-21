import { SkillNode } from '../types/music';

export const SKILL_TREE_DATA: Record<string, SkillNode[]> = {
  piano: [
    {
      id: 'piano-1',
      category: 'piano',
      stage: 1,
      stageTitle: '階段一 · 讀譜基礎',
      title: '零基礎五線譜與簡譜速通',
      subtitle: '一次搞定高低音譜號、中央 C 與簡譜數字對照',
      level: '入門',
      description: '不再死背死記！透過五線譜的「線」與「間」空間口訣（高音譜間音 F-A-C-E、下加一線中央 C），對照簡譜 1 2 3 4 5 6 7，建立直覺的琴鍵空間對應感。',
      milestones: [
        '找到鋼琴中央 C (C4) 與兩個黑鍵左邊的白鍵規律',
        '高音譜號（右手旋律）：學會「線」音 E-G-B-D-F 與「間」音 F-A-C-E',
        '低音譜號（左手低音）：認識中央 C 往下的大譜表連續性',
        '簡譜數字記號（高音點、低音點、減時線與延音線）'
      ],
      keyConcept: '五線譜是空間高度的精確幾何圖形；簡譜則是調性內音級的數字符號。',
      tips: [
        '先以雙黑鍵為基準：只要看到「兩顆黑鍵」，左邊那顆白鍵永遠是 Do (C)。',
        '視奏時眼睛往前看一個小節，手指放鬆自然成握球狀拱起。'
      ],
      audioDemoNotes: [
        { note: 'C4', freq: 261.63, duration: 0.5 },
        { note: 'D4', freq: 293.66, duration: 0.5 },
        { note: 'E4', freq: 329.63, duration: 0.5 },
        { note: 'F4', freq: 349.23, duration: 0.5 },
        { note: 'G4', freq: 392.00, duration: 0.5 },
        { note: 'A4', freq: 440.00, duration: 0.5 },
        { note: 'B4', freq: 493.88, duration: 0.5 },
        { note: 'C5', freq: 523.25, duration: 0.8 },
      ]
    },
    {
      id: 'piano-2',
      category: 'piano',
      stage: 2,
      stageTitle: '階段二 · 萬用和弦',
      title: '基礎三和弦與流行進行式（C、G、Am、F）',
      subtitle: '掌握 4 個和弦彈出 80% 流行歌的秘密',
      level: '進階',
      description: '認識大三和弦（開心明亮）與小三和弦（憂鬱沉穩）的結構差別。透過流行音樂黃金 1-5-6-4 與 4-5-3-6 進行，訓練左手根音與右手柱狀和弦快速轉換。',
      milestones: [
        '大三度（4個半音）+ 小三度（3個半音）的組成公式',
        '熟練 C 大調四大和弦：C (I)、G (V)、Am (vi)、F (IV)',
        '和弦轉位（Inversion）：讓手指在最少移動下無縫銜接',
        '和弦進行實戰：彈出 Ed Sheeran、周杰倫等經典主歌'
      ],
      keyConcept: '大和弦 = 根音 + 大三度 + 小三度；小和弦 = 根音 + 小三度 + 大三度。',
      chordProgressionExample: ['C', 'G', 'Am', 'F'],
      tips: [
        '換和弦時找「共同音」，例如 C (C-E-G) 換到 Am (A-C-E)，C 和 E 是共通的，只需動一個手指！',
        '左手先彈單音根音，右手彈和弦三音，節奏先以四分音符一拍一下練習。'
      ],
      audioDemoNotes: [
        { note: 'C4', freq: 261.63, duration: 0.6 },
        { note: 'E4', freq: 329.63, duration: 0.6 },
        { note: 'G4', freq: 392.00, duration: 0.8 },
      ]
    },
    {
      id: 'piano-3',
      category: 'piano',
      stage: 3,
      stageTitle: '階段三 · 歌曲彈唱',
      title: '流行歌曲彈唱伴奏型態',
      subtitle: '分解和弦、八度低音跳躍與流行抒情伴奏（Ballad Style）',
      level: '實戰',
      description: '告別呆板的柱狀敲擊！學會讓伴奏像流水般流暢的 1-5-8 抒情分解型、切分節奏推動感，以及邊彈邊唱時的呼吸與節奏穩定度。',
      milestones: [
        '左手 1-5-8 (Root-Fifth-Octave) 經典抒情低音分解法',
        '右手阿爾貝蒂低音（Alberti bass）與流動八分音符琶音',
        '副歌推力：切分推動音與前八後十六節奏',
        '彈唱平衡：右手適度留白，為人聲保留呼吸與頻率空間'
      ],
      keyConcept: '伴奏不是旋律的複製品，而是提供「和聲空間」與「節奏推力」的畫布。',
      tips: [
        '試試看在第 4 拍後半拍做一個和弦提前進入（切分音），流行感立刻倍增！',
        '歌唱時將注意力放在節拍器的重拍，左右手自動化肌肉記憶。'
      ]
    },
    {
      id: 'piano-4',
      category: 'piano',
      stage: 4,
      stageTitle: '階段四 · 雙手合奏',
      title: '雙手合奏獨立性與動態觸鍵技巧',
      subtitle: '突破左手右腦「互卡」瓶頸，掌握音量動態層次',
      level: '大師',
      description: '解決初學者最常遇到的「左手一動右手就亂掉」。透過複節奏（Polyrhythm 2對3、3對4）、音量對比（左弱右強）與延音踏板的半踩技巧，達到專業演奏家的表現力。',
      milestones: [
        '節奏分離練習：左手穩定四分音符，右手自由切換八分與三連音',
        '音量層次配比：右手主旋律突出 70%，左手和聲襯底 30%',
        '延音踏板（Sustain Pedal）的換踏時機：換和弦抬起、落鍵後踩下',
        '雙手反向進行與即興加花技巧（Fill-in）'
      ],
      keyConcept: '踏板是給聲音呼吸的，而不是用來遮掩不乾淨的手指轉換。',
      tips: [
        '先以極慢速度練習（原速 50%），確保雙手的拍點彼此咬合精準。',
        '練習時在心中默唱右手旋律，把注意力輕輕放在旋律頂端音。'
      ]
    }
  ],

  guitar: [
    {
      id: 'guitar-1',
      category: 'guitar',
      stage: 1,
      stageTitle: '階段一 · 看懂 TAB 譜',
      title: '吉他 / 烏克麗麗六線譜與四線譜速讀',
      subtitle: '弦位、品位、音符符號與手指定位全解析',
      level: '入門',
      description: 'TAB 譜是最直觀的指彈記譜法！六條線對應吉他的六根弦（最上面是第 1 弦高音 E，最下面是第 6 弦低音 E）。數字代表要按第幾品格，0 代表空弦音。',
      milestones: [
        '認識琴弦排列：吉他 E-A-D-G-B-e；烏克麗麗 G-C-E-A',
        '解讀 TAB 譜上的數字、X 記號（擊弦/消音）與連音線',
        '左手手指定位（1食指、2中指、3無名指、4小指）與指尖垂直按弦',
        '右手基本靠弦與不靠弦撥弦手勢（拇指負責低音弦，食中無名負責高音）'
      ],
      keyConcept: '數字寫在哪條線上，就按哪條弦的第幾品；數字重疊在垂直線上代表同時彈響。',
      tips: [
        '左手按弦時盡量靠在琴衍（品棒金屬絲）的「旁邊」，不需要死命用力就能發出乾淨聲音！',
        '手腕稍微往前推，不要掌心貼死琴頸，給指尖垂直落下的空間。'
      ]
    },
    {
      id: 'guitar-2',
      category: 'guitar',
      stage: 2,
      stageTitle: '階段二 · 常用和弦',
      title: '常用開放和弦與大魔王 F 封閉和弦克服',
      subtitle: 'C、G、D、Em、Am 與封閉和弦發力槓桿原理',
      level: '進階',
      description: '掌握吉他最動聽的開放和弦（Open Chords），並用科學的身體力學解構初學者殺手「F 和弦」——靠手臂重量而不是虎口死捏，輕鬆發出每一條清晰琴音！',
      milestones: [
        '民謠吉他 8 大開放和弦：C, G, D, Em, Am, Dm, E, A',
        '烏克麗麗神奇 4 和弦：C, G, Am, F（只需 1~2 根手指！）',
        '封閉和弦槓桿密技：食指側邊微傾斜，利用手臂後拉重量下壓',
        '和弦轉換零停頓：保留樞紐手指（Anchor Finger）技巧'
      ],
      keyConcept: '封閉和弦不用靠「捏」的力量，而是靠「整個左手臂像衣架般自然下沉」的重量壓住弦。',
      tips: [
        '食指不要用指腹正面平壓，稍微往外側轉 15 度，用骨頭較硬的側面接觸琴弦！',
        '每天練習「1分鐘極限和弦切換」，看 60 秒內能在 C 和 G 之間切換幾次。'
      ]
    },
    {
      id: 'guitar-3',
      category: 'guitar',
      stage: 3,
      stageTitle: '階段三 · 節奏型態',
      title: '刷奏律動與指彈分解型（Strumming & Picking）',
      subtitle: '民謠搖滾、16 拍靈魂樂、切音（Mute）與三連音慢搖滾',
      level: '實戰',
      description: '右手手腕是整首歌的心跳！學會上下刷奏的擺盪慣性（Down-Up Strumming），掌握拍點強弱（強-弱-次強-弱）以及右手小魚際的悶音技巧（Palm Mute）。',
      milestones: [
        '4/4 拍經典民謠刷法：下 - 下上 - 空上下上',
        '右手手腕放鬆如甩水珠，以手肘為軸心的自然慣性',
        '打板（Slap）與右手側切音，營造木吉他打擊樂的俏皮律動',
        '指彈 T1213121 分解和弦模組'
      ],
      keyConcept: '刷奏時右手的擺動永遠不要停下來，沒彈到的拍子只是「在空中虛刷」，保持內部時鐘穩定。',
      tips: [
        '拿 Pick 時不要抓得太僵硬，大約預留 2~3mm 尖端，讓 Pick 遇到琴弦時有柔順反彈。'
      ]
    },
    {
      id: 'guitar-4',
      category: 'guitar',
      stage: 4,
      stageTitle: '階段四 · 指彈進階',
      title: '指彈吉他獨奏（Fingerstyle Solo）與拍弦技巧',
      subtitle: '一人就是一個樂團！旋律、低音 Bassline 與打擊樂節奏合一',
      level: '大師',
      description: '探索押尾光太郎與 Tommy Emmanuel 風格！學會拇指拍弦（Thumb Slap）、泛音（Harmonics）、以及旋律與低音線的獨立分離，一把吉他展現交響層次。',
      milestones: [
        '拇指獨立演奏行走低音（Walking Bassline）',
        '自然泛音（Natural Harmonics）與人工泛音彈奏法',
        'Attack Mute 打弦技巧與吉他琴體敲擊音效',
        '改編流行歌曲為單人指彈獨奏曲'
      ],
      keyConcept: '指彈獨奏的本質是多聲部：低音聲部代表大鼓與貝斯，高音聲部是主唱，中間是節奏吉他。',
      tips: [
        '剛開始分部練習：先單獨練好低音線，接著單獨練好旋律，最後像疊積木一樣拼裝起來。'
      ]
    }
  ],

  drums: [
    {
      id: 'drums-1',
      category: 'drums',
      stage: 1,
      stageTitle: '階段一 · 認識鼓組',
      title: '認識現代爵士鼓組與鼓譜記法',
      subtitle: '大鼓 Kick、小鼓 Snare、雙片鈸 Hi-Hat 與四肢獨立起點',
      level: '入門',
      description: '鼓手是樂團的靈魂地基！認識鼓組的每一樣配件：踩在右腳的大鼓提供重低音動脈、左手敲擊的小鼓提供清脆的後拍定錨、Hi-Hat 鈸片負責細膩的時值細分。',
      milestones: [
        '鼓組配置解密：大鼓、小鼓、通通鼓 (Rack/Floor Tom)、Hi-Hat、Crash 銅鈸、Ride 節奏鈸',
        '鼓譜符號：圓形音符代表鼓面，X 型音符代表金屬銅鈸',
        '握槌手勢（Match Grip 對稱握法）與回彈（Rebound）原理',
        '右腳踩大鼓踏板的腳跟著地（Heel-Down）與腳跟抬起（Heel-Up）技巧'
      ],
      keyConcept: '擊鼓不是用力砸，而是像拍籃球一樣，順著鼓皮與鼓槌的反彈力省力運動。',
      tips: [
        '找尋鼓槌的平衡支點（Fulcrum），大約在鼓槌底部往上三分之一處。',
        '練習時身體坐正，大腿與小腿保持稍大於 90 度的放鬆角度。'
      ]
    },
    {
      id: 'drums-2',
      category: 'drums',
      stage: 2,
      stageTitle: '階段二 · 8 拍節奏',
      title: '基礎 8 拍搖滾與流行節奏型態 (Basic 8-Beat)',
      subtitle: '大鼓 1、3 拍，小鼓 2、4 拍，右手踩出平穩 8 分音符',
      level: '進階',
      description: '全世界數萬首熱門歌曲的通用律動！右手 Hi-Hat 均勻數「1 and 2 and 3 and 4 and」，在第 1、3 拍加入右腳大鼓，在第 2、4 拍加入左手小鼓。',
      milestones: [
        '右手 8 拍固定持續音（Ostinato）',
        '第 1 拍大鼓 + 第 2 拍小鼓 + 第 3 拍大鼓 + 第 4 拍小鼓的精確咬合',
        '大鼓變形型態：在 3 拍後半（3 and）加入跳躍大鼓',
        '四肢脫鉤：讓右手 Hi-Hat 維持勻速，不受大腳加踩影響'
      ],
      keyConcept: '小鼓在第 2 拍與第 4 拍的重擊（Backbeat）是流行音樂讓人想點頭跟著跳舞的錨點。',
      tips: [
        '如果四肢容易互卡，先把右手抽掉，只用右腳大鼓和左手小鼓互踩互敲，穩定後再加鈸。'
      ]
    },
    {
      id: 'drums-3',
      category: 'drums',
      stage: 3,
      stageTitle: '階段三 · 切分音律動',
      title: '切分音（Syncopation）與 16 拍放克律動 (Funk Groove)',
      subtitle: '打破規律重音！反拍大鼓、開合鈸（Hi-Hat Splash）與重音位移',
      level: '實戰',
      description: '從平鋪直敘躍升為充滿律動的 Groove！學習切分音將重拍往前或往後移半拍，搭配 Hi-Hat 在反拍打開（Open Hi-Hat）營造氣體釋放的刺激聽感。',
      milestones: [
        '認識 16 分音符細分口訣：「1-e-and-a, 2-e-and-a」',
        '反拍大鼓踩踏（在 1e 或 2a 拍），創造搖擺動態',
        '開合鈸開關控制：腳尖踩下與鬆開的精準時間差',
        '幽靈音（Ghost Note）：小鼓極輕音與重擊形成的層次律動'
      ],
      keyConcept: '切分音的魅力來自於「打破聽眾的期待」——在最想不到的地方落下重拍，產生驚喜的律動拉扯。',
      tips: [
        '練習幽靈音時，左手高度不要超過鼓圈 3 公分，輕輕觸碰鼓皮；重音時則舉高自然揮下。'
      ]
    },
    {
      id: 'drums-4',
      category: 'drums',
      stage: 4,
      stageTitle: '階段四 · 過門過渡',
      title: 'Fill-in（過門）組合與即興段落轉換',
      subtitle: '單跳、雙跳滾奏（Roll）、通通鼓巡遊與回歸第 1 拍銅鈸 Crash',
      level: '大師',
      description: '歌曲從主歌進入副歌時，鼓手的過門就是點燃全場高潮的導火線！掌握單雙跳手法（RLRL / RRLL），流暢穿梭於高音通鼓、低音通鼓，並在第 1 拍精準砸響 Crash 銅鈸回到常規節奏。',
      milestones: [
        '單跳（Single Stroke）與雙跳（Double Stroke）基礎打擊功法（Rudiments）',
        '一小節經典過門：第 4 拍小鼓四連音 ➔ 高音通鼓 ➔ 落地低音通鼓',
        '重音重置：Crash 銅鈸必須與大鼓同時落下，維持低頻飽滿度',
        '過門不搶拍也不拖拍：保持心中隱形節拍器匀速運轉'
      ],
      keyConcept: '最棒的過門不是音符塞得最滿的，而是最能把聽眾情緒順暢送進下一個音樂高潮的。',
      tips: [
        '過門時往往容易越打越快，練習時在第 1 拍銅鈸落地前刻意感受腳步沉穩。'
      ]
    }
  ],

  dtm: [
    {
      id: 'dtm-1',
      category: 'dtm',
      stage: 1,
      stageTitle: '階段一 · 作曲入門',
      title: '寫歌作曲入門與流行歌曲架構',
      subtitle: '動態動機 (Motif)、主歌 (Verse)、副歌 (Chorus) 與聽覺記憶點 (Hook)',
      level: '入門',
      description: '從隨口哼唱到一首完整作品！拆解當代流行金曲的黃金結構：Intro（前奏）➔ Verse（說故事的主歌）➔ Pre-Chorus（情緒加溫導歌）➔ Chorus（洗腦爆發副歌）➔ Bridge（轉折橋段）➔ Outro（尾奏）。',
      milestones: [
        '什麼是動機 (Motif)：3~5 個音符構成的記憶核心（如貝多芬命運交響曲、流行歌 Hook）',
        '主歌與副歌音高區間對比：主歌中低音敘事、副歌高音爆發情緒',
        '節奏節奏感與旋律節奏對位（長短音呼吸感）',
        '手機錄音備忘錄捕捉即興靈感'
      ],
      keyConcept: '好的旋律是在「重複（帶來熟悉安全感）」與「變化（帶來驚喜新鮮感）」之間取得完美平衡。',
      tips: [
        '旋律卡住時，試著把副歌的第一個音往上拉高一個四度或五度，立刻就有心碎或熱血的張力！'
      ]
    },
    {
      id: 'dtm-2',
      category: 'dtm',
      stage: 2,
      stageTitle: '階段二 · 和弦進行',
      title: '和弦進行 (Chord Progression) 與調性情感色彩',
      subtitle: '4536251 流行進行、卡農進行、暗黑低音進行與轉調技巧',
      level: '進階',
      description: '和弦是旋律的衣服！同樣一段旋律配上大調和弦就是陽光燦爛，配上小調就是深沉孤獨。深入探討華語流行霸主「4-5-3-6-2-5-1」王道進行與日系 City Pop 的大七和弦。',
      milestones: [
        '王道進行：IVmaj7 - V7 - iiim7 - vim7 - iim7 - V7 - I',
        '卡農進行：I - V - vi - iii - IV - I - IV - V（無數婚禮與校園金曲骨架）',
        '副屬和弦（Secondary Dominants）：加入臨時升降音製造期待感',
        '情緒色彩選擇：Major 7th（浪漫微醺）、Minor 9th（都會孤寂）、sus4（懸疑未解）'
      ],
      keyConcept: '和弦不是隨機堆疊的，它們之間具有「張力（Tension）」與「解決（Resolution）」的強烈引力關係。',
      chordProgressionExample: ['Fmaj7', 'G7', 'Em7', 'Am7'],
      tips: [
        '副歌前的高潮點（Pre-Chorus 結尾），試著把最後一個和弦停在屬和弦（V 級如 G7），聽眾的心會自然懸在空中渴望副歌第一顆音！'
      ]
    },
    {
      id: 'dtm-3',
      category: 'dtm',
      stage: 3,
      stageTitle: '階段三 · MIDI 編曲',
      title: 'DAW 數位編曲與樂器音色分軌層疊',
      subtitle: 'Bassline 與鼓點咬合、Pad 氛圍鋪陳、Lead 旋律與聲相空間 (Stereo Pan)',
      level: '實戰',
      description: '打開 Ableton Live、Logic Pro 或 FL Studio，把頭腦裡的聲音立體化！學習如何分配頻率頻譜（EQ 分工），避免 Bass 和大鼓在低頻打架，透過立體聲聲相（Pan）讓音樂寬廣開闊。',
      milestones: [
        '低頻地基配置：Kick 大鼓與 Sub Bass 根音節奏互鎖（Sidechain 側鏈壓縮技巧）',
        '中頻和聲填充：鋼琴、電吉他與合成器 Pad 鋪底',
        '高頻空氣感：Hi-Hat、搖鈴 Shaker、合成器琶音（Arpeggiator）',
        '空間混響（Reverb）與延遲（Delay）製造深邃立體感'
      ],
      keyConcept: '編曲就像在同一個房間裡擺放家具——不能把所有大沙發都塞在左下角，每件樂器都該有自己的頻率抽屜。',
      tips: [
        '大鼓（Kick）與貝斯（Bass）只保留一個在最底層（40~60Hz），另一個讓出頻段，聲音立刻乾淨 10 倍！'
      ]
    },
    {
      id: 'dtm-4',
      category: 'dtm',
      stage: 4,
      stageTitle: '階段四 · 詞曲整合',
      title: '旋律與歌詞寫作搭接與音樂情感包裝',
      subtitle: '倒字問題、韻腳設計、抑揚頓挫與發音爆發力',
      level: '大師',
      description: '為什麼有些歌唱起來特別自然？因為音符音高完美契合了語言本身的四聲音調（避免把「水餃」唱成「睡覺」的倒字）。學習韻腳密碼（押韻、跳韻、十三轍）與讓聽眾起雞皮疙瘩的情感高潮設計。',
      milestones: [
        '中文音調與旋律線條走向契合（一聲平、二聲揚、三聲拐彎、四聲降）',
        '韻腳選擇與情緒：閉口韻（en, in, u）適合內斂悲傷；開口韻（a, ang, ao）適合宣洩吶喊',
        '字數節奏密度對比：主歌如說話般密集中速，副歌拉長音抒發情意',
        'Demo 錄製、人聲調音修音（Pitch Correction）與發行準備'
      ],
      keyConcept: '好的歌詞不是華麗詞藻的堆砌，而是用最精確的幾句話，刺中聽者內心藏得最深的那件事。',
      tips: [
        '填詞時一邊唱一邊錄下來，如果唱到某個字舌頭打結或聽起來很彆扭，不要猶豫，立刻換掉那個字！'
      ]
    }
  ]
};
