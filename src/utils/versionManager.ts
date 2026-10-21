export interface VersionChangelogItem {
  version: string;
  releaseTitle: string;
  releaseDate: string;
  badge: string;
  isLatest: boolean;
  highlights: {
    category: string;
    icon: string;
    title: string;
    description: string;
    tag: string;
  }[];
}

export const CURRENT_APP_VERSION = 'v2.6.0';
export const CURRENT_RELEASE_TITLE = 'MuStudio 2.6.0 · 專業實時樂器調音器 · ±1 Cent 高精準指針 · A4 基準頻率微調';
export const CURRENT_RELEASE_DATE = '2026-10-21';

export const APP_CHANGELOG: VersionChangelogItem[] = [
  {
    version: 'v2.6.0',
    releaseTitle: '專業實時樂器調音器 (Pro Tuner) · 高精度音分指針 · 基準頻率微調',
    releaseDate: '2026-10-21',
    badge: '最新更新',
    isLatest: true,
    highlights: [
      {
        category: '實時調音',
        icon: '🎛️',
        title: '專業實時樂器調音器 (Pro Instrument Tuner)',
        description: '內建高精度自相關 (Autocorrelation) 音高識別算法，誤差僅 ±1 音分 (Cent)。支援吉他 6 弦、烏克麗麗 4 弦、小提琴 4 弦、電貝斯與全音域半音階自動識別！',
        tag: '重磅上線',
      },
      {
        category: '視覺指針',
        icon: '🎯',
        title: '實時音分 (Cents) 動態指針與音準鎖定回饋',
        description: '動態顯示目前發聲音高偏差（偏低 Flat / 偏高 Sharp），達到 ±3 Cents 範圍即刻亮起綠色 In Tune 鎖定光芒，調音精準直觀！',
        tag: '毫秒級反應',
      },
      {
        category: '頻率微調',
        icon: '🎚️',
        title: 'A4 基準頻率自由切換 (432Hz ~ 444Hz) 與各弦純音試聽',
        description: '支援國際標準 440Hz、療癒 432Hz、交響樂 442Hz 與明亮 444Hz 自由校準；各弦附帶純音按鈕，免麥克風環境也能憑耳朵快速同頻調弦！',
        tag: '專業考究',
      },
    ],
  },
  {
    version: 'v2.5.1',
    releaseTitle: '真實自然高音質專注氛圍 · 練琴錄音回放 · 遠端版本自動推播',
    releaseDate: '2026-10-21',
    badge: '穩定版本',
    isLatest: false,
    highlights: [
      {
        category: '真實音景',
        icon: '🎧',
        title: '全新真實自然無損原聲錄音 (Authentic Field Recordings)',
        description: '全面更換為真實採樣的高清音效：窗外真實雨滴拍打聲、溫暖壁爐木炭真實爆裂劈啪聲、復古黑膠唱針底噪、午後咖啡館與自然溪流！支援獨立音量與多音軌混音。',
        tag: '體驗大革新',
      },
      {
        category: '遠端推播',
        icon: '📡',
        title: '雲端更新自動廣播即時連動 (Remote Update Broadcaster)',
        description: '這邊只要更新任何功能或版號，遠端瀏覽器每 30 秒自動偵測並於頂部亮起閃爍金光「✨ 換成更新版本」，點擊立即重載享受最新功能！',
        tag: '即時連線',
      },
      {
        category: '練琴錄音',
        icon: '🎙️',
        title: '實戰練琴錄音與波形回放對照 (Practice Audio Recorder)',
        description: '支援一鍵開啟麥克風錄音，錄製自己彈奏的樂段、試聽波形回放、自我評分與重錄，聽出節奏與音色的細微瑕疵！',
        tag: '專業練琴利器',
      },
    ],
  },
  {
    version: 'v2.5.0',
    releaseTitle: '今日課程修煉排程 · 即時版本中心 · 專注氛圍音',
    releaseDate: '2026-10-21',
    badge: '穩定版本',
    isLatest: false,
    highlights: [
      {
        category: '排程規劃',
        icon: '🗓️',
        title: '今日課程修煉排程規劃 (Practice Course Planner)',
        description: '清楚規劃今天第1步做什麼、第2步做什麼，內建4大經典課表、自訂步驟、互動打勾成就音效、一鍵直達工具與一鍵帶入日誌！',
        tag: '全新功能',
      },
      {
        category: '版本更新',
        icon: '✨',
        title: '即時版本更新中心與通知按鈕 (Live Update Center)',
        description: '只要有發布任何功能更新，頂部立即亮起「已更新 / 換成更新版本」按鈕，隨時查閱更新公告並一鍵重載最新快取！',
        tag: '系統升級',
      },
      {
        category: '極致目錄',
        icon: '🗂️',
        title: '目錄精簡為 2 大超級整合殿堂',
        description: '將原本分散的選單全面收攏為「📝 個人練習與技能成長」與「🧰 實戰工具箱與 AI 教練」，介面極致俐落不眼花。',
        tag: '架構重構',
      },
      {
        category: '專注氛圍',
        icon: '🎧',
        title: 'Lo-Fi 練琴專注背景氛圍音 (Ambient Soundscape)',
        description: '以 Web Audio 合成窗外溫柔雨聲、復古黑膠唱片底噪、咖啡館與晚風，讓練琴沉浸感倍增。',
        tag: '體驗增強',
      },
      {
        category: '數據備份',
        icon: '💾',
        title: '練琴歷史與 XP 數據備份匯出/還原',
        description: '支援一鍵下載個人 JSON 數據備份與還原，練琴紀錄與成就永久安心保存。',
        tag: '實用工具',
      },
    ],
  },
  {
    version: 'v2.4.0',
    releaseTitle: 'XP 特權解鎖庫 · 全功能使用指南對照表',
    releaseDate: '2026-10-19',
    badge: '特權升級',
    isLatest: false,
    highlights: [
      {
        category: 'XP 系統',
        icon: '🎁',
        title: '23 項 XP 實質特權解鎖庫與對照表',
        description: '解鎖 7 款聲學音色皮膚、6 組大師和弦進行祕笈、5 項 AI Pro 特權、4 項工具增強與 6 大榮譽稱號。',
        tag: '核心激勵',
      },
      {
        category: '指南手冊',
        icon: '📖',
        title: '所有功能整理表 & 按鍵使用指南手冊',
        description: '完整收錄全站 15 大功能目的、逐步使用步驟與「按什麼按鈕可以使用」，並提供一鍵直達傳送門。',
        tag: '操作手冊',
      },
    ],
  },
  {
    version: 'v2.3.0',
    releaseTitle: '五度圈推算盤 · 聽音盲測 · 雙八度琴鍵導引',
    releaseDate: '2026-10-18',
    badge: '工具豐富',
    isLatest: false,
    highlights: [
      {
        category: '樂理工具',
        icon: '🎡',
        title: '12 調五度圈轉調與家族和弦盤',
        description: '點選調性即時對應關係小調、升降記號數與 7 個順階和弦發聲試聽。',
        tag: '樂理利器',
      },
      {
        category: '耳力特訓',
        icon: '🎯',
        title: '聽音盲測中心 (Ear Trainer)',
        description: '單音、和弦色彩與音程聽辨挑戰，答對賺取連勝倍率與 XP。',
        tag: '音感測驗',
      },
    ],
  },
];

const VERSION_STORAGE_KEY = 'mustudio_client_version_cache';
const SIMULATE_UPDATE_KEY = 'mustudio_simulated_new_version';

export const getStoredVersion = (): string => {
  return localStorage.getItem(VERSION_STORAGE_KEY) || 'v2.4.0';
};

export const hasNewVersionAvailable = (): boolean => {
  // If simulated version is present
  const simulated = localStorage.getItem(SIMULATE_UPDATE_KEY);
  if (simulated) return true;

  const stored = getStoredVersion();
  return stored !== CURRENT_APP_VERSION;
};

export const getLatestAvailableVersion = (): string => {
  return localStorage.getItem(SIMULATE_UPDATE_KEY) || CURRENT_APP_VERSION;
};

export const applyVersionUpdate = () => {
  localStorage.setItem(VERSION_STORAGE_KEY, CURRENT_APP_VERSION);
  localStorage.removeItem(SIMULATE_UPDATE_KEY);
  // Reload cache
  window.location.reload();
};

export const markVersionAsUpToDate = () => {
  localStorage.setItem(VERSION_STORAGE_KEY, CURRENT_APP_VERSION);
  localStorage.removeItem(SIMULATE_UPDATE_KEY);
};

export const simulateNewVersionTrigger = (mockVersion: string = 'v2.6.0 (即將發布全新吉他六線指彈譜庫)') => {
  localStorage.setItem(SIMULATE_UPDATE_KEY, mockVersion);
};

export const clearSimulatedVersion = () => {
  localStorage.removeItem(SIMULATE_UPDATE_KEY);
  localStorage.setItem(VERSION_STORAGE_KEY, CURRENT_APP_VERSION);
};

export const checkRemoteVersionOnline = async (): Promise<{ hasUpdate: boolean; latestVersion: string }> => {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`);
    if (!res.ok) throw new Error('Failed to fetch version manifest');
    const data = await res.json();
    const remoteVer = data.version || CURRENT_APP_VERSION;
    const storedVer = getStoredVersion();
    const hasUpdate = remoteVer !== storedVer || hasNewVersionAvailable();
    return { hasUpdate, latestVersion: remoteVer };
  } catch {
    return {
      hasUpdate: hasNewVersionAvailable(),
      latestVersion: getLatestAvailableVersion(),
    };
  }
};

