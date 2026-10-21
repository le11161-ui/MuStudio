import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Edit3,
  Compass,
  Sliders,
  Volume2,
  Clock,
  Music,
  Zap,
  Target,
  ExternalLink,
  Table,
  LayoutGrid,
  Award,
  Gift,
  X,
  Play,
  HelpCircle,
} from 'lucide-react';

export interface FeatureGuideItem {
  id: string;
  category: 'practice' | 'skills' | 'tools' | 'coach';
  categoryLabel: string;
  name: string;
  icon: string;
  badge: string;
  location: string;
  routeKey: string;
  purpose: string;
  howToSteps: string[];
  keyButtonsToClick: string[];
  proTip?: string;
}

export const ALL_FEATURES_CATALOG: FeatureGuideItem[] = [
  // ==========================================
  // 1. 個人練習與技能成長 (Growth & Practice Hub)
  // ==========================================
  {
    id: 'feat-routine-planner',
    category: 'practice',
    categoryLabel: '個人練習與技能成長',
    name: '🗓️ 今日課程修煉排程規劃 (Course Planner)',
    icon: '🗓️',
    badge: '先做什麼在做什麼 · 步驟引導',
    location: '📝 個人練習與技能成長 ➔ 🗓️ 今日課程排程規劃',
    routeKey: 'routine',
    purpose: '規劃今天第一步做什麼、第二步做什麼（如暖手5m、換和弦10m、曲目攻克15m、聽音5m、日誌打卡5m），提供 4 大經典課表套用、自訂步驟與一鍵直達對應工具！',
    howToSteps: [
      '1. 進入「個人練習與技能成長」➔ 點選「🗓️ 今日課程排程規劃」分頁。',
      '2. 可直接點擊快速套用「30m高效精修單」、「45m流行彈唱單」、「60m深度破關單」或「25m音感創作單」。',
      '3. 也可點擊「➕ 新增自訂步驟」，輸入想要練的內容、分鐘數與對應跳轉工具。',
      '4. 練琴時按照由上而下順序推進，每做完一步點擊前面的圓圈勾選完成。',
      '5. 點擊每步驟右側的「🚀 前往」即可一秒跳轉至節拍器、和弦庫或曲目攻略！',
      '6. 全部練完後，點擊下方「將今日排程成果帶入日誌」即可自動帶入分鐘數與心得打卡！',
    ],
    keyButtonsToClick: [
      '點選【30m / 45m / 60m / 25m 經典預設課表】一鍵載入',
      '點擊【Circle 勾選圈】打勾完成步驟（播放成就音效）',
      '點擊【🚀 對應工具 (如節拍器/和弦庫/曲目攻略)】一鍵直達',
      '點擊【➕ 新增自訂步驟】/ 【🔼 向上】 / 【🔽 向下】調整順序',
      '點擊【將今日排程成果帶入日誌 (+XP)】',
    ],
    proTip: '練琴最忌諱盲目漫無目的摸鍵，先規劃好「熱身 ➔ 和聲 ➔ 曲目難點 ➔ 驗收」的步驟順序，30 分鐘效果勝過盲練 2 小時！',
  },
  {
    id: 'feat-version-center',
    category: 'practice',
    categoryLabel: '系統核心與版本',
    name: '✨ 即時版本更新中心與通知按鈕 (Live Update Center)',
    icon: '🔄',
    badge: '即時版本推送 · 一鍵切換最新版',
    location: '頁面頂部導覽列 ➔ 【換成更新版本】 / 【v2.5.0 已更新】按鈕',
    routeKey: 'version',
    purpose: '每當系統有任何新功能更新發布，頂部按鈕即刻亮起橘金色提示「換成更新版本」；點擊可查閱更新亮點紀錄，並支援一鍵清除快取立即套用新版本！亦具備模擬推送測試工具。',
    howToSteps: [
      '1. 觀察頁面頂部 Zone 3 的版本按鈕：若有更新會顯示閃爍「換成更新版本」，若已是最新版顯示「v2.5.0 已更新」。',
      '2. 點擊該按鈕開啟「MuStudio 版本更新中心」視窗。',
      '3. 點選「🔄 換成更新版本 (清除快取並套用)」，系統即刻自動刷新並套用所有最新功能。',
      '4. 亦可捲動瀏覽各版本迭代亮點（如 v2.5.0、v2.4.0、v2.3.0），點擊「立即體驗」直接跳轉。',
      '5. 測試員可點擊「🧪 模擬推送新版本」，親自體驗頂部通知燈號如何即時變色！',
    ],
    keyButtonsToClick: [
      '點擊頂部【✨ 換成更新版本】或【v2.5.0 已更新】按鈕',
      '點擊【🔄 換成更新版本 (清除快取並套用)】',
      '點擊卡片上的【立即體驗】跳轉至新功能',
      '點擊【🧪 模擬推送新版本 (測試頂部即時通知)】',
      '點擊【恢復當前正常版本 (v2.5.0)】',
    ],
    proTip: '隨時保持最新版本可以享有更低延遲的 Web Audio 音色渲染與最新曲目指法庫！',
  },
  {
    id: 'feat-ambient-soundscape',
    category: 'practice',
    categoryLabel: '沉浸練琴工具',
    name: '🎧 專注氛圍背景音 (Ambient Soundscape)',
    icon: '🌧️',
    badge: '雨聲 · 黑膠 · 柴火 · 咖啡館',
    location: '頁面頂部導覽列 ➔ 點擊【🎧 氛圍音】按鈕',
    routeKey: 'ambient',
    purpose: '以純 Web Audio 演算法合成 4 款高品質環境專注氛圍音（窗外雨聲、復古黑膠唱片底噪、溫暖壁爐柴火、爵士咖啡館），可在後台持續播放，陪伴練琴不干擾。',
    howToSteps: [
      '1. 點擊頂部導覽列右側的「🎧 氛圍音」按鈕。',
      '2. 在彈出的控制器中，點選想要的氛圍（窗外雨聲 🌧️、復古黑膠 📻、溫暖壁爐 🔥、爵士咖啡館 ☕）。',
      '3. 點擊「開始播放」，系統即刻在後台流暢運作，即使切換不同樂理工具或練琴日誌也不會中斷。',
      '4. 拖曳音量滑桿調整適合自己的舒適音量大小。',
    ],
    keyButtonsToClick: [
      '點擊頂部【🎧 氛圍音】圖標按鈕',
      '點選【🌧️ 窗外雨聲】 / 【📻 復古黑膠】 / 【🔥 溫暖壁爐】 / 【☕ 爵士咖啡館】',
      '點擊【▶ 開始播放】 / 【⏹️ 停止播放】',
      '拖曳【音量滑桿 (0% ~ 100%)】',
    ],
    proTip: '推薦「復古黑膠」搭配「Lo-Fi 電鋼琴」音色，彈奏流行抒情歌特別有沉浸氛圍感！',
  },
  {
    id: 'feat-data-backup-restore',
    category: 'practice',
    categoryLabel: '個人數據安全',
    name: '💾 練琴歷程與 XP 數據備份/還原 (Backup & Restore)',
    icon: '💾',
    badge: 'JSON 離線安全備份 · 換機無損轉移',
    location: '頁面頂部導覽列 ➔ 點擊【💾 備份】圖標',
    routeKey: 'backup',
    purpose: '將辛苦累積的 XP 經驗值、個人等級、練琴打卡日誌、今日課程排程與曲目心得一鍵封裝成 JSON 檔備份到電腦/手機；隨時可以選檔還原，換瀏覽器或新裝置無縫銜接。',
    howToSteps: [
      '1. 點擊頂部導覽列的「💾 備份」圖標。',
      '2. 點擊「立即下載備份檔」，瀏覽器會自動下載名為「MuStudio_Music_Backup_日期.json」的純文本檔案。',
      '3. 若要在另一台電腦或手機還原，點擊「選取檔案還原」，選中該備份檔即可 1 秒瞬間還原！',
      '4. 亦提供「一鍵體驗滿級特權」示範鈕，可快速注入資深學員數據進行全站特權測試。',
    ],
    keyButtonsToClick: [
      '點擊頂部【💾 數據庫】圖標',
      '點擊【📥 立即下載備份檔】',
      '點擊【📤 選取檔案還原】',
      '點擊【一鍵體驗滿級特權】注入示範數據',
    ],
    proTip: '建議每隔一至兩週點一次匯出備份，離線妥善保存自己的音樂學習軌跡！',
  },
  {
    id: 'feat-practice-take-recorder',
    category: 'practice',
    categoryLabel: '實戰練琴利器',
    name: '🎙️ 實戰練琴錄音 Take & 自我回放對照 (Practice Audio Recorder)',
    icon: '🎙️',
    badge: '麥克風錄音 · 波形回放 · 自評帶入日誌',
    location: '📝 個人練習與技能成長 ➔ 曲目高效練法 ➔ 導奏琴鍵下方',
    routeKey: 'songguide',
    purpose: '練琴最關鍵的一步是「錄下自己彈的聲音並重聽」。支援一鍵開啟麥克風錄製本次練習 Take，即時回放聆聽觸鍵均勻度與拍點穩定度，提供 1~5 星自評並一鍵帶入練琴日誌 (+25 XP)！',
    howToSteps: [
      '1. 進入「個人練習與技能成長」➔「曲目高效練法與試聽」。',
      '2. 在導奏琴鍵下方即可看見「實戰練琴錄音 Take & 自我回放對照」控制板。',
      '3. 點擊「開始錄音 (Take)」並開始在實體樂器上彈奏。',
      '4. 彈完後點擊「停止錄音」，系統即刻產生音檔波形。',
      '5. 點擊「播放」戴上耳機自我檢核，點選星星進行自評，點擊「儲存至今日練琴日誌」自動換算時長並獲取額外 25 XP！',
      '6. 亦可點擊「下載音檔」將錄音檔存至個人電腦或手機。',
    ],
    keyButtonsToClick: [
      '點擊【🎙️ 開始錄音 (Take)】',
      '點擊【⏹️ 停止錄音 (秒數)】',
      '點擊【▶ 播放 / 暫停】即刻回放聽取',
      '點選【⭐ 評量星數】(1~5星)',
      '點擊【✨ 儲存至今日練琴日誌 (+25 XP)】',
      '點擊【📥 下載音檔 (.webm)】',
    ],
    proTip: '練琴自己彈的時候大腦都在專注手指動作，很難客觀聽出節奏是否拖拍或搶拍；錄音回放 1 次的效果往往抵過悶頭盲練 10 次！',
  },
  {
    id: 'feat-practice-log',
    category: 'practice',
    categoryLabel: '每日練習中心',
    name: '『今日練習日誌』手動歷史記錄',
    icon: '📝',
    badge: '自主打卡 · 獲取 XP',
    location: '📝 每日練習中心 ➔ 今日練習日誌與程度',
    routeKey: 'profile',
    purpose: '手動輸入每天練習曲目、練習分鐘數、1~5星自我評量、手感狀態與優缺點反思，自動累積總時長、連續打卡天數與升級經驗值。',
    howToSteps: [
      '1. 進入「每日練習中心」，預設即為「今日練習日誌與程度」。',
      '2. 在輸入框填寫今天彈奏的「曲目名稱」（如：晴天、卡農、自訂曲目）。',
      '3. 輸入本次「練習分鐘數」（如：30 或 45 分鐘）。',
      '4. 點選「本次自我評量星星數 ⭐」（1星卡關 到 5星超乎預期）。',
      '5. 選擇手感狀態（極佳 / 順手 / 平穩 / 卡關），並勾選做得好的優點或需克服的弱項。',
      '6. 點擊儲存按鈕，資料即安全寫入本地儲存庫，並即時結算本次獲得的 XP！',
    ],
    keyButtonsToClick: [
      '點選【⭐ 評量星數】(1~5星)',
      '點選【🌟極佳 / ✅順手 / ⚖️平穩 / 🧗卡關】手感狀態標籤',
      '點擊【💾 儲存今日練琴紀錄 (+XP)】',
      '點擊歷史紀錄旁的【🗑️ 刪除】可管理舊記錄',
    ],
    proTip: '每天堅持填寫日誌可累積「連續打卡天數」，連續打卡能獲得額外的升級倍率獎勵！',
  },
  {
    id: 'feat-practice-stopwatch',
    category: 'practice',
    categoryLabel: '每日練習中心',
    name: '練琴碼表計時器 & 番茄鐘',
    icon: '⏱️',
    badge: '專注計時 · 快捷帶入',
    location: '📝 每日練習中心 ➔ 頂部即時計時框',
    routeKey: 'practice',
    purpose: '練琴時實時計算彈奏時長，具備 15m 暖手、25m 番茄鐘專注與 45m 深度練習快捷鍵。',
    howToSteps: [
      '1. 在練習日誌頂部可以看到時間顯示框（00:00）。',
      '2. 點擊「15m」、「25m 🍅」或「45m」預設時間，或直接點擊播放按鈕開始計時。',
      '3. 練琴中途可隨時按「暫停」休息，按「重置」歸零。',
      '4. 計時結束後，時間會自動同步帶入下方的練習日誌表單中！',
    ],
    keyButtonsToClick: [
      '點擊【▶ 開始計時】 / 【⏸️ 暫停】 / 【🔄 重置】',
      '點選【15m 暖手】 / 【25m 🍅 番茄鐘】 / 【45m 深度練琴】',
    ],
    proTip: '推薦使用 25m 番茄鐘模式，練滿 25 分鐘休息 5 分鐘，手指關節不易疲憊。',
  },
  {
    id: 'feat-song-guide',
    category: 'practice',
    categoryLabel: '每日練習中心',
    name: '曲目高效練法與即時琴鍵試聽',
    icon: '🔍',
    badge: '曲目查詢 · 旋律試聽',
    location: '📝 每日練習中心 ➔ 曲目高效練法與試聽',
    routeKey: 'songguide',
    purpose: '查詢任何流行與古典歌曲（內建周杰倫《晴天》、告五人、五月天等多首名曲，亦支援自訂搜尋），提供4階段拆解、調性與難點解析；播放時下方兩八度琴鍵即時發光高亮！',
    howToSteps: [
      '1. 切換至「曲目高效練法與試聽」分頁。',
      '2. 在搜尋框輸入歌名（如：晴天、稻香、或任何歌曲），或點選熱門曲目標籤。',
      '3. 系統即刻載入難度、建議練習天數、和弦進行、節奏拍點與卡關避坑指南。',
      '4. 點擊「▶ 試聽旋律」啟動音訊合成，並觀察下方雙八度琴鍵同步發出金光。',
      '5. 平時也可隨時直接點擊下方黑白琴鍵當實體鋼琴彈奏對音！',
    ],
    keyButtonsToClick: [
      '在搜尋框輸入歌名後點擊【查詢曲目攻略】',
      '點擊【熱門曲目快捷標籤】(如：晴天、告白氣球、卡農)',
      '點擊【▶ 試聽旋律與即時琴鍵導引】 / 【⏹ 停止試聽】',
      '直接點擊【🎹 雙八度互動琴鍵】發聲彈奏',
      '點擊【向 AI 請教此曲練習心法】',
    ],
    proTip: '試聽時配合琴鍵金光能幫你快速建立鍵位空間記憶，抓歌練右手單音極為有效！',
  },
  {
    id: 'feat-repertoire-vault',
    category: 'practice',
    categoryLabel: '每日練習中心',
    name: '我的練琴庫與進度追蹤 (My Repertoire)',
    icon: '📌',
    badge: '曲庫管理 · 速度進度',
    location: '📝 每日練習中心 ➔ 曲目頁面下方',
    routeKey: 'songguide',
    purpose: '將喜歡或正在練習的曲目收錄至個人曲目庫，標記「🔥 攻克進行中」、「🏆 已攻克」或「✨ 待挑戰」，記錄當前 BPM 與目標 BPM。',
    howToSteps: [
      '1. 在「曲目高效練法與試聽」查到想練的歌後，滑動到下方「我的練琴庫」。',
      '2. 點擊「📌 加入我的曲目庫」即可收藏該歌曲。',
      '3. 可隨時點擊狀態標籤切換目前進度（攻克中 / 已掌握 / 待挑戰）。',
      '4. 點擊曲目名稱可一鍵重新載入該曲的完整練習步驟。',
    ],
    keyButtonsToClick: [
      '點擊【📌 加入我的曲目庫】',
      '點擊曲目卡上的【🔥 攻克中】 / 【🏆 已攻克】 / 【✨ 待挑戰】',
      '點擊【🗑️ 移除】刪除曲目',
    ],
    proTip: '設定目標原速 BPM，每次練習推進 5 BPM，能清楚看見速度進度條前進！',
  },
  {
    id: 'feat-xp-vault',
    category: 'practice',
    categoryLabel: '每日練習中心',
    name: 'XP 特權解鎖庫 & 整理對照表',
    icon: '🎁',
    badge: '23項特權 · 實質兌換',
    location: '📝 每日練習中心 ➔ 展開 XP 特權解鎖庫',
    routeKey: 'profile',
    purpose: '打卡練琴累積的 XP 經驗值，可在此解鎖 7款聲學音色皮膚、6組大師和弦進行祕笈、5項 AI Pro 特權、4項工具增強與 6大榮譽頭銜。',
    howToSteps: [
      '1. 在練習日誌中點擊「🎁 展開 XP 特權解鎖庫」。',
      '2. 在「目前已解鎖特權專區」查看已可使用的項目。',
      '3. 點選「📋 功能整理對照表」瀏覽門檻與實戰效益對照。',
      '4. 點擊各特權的即時動作按鈕（裝備音色、研讀祕笈、發動 AI 指令、佩戴稱號）。',
    ],
    keyButtonsToClick: [
      '點擊【🎁 展開 XP 特權解鎖庫】 / 【收起】',
      '點擊【✨ 裝備此音色】(施坦威鋼琴、吉他、合成器、Lo-Fi、8-Bit等)',
      '點擊【研讀祕笈】觀看大師和弦音程與連續試聽',
      '點擊【啟動 AI 指令】直接發送進階音樂指令',
      '點擊【佩戴此稱號至個人檔案】',
      '點擊【⚡ 打卡 +50 XP】測試模擬解鎖',
    ],
    proTip: '音色皮膚套用後，全站的和弦指法庫、五度圈、簡譜試聽與鋼琴琴鍵都會立即變更為該音色！',
  },

  // ==========================================
  // 2. 技能樹與搭配弱項 (Skills Hub)
  // ==========================================
  {
    id: 'feat-skill-tree',
    category: 'skills',
    categoryLabel: '技能樹與搭配',
    name: '4大樂器專業技能樹路線圖',
    icon: '🗺️',
    badge: '5大階段 · 依賴防呆',
    location: '🗺️ 技能樹與搭配 ➔ 專業技能地圖',
    routeKey: 'skilltree',
    purpose: '依照流行鋼琴、民謠吉他、爵士鼓與 DTM 數位編曲切換學習地圖，涵蓋基礎心智、和聲骨架、節奏律動、視奏抓耳與風格即興5大階段。',
    howToSteps: [
      '1. 進入「技能樹與搭配」頁面。',
      '2. 點選頂部樂器標籤（流行鋼琴 / 民謠吉他 / 爵士鼓 / DTM編曲）。',
      '3. 點擊任何技能圓形節點（如：三和弦、七和弦、切分音），查看技能核心要領。',
      '4. 點擊「未接觸」、「學習中」或「已掌握」更新您的技能掌握度。',
      '5. 未滿足前置依賴的技能會有智慧鎖定提醒，引導您循序漸進。',
    ],
    keyButtonsToClick: [
      '點選【流行鋼琴】 / 【民謠吉他】 / 【爵士鼓】 / 【DTM 編曲】樂器頁籤',
      '點擊技能畫布上的【圓形技能節點】',
      '點選【未接觸】 / 【學習中】 / 【已掌握】掌握度按鈕',
      '點擊【🤖 向 AI 請教此技能】',
    ],
    proTip: '每將一個技能標記為「已掌握」，個人檔案的掌握度百分比就會隨之提升！',
  },
  {
    id: 'feat-skill-synergy',
    category: 'skills',
    categoryLabel: '技能樹與搭配',
    name: '技能搭配推薦與弱項加強診斷',
    icon: '⚡',
    badge: '1+1>2 · 弱項體檢',
    location: '🗺️ 技能樹與搭配 ➔ 技能搭配與弱項加強',
    routeKey: 'synergy',
    purpose: '探索「1+1 > 2」的黃金技能搭檔（如 4536 和弦 + 切分音拍點），並提供「5題弱項快速體檢」為您生成專屬弱項加強菜單。',
    howToSteps: [
      '1. 在「技能樹與搭配」頁面切換至「技能搭配與弱項加強」分頁。',
      '2. 瀏覽各項技能搭檔卡片（如：流行彈唱金牌拍檔、律動進化拍檔）。',
      '3. 點擊「弱項加強診斷」，回答練習瓶頸問題。',
      '4. 系統自動分析卡關根源並推薦對應的克服練習方案。',
    ],
    keyButtonsToClick: [
      '點選【技能搭配與弱項加強】分頁標籤',
      '點擊搭配卡片上的【查看搭配詳情】',
      '點擊【🧪 開始弱項診斷測驗】',
      '點擊【📋 生成個人弱項加強菜單】',
    ],
    proTip: '練琴常遇到瓶頸往往不是手指不夠快，而是缺少某個輔助技能（如換和弦卡頓通常是左手盲彈盲按依賴未克服）。',
  },

  // ==========================================
  // 3. 實戰工具箱 (Unified Toolbox)
  // ==========================================
  {
    id: 'feat-tool-chord',
    category: 'tools',
    categoryLabel: '實戰工具箱',
    name: '🎹 和弦指法庫 (Chord Toolbox)',
    icon: '🎹',
    badge: '即時發聲 · 琴鍵吉他',
    location: '🧰 實戰工具箱 ➔ 和弦指法庫',
    routeKey: 'toolbox',
    purpose: '查詢大三、小三、屬七、大七、小七、掛留等各類和弦，提供鋼琴琴鍵位置圖與吉他六線譜指法，並支援直接發聲試聽。',
    howToSteps: [
      '1. 進入「實戰工具箱」，預設即為「和弦指法庫」。',
      '2. 點選根音（C, D, E, F, G, A, B, C#, Eb...）。',
      '3. 點選和弦類型（Maj, m, 7, maj7, m7, sus4, add9, dim...）。',
      '4. 點擊「🔊 彈奏此和弦」聆聽和弦色彩。',
      '5. 切換吉他/鋼琴檢視查看手指按壓位置與組成音符。',
    ],
    keyButtonsToClick: [
      '點選【根音按鈕】(C, D, E...)',
      '點選【和弦類型標籤】(Maj, m, 7...)',
      '點擊【🔊 彈奏此和弦】發出合成器聲音',
      '點擊【向教練提問此和弦】',
    ],
    proTip: '搭配在 XP 特權解鎖庫中裝備的音色皮膚，彈奏和弦時會呈現出吉他箱體共鳴或 80s 合成器合唱！',
  },
  {
    id: 'feat-tool-circle',
    category: 'tools',
    categoryLabel: '實戰工具箱',
    name: '🎡 五度圈轉調與家族和弦盤',
    icon: '🎡',
    badge: '12調五度圈 · 轉調推算',
    location: '🧰 實戰工具箱 ➔ 五度圈轉調',
    routeKey: 'circle',
    purpose: '視覺化 12 大調五度圈圓盤，點選任何調性即時對應關係小調、升降記號數，以及 7 個順階家族和弦（I, ii, iii, IV, V, vi, vii°），並附帶移調工具與連續試聽。',
    howToSteps: [
      '1. 進入「實戰工具箱」➔ 點選「五度圈轉調」。',
      '2. 點擊外圈 12 大調或內圈關係小調（如：C, G, D, A, F, Bb...）。',
      '3. 下方立即列出該調的 7 個順階和弦卡片。',
      '4. 點擊任一張和弦卡可直接聆聽該和弦聲音。',
      '5. 點擊「▶ 試聽常見進行」可聆聽 1-5-6-4 或 2-5-1 連續播放。',
    ],
    keyButtonsToClick: [
      '點擊五度圈圖形上的【12調性扇形區塊】',
      '點擊【順階和弦卡片】直接發聲試聽',
      '點擊【▶ 試聽常見進行 (1-5-6-4 / 2-5-1)】',
      '在右側【萬能轉調機】輸入和弦進行一鍵移調',
    ],
    proTip: '五度圈相鄰的兩個調性只差一個升降記號，創作或改編時順時針轉調能製造情緒升溫！',
  },
  {
    id: 'feat-tool-tuner',
    category: 'tools',
    categoryLabel: '實戰工具箱',
    name: '🎛️ 專業實時樂器調音器 (Pro Instrument Tuner)',
    icon: '🎛️',
    badge: '吉他 · 烏克麗麗 · 小提琴 · 貝斯 · 半音階',
    location: '🧰 實戰工具箱 ➔ 實時調音器',
    routeKey: 'tuner',
    purpose: '高精度自相關 (Autocorrelation) 音高識別算法，誤差僅 ±1 音分 (Cent)。支援吉他 6 弦、烏克麗麗 4 弦、小提琴 4 弦、電貝斯與十二平均律半音階，提供實時指針、A4 基準頻率微調 (432Hz~444Hz) 與各弦純音試聽。',
    howToSteps: [
      '1. 進入「實戰工具箱」➔ 點選「實時調音器」。',
      '2. 點擊「啟動麥克風調音」允許瀏覽器收音（免安裝任何插件）。',
      '3. 選擇您的樂器種類（吉他 / 烏克麗麗 / 小提琴 / 電貝斯 / 半音階）。',
      '4. 撥動單弦，觀察中央指針：綠色 In Tune 代表音準完全對齊；偏左轉緊弦軸 (Tune Up)；偏右轉鬆弦軸 (Tune Down)。',
      '5. 吵雜環境亦可點擊各弦「聽音」按鈕，聆聽標準音頻進行人耳同頻對齊。',
    ],
    keyButtonsToClick: [
      '點擊【啟動麥克風調音】 / 【停止收音】',
      '點選【🎸 民謠/電吉他】 / 【🌴 烏克麗麗】 / 【🎻 小提琴】 / 【⚡ 電貝斯】 / 【🌈 半音階】',
      '點選各弦卡片上的【聽音】按鈕播放標準參考音',
      '點選【A4 基準頻率下拉選單】(432Hz / 440Hz / 442Hz / 444Hz)',
      '點擊【切回全自動識別】',
    ],
    proTip: '弦樂調音祕訣：由低往高調！如果音偏高，先放鬆到略低於標準，再旋緊到位，弦線張力咬合最持久不走音。',
  },
  {
    id: 'feat-tool-ear',
    category: 'tools',
    categoryLabel: '實戰工具箱',
    name: '🎯 聽音盲測與音感特訓 (Ear Trainer)',
    icon: '🎯',
    badge: '音感測驗 · 賺取 XP',
    location: '🧰 實戰工具箱 ➔ 聽音盲測',
    routeKey: 'ear',
    purpose: '訓練耳朵辨音能力，包含「單音盲測」、「和弦色彩盲測（大三/小三/屬七/減七）」與「音程辨識」，答對賺取連勝倍率與 XP！',
    howToSteps: [
      '1. 進入「實戰工具箱」➔ 點選「聽音盲測」。',
      '2. 選擇「單音辨識」、「和弦品質」或「音程聽辨」模式。',
      '3. 點擊「▶ 播放題目聲音」仔細聆聽。',
      '4. 點選您聽到的音符或和弦色彩按鈕。',
      '5. 系統立即判定對錯，給予音感分析並發放經驗值！',
    ],
    keyButtonsToClick: [
      '點擊【▶ 播放題目聲音】 / 【🔄 再次聆聽】',
      '點選【答案選項按鈕】(如：C4, E4, 大三和弦, 屬七和弦等)',
      '點擊【下一題 ➔】',
      '點選【單音 / 和弦色彩 / 音程】訓練模式切換標籤',
    ],
    proTip: '閉上眼睛感受和弦的「明亮感（大和弦）」或「憂傷內斂感（小和弦）」，比死記頻率更容易抓住音感！',
  },
  {
    id: 'feat-tool-metronome',
    category: 'tools',
    categoryLabel: '實戰工具箱',
    name: '⏱️ 智慧節拍器 (Interactive Metronome)',
    icon: '⏱️',
    badge: '40~240 BPM · TAP測速',
    location: '🧰 實戰工具箱 ➔ 智慧節拍器',
    routeKey: 'metronome',
    purpose: '高精度 Web Audio 聲學打點節拍器，支援 40~240 BPM 自由調速、多種拍號切換（2/4, 3/4, 4/4, 6/8）、Tap Tempo 連擊測速與重音提示。',
    howToSteps: [
      '1. 進入「實戰工具箱」➔ 點選「智慧節拍器」。',
      '2. 拖拉 BPM 滑桿或點擊「-5 / +5」按鈕設定速度。',
      '3. 或跟著歌曲節奏連續點擊「TAP」按鈕自動換算拍速。',
      '4. 點擊「▶ 開始」即可開啟精準打點。',
    ],
    keyButtonsToClick: [
      '點擊【▶ 開始節拍器】 / 【⏹ 停止】',
      '點擊【👆 TAP 測速按鈕】連續點擊測速',
      '點擊【-5】 / 【+5】微調速度',
      '點選【2/4 · 3/4 · 4/4 · 6/8】拍號切換按鈕',
    ],
    proTip: '練習卡關的難點樂句時，先將節拍器調至原速的 50%（如 60 BPM），連續彈奏 3 次無失誤再每次 +5 BPM 提速！',
  },
  {
    id: 'feat-tool-score',
    category: 'tools',
    categoryLabel: '實戰工具箱',
    name: '🎼 簡譜五線譜轉換器 (Score Converter)',
    icon: '🎼',
    badge: '雙向對照 · 旋律試聽',
    location: '🧰 實戰工具箱 ➔ 簡譜轉換器',
    routeKey: 'stave',
    purpose: '解決看不懂五線譜或簡譜的痛點，輸入簡譜數字（1 2 3 5 6）即時生成五線譜音符位置與唱名，並支援一鍵完整播放試聽！',
    howToSteps: [
      '1. 進入「實戰工具箱」➔ 點選「簡譜轉換器」。',
      '2. 在輸入框打入簡譜數字（例如：1 1 5 5 6 6 5），或點選預設兒歌經典標籤。',
      '3. 下方即刻即時渲染出五線譜音符位置、高低八度音點與對應音名。',
      '4. 點擊「▶ 播放旋律」完整聆聽發聲。',
    ],
    keyButtonsToClick: [
      '在輸入框鍵入【簡譜數字】',
      '點擊【預設範例歌曲標籤】(如小星星、卡農等)',
      '點擊【▶ 播放此段旋律】',
      '點擊【清空重填】',
    ],
    proTip: '簡譜數字上的加點代表高八度，減點代表低八度，換算至五線譜一目了然！',
  },
  {
    id: 'feat-tool-quiz',
    category: 'tools',
    categoryLabel: '實戰工具箱',
    name: '🏆 樂理實戰闖關試卷 (Challenge Quests)',
    icon: '🏆',
    badge: '闖關試卷 · 通關證書',
    location: '🧰 實戰工具箱 ➔ 實戰測驗卷',
    routeKey: 'quiz',
    purpose: '涵蓋和弦組成音、調號升降記號、拍子記號等趣味情境題，附帶完整觀念解析，通關後頒發證書並獎勵 XP 經驗！',
    howToSteps: [
      '1. 進入「實戰工具箱」➔ 點選「實戰測驗卷」。',
      '2. 閱讀題目情境，點選答案選項。',
      '3. 系統即時顯示答對或答錯，並展開深入樂理小撇步解析。',
      '4. 完成所有題目後結算成績並獲取證書。',
    ],
    keyButtonsToClick: [
      '點選【A / B / C / D 選項按鈕】',
      '點擊【提交答案】',
      '點擊【下一題 ➔】',
      '點擊【重新測驗】',
    ],
    proTip: '題目均由淺入深設計，即使答錯也能透過解析學會核心邏輯，不必死背考卷！',
  },

  // ==========================================
  // 4. AI 個人音樂教練 (AI Music Coach)
  // ==========================================
  {
    id: 'feat-ai-coach',
    category: 'coach',
    categoryLabel: 'AI 個人教練',
    name: '🤖 啟發式 AI 音樂教練 (AiMusicCoach)',
    icon: '🤖',
    badge: '拋磚引玉 · 啟發引導',
    location: '頂部右上角 ➔ 【AI 個人教練】按鈕',
    routeKey: 'coach',
    purpose: '全天候音樂導師，不直接給生硬答案，而是透過「拋磚引玉、引導思考」協助您克服彈奏卡關、重配和聲、抓歌與寫歌靈感。',
    howToSteps: [
      '1. 點擊頂部右上角的「🤖 AI 個人教練」按鈕（或各頁面中的請教 AI 按鈕）。',
      '2. 點選教練提供的「常用啟發式提問卡片」，或在下方輸入框鍵入任何樂理與練習問題。',
      '3. 點擊「發送」按鈕，教練即刻為您做深入淺出的步驟引導。',
      '4. 在 XP 特權解鎖庫中解鎖的「重配和聲機」、「抓歌實戰」、「副歌鉤子」特權也在此發動！',
    ],
    keyButtonsToClick: [
      '點擊頂部右上角【🤖 AI 個人教練】按鈕',
      '點擊【預設啟發式提問快捷卡片】(如：重配和聲、卡關如何突破、和弦搭配)',
      '在輸入框打字後點擊【發送提問 ➔】',
      '點擊【清空對話 / 重新開始】',
    ],
    proTip: '提問時附帶您目前的程度（如「我是鋼琴新手」）與卡關小節，AI 教練能給出更精準的分解練習步驟！',
  },
];

interface AllFeaturesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const AllFeaturesGuideModal: React.FC<AllFeaturesGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  if (!isOpen) return null;

  const filteredFeatures = ALL_FEATURES_CATALOG.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = item.name.toLowerCase().includes(q);
      const inPurpose = item.purpose.toLowerCase().includes(q);
      const inLocation = item.location.toLowerCase().includes(q);
      const inSteps = item.howToSteps.some((s) => s.toLowerCase().includes(q));
      const inButtons = item.keyButtonsToClick.some((b) => b.toLowerCase().includes(q));
      if (!inName && !inPurpose && !inLocation && !inSteps && !inButtons) return false;
    }

    return true;
  });

  const handleJumpToFeature = (routeKey: string) => {
    onNavigateToTab(routeKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <BookOpen className="w-4 h-4" />
              <span>MuStudio 音樂實驗室 · 官方全功能指南手冊</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>所有功能整理表 & 按鍵使用指南</span>
              <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                收錄 14 大核心功能
              </span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              不知道某個功能在哪裡？不知道要按什麼？本指南彙整全站所有功能目的、詳細操作步驟與「按什麼按鈕可以使用」，並提供一鍵直達傳送門！
            </p>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="關閉手冊"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* View Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>📋 完整對照整理表</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>🎴 逐步指引卡片</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋功能名稱、按鍵關鍵字（如：試聽、日誌、節拍器、五度圈、XP）..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Section Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>頁面分類：</span>
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              全部功能 ({ALL_FEATURES_CATALOG.length})
            </button>
            <button
              onClick={() => setSelectedCategory('practice')}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                selectedCategory === 'practice'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              📝 每日練習中心 (5)
            </button>
            <button
              onClick={() => setSelectedCategory('skills')}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                selectedCategory === 'skills'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🗺️ 技能樹與搭配 (2)
            </button>
            <button
              onClick={() => setSelectedCategory('tools')}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                selectedCategory === 'tools'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🧰 實戰工具箱 (6)
            </button>
            <button
              onClick={() => setSelectedCategory('coach')}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                selectedCategory === 'coach'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🤖 AI 個人教練 (1)
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {filteredFeatures.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm space-y-2">
              <p>查無符合「{searchQuery}」的功能項目。</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-amber-400 text-xs underline cursor-pointer"
              >
                清除搜尋條件查看全部
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* ============================================================ */
            /* VIEW 1: 完整功能對照整理表 (Comprehensive Table View) */
            /* ============================================================ */
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-inner">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-semibold">
                    <th className="py-3 px-4 font-mono">功能名稱與所在位置</th>
                    <th className="py-3 px-4">功能目的與實戰效益</th>
                    <th className="py-3 px-4 min-w-[260px]">如何使用步驟</th>
                    <th className="py-3 px-4 min-w-[220px]">按什麼可以使用 (關鍵按鍵)</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">一鍵前往</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredFeatures.map((feat) => (
                    <tr key={feat.id} className="hover:bg-slate-900/60 transition-colors">
                      {/* Name & Location */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                              {feat.icon}
                            </span>
                            <div>
                              <div className="font-bold text-white text-sm">{feat.name}</div>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20">
                                {feat.badge}
                              </span>
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                            <span>📍</span>
                            <span className="text-slate-300">{feat.location}</span>
                          </div>
                        </div>
                      </td>

                      {/* Purpose */}
                      <td className="py-3.5 px-4 align-top max-w-xs text-slate-300 leading-relaxed text-[11px]">
                        <p>{feat.purpose}</p>
                        {feat.proTip && (
                          <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] leading-relaxed">
                            💡 <strong>小撇步：</strong> {feat.proTip}
                          </div>
                        )}
                      </td>

                      {/* How To Steps */}
                      <td className="py-3.5 px-4 align-top text-slate-300 text-[11px]">
                        <ol className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                          {feat.howToSteps.map((step, sIdx) => (
                            <li key={sIdx} className="leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </td>

                      {/* Key Buttons */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1.5">
                          {feat.keyButtonsToClick.map((btn, bIdx) => (
                            <div
                              key={bIdx}
                              className="text-[11px] font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{btn}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Jump Button */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <button
                          onClick={() => handleJumpToFeature(feat.routeKey)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/15 cursor-pointer ml-auto"
                        >
                          <span>🚀 前往使用</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* ============================================================ */
            /* VIEW 2: 步驟指引卡片模式 (Step Cards View) */
            /* ============================================================ */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFeatures.map((feat) => (
                <div
                  key={feat.id}
                  className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-4 text-xs shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                          {feat.icon}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm text-white">{feat.name}</h3>
                          <span className="text-[10px] font-mono text-amber-400">{feat.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                        {feat.badge}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">{feat.purpose}</p>

                    {/* How to use */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block font-bold">
                        📖 如何使用步驟：
                      </span>
                      <ol className="space-y-1 text-slate-300 text-[11px] bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                        {feat.howToSteps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Button to click */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                        🎯 按什麼按鈕可以使用：
                      </span>
                      <div className="space-y-1">
                        {feat.keyButtonsToClick.map((btn, bIdx) => (
                          <div
                            key={bIdx}
                            className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{btn}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {feat.proTip && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] leading-relaxed">
                        💡 <strong>小撇步：</strong> {feat.proTip}
                      </div>
                    )}
                  </div>

                  {/* Jump button */}
                  <div className="pt-2 border-t border-slate-900 flex justify-end">
                    <button
                      onClick={() => handleJumpToFeature(feat.routeKey)}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-500/15"
                    >
                      <span>🚀 立即前往使用此功能</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>MuStudio 隨時可在頂部導覽列點擊「功能整理表」重新開啟此指南。</span>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer self-end sm:self-auto"
          >
            關閉指南
          </button>
        </div>
      </div>
    </div>
  );
};
