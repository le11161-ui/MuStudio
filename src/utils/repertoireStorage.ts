export interface RepertoireItem {
  id: string;
  songName: string;
  artist: string;
  instrument: string;
  status: 'practicing' | 'mastered' | 'wishlist'; // 正在練 | 已攻克 | 待挑戰
  currentSpeedBpm: number;
  targetBpm: number;
  totalPractices: number;
  lastPracticedDate: string;
  notes?: string;
}

const STORAGE_KEY = 'mustudio_repertoire_list_v1';

const DEFAULT_REPERTOIRE: RepertoireItem[] = [
  {
    id: 'rep-1',
    songName: '晴天',
    artist: '周杰倫',
    instrument: '民謠吉他 / 流行鋼琴',
    status: 'practicing',
    currentSpeedBpm: 65,
    targetBpm: 78,
    totalPractices: 4,
    lastPracticedDate: '2026-10-16',
    notes: '前奏 Em - C - G - D 換和弦需流暢，第 2 階段 1-5-8 分解進行中',
  },
  {
    id: 'rep-2',
    songName: '卡農 (Canon in D)',
    artist: '約翰·帕海貝爾',
    instrument: '古典/流行鋼琴',
    status: 'practicing',
    currentSpeedBpm: 55,
    targetBpm: 72,
    totalPractices: 3,
    lastPracticedDate: '2026-10-15',
    notes: '經典 8 小節和弦循環，加強左手十六分音符分解音獨立性',
  },
  {
    id: 'rep-3',
    songName: '小星星變奏曲',
    artist: '莫札特',
    instrument: '古典鋼琴',
    status: 'mastered',
    currentSpeedBpm: 90,
    targetBpm: 90,
    totalPractices: 8,
    lastPracticedDate: '2026-10-12',
    notes: '已攻克原速，節奏均勻度與落鍵顆粒感良好',
  },
];

export const loadRepertoire = (): RepertoireItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveRepertoire(DEFAULT_REPERTOIRE);
      return DEFAULT_REPERTOIRE;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_REPERTOIRE;
  }
};

export const saveRepertoire = (items: RepertoireItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save repertoire', e);
  }
};

export const addOrUpdateRepertoireItem = (item: Omit<RepertoireItem, 'id'> & { id?: string }): RepertoireItem[] => {
  const list = loadRepertoire();
  const existingIdx = list.findIndex(
    (i) => i.id === item.id || i.songName.toLowerCase().trim() === item.songName.toLowerCase().trim()
  );

  if (existingIdx >= 0) {
    list[existingIdx] = {
      ...list[existingIdx],
      ...item,
      id: list[existingIdx].id,
      totalPractices: list[existingIdx].totalPractices + 1,
      lastPracticedDate: new Date().toISOString().split('T')[0],
    };
  } else {
    list.unshift({
      ...item,
      id: `rep-${Date.now()}`,
      totalPractices: 1,
      lastPracticedDate: new Date().toISOString().split('T')[0],
    });
  }

  saveRepertoire(list);
  return list;
};

export const updateRepertoireStatus = (
  id: string,
  status: RepertoireItem['status']
): RepertoireItem[] => {
  const list = loadRepertoire();
  const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
  saveRepertoire(updated);
  return updated;
};

export const deleteRepertoireItem = (id: string): RepertoireItem[] => {
  const list = loadRepertoire().filter((item) => item.id !== id);
  saveRepertoire(list);
  return list;
};
