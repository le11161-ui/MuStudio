import { ChordDefinition } from '../types/music';

export const CHORD_DATABASE: Record<string, ChordDefinition> = {
  // C Chords
  'C': {
    root: 'C',
    quality: 'Major',
    name: 'C 大三和弦',
    description: '明亮、穩定、基礎的大調主和弦，給人溫暖開闊感。',
    formula: '1 - 3 - 5',
    notes: ['C', 'E', 'G'],
    pianoKeys: [12, 16, 19], // C4, E4, G4
    pianoFingerings: ['1', '3', '5'],
    guitar: {
      frets: ['x', 3, 2, 0, 1, 0],
      fingers: [null, 3, 2, null, 1, null],
      baseFret: 1
    },
    ukulele: {
      frets: [0, 0, 0, 3],
      fingers: [null, null, null, 3],
      baseFret: 1
    }
  },
  'Cm': {
    root: 'C',
    quality: 'Minor',
    name: 'C 小三和弦',
    description: '深沉、內斂、悲傷的調性，常出現在憂鬱情緒段落。',
    formula: '1 - b3 - 5',
    notes: ['C', 'Eb', 'G'],
    pianoKeys: [12, 15, 19],
    pianoFingerings: ['1', '2', '5'],
    guitar: {
      frets: ['x', 3, 5, 5, 4, 3],
      fingers: [null, 1, 3, 4, 2, 1],
      baseFret: 3
    },
    ukulele: {
      frets: [0, 3, 3, 3],
      fingers: [null, 1, 2, 3],
      baseFret: 1
    }
  },
  'Cmaj7': {
    root: 'C',
    quality: 'maj7',
    name: 'C 大七和弦 (Cmaj7)',
    description: '浪漫微醺、日系 City Pop、Bossa Nova 必備高級感和聲。',
    formula: '1 - 3 - 5 - 7',
    notes: ['C', 'E', 'G', 'B'],
    pianoKeys: [12, 16, 19, 23],
    pianoFingerings: ['1', '2', '3', '5'],
    guitar: {
      frets: ['x', 3, 2, 0, 0, 0],
      fingers: [null, 3, 2, null, null, null],
      baseFret: 1
    },
    ukulele: {
      frets: [0, 0, 0, 2],
      fingers: [null, null, null, 2],
      baseFret: 1
    }
  },
  'C7': {
    root: 'C',
    quality: '7',
    name: 'C 屬七和弦 (C7)',
    description: '藍調 (Blues) 的靈魂！具有強烈往 F 和弦解決的推動力。',
    formula: '1 - 3 - 5 - b7',
    notes: ['C', 'E', 'G', 'Bb'],
    pianoKeys: [12, 16, 19, 22],
    pianoFingerings: ['1', '2', '3', '4'],
    guitar: {
      frets: ['x', 3, 2, 3, 1, 0],
      fingers: [null, 3, 2, 4, 1, null],
      baseFret: 1
    },
    ukulele: {
      frets: [0, 0, 0, 1],
      fingers: [null, null, null, 1],
      baseFret: 1
    }
  },
  'Csus4': {
    root: 'C',
    quality: 'sus4',
    name: 'C 掛四和弦 (Csus4)',
    description: '省略三音改以純四音懸掛，製造懸疑與渴望解決的浮空感。',
    formula: '1 - 4 - 5',
    notes: ['C', 'F', 'G'],
    pianoKeys: [12, 17, 19],
    pianoFingerings: ['1', '3', '5'],
    guitar: {
      frets: ['x', 3, 3, 0, 1, 1],
      fingers: [null, 3, 4, null, 1, 1],
      baseFret: 1
    },
    ukulele: {
      frets: [0, 0, 1, 3],
      fingers: [null, null, 1, 3],
      baseFret: 1
    }
  },

  // D Chords
  'D': {
    root: 'D',
    quality: 'Major',
    name: 'D 大三和弦',
    description: '清脆昂揚，鄉村、民謠與搖滾樂最常使用的清亮和聲。',
    formula: '1 - 3 - 5',
    notes: ['D', 'F#', 'A'],
    pianoKeys: [14, 18, 21],
    pianoFingerings: ['1', '3', '5'],
    guitar: {
      frets: ['x', 'x', 0, 2, 3, 2],
      fingers: [null, null, null, 1, 3, 2],
      baseFret: 1
    },
    ukulele: {
      frets: [2, 2, 2, 0],
      fingers: [1, 2, 3, null],
      baseFret: 1
    }
  },
  'Dm': {
    root: 'D',
    quality: 'Minor',
    name: 'D 小三和弦',
    description: 'C 大調中的 ii 級和弦，流行抒情曲橋段不可或缺的和聲過渡。',
    formula: '1 - b3 - 5',
    notes: ['D', 'F', 'A'],
    pianoKeys: [14, 17, 21],
    pianoFingerings: ['1', '2', '5'],
    guitar: {
      frets: ['x', 'x', 0, 2, 3, 1],
      fingers: [null, null, null, 2, 3, 1],
      baseFret: 1
    },
    ukulele: {
      frets: [2, 2, 1, 0],
      fingers: [2, 3, 1, null],
      baseFret: 1
    }
  },
  'Dm7': {
    root: 'D',
    quality: 'm7',
    name: 'D 小七和弦 (Dm7)',
    description: '爵士 ii-V-I 進行第一把交椅，具優雅而內斂的流動性。',
    formula: '1 - b3 - 5 - b7',
    notes: ['D', 'F', 'A', 'C'],
    pianoKeys: [14, 17, 21, 24],
    pianoFingerings: ['1', '2', '3', '5'],
    guitar: {
      frets: ['x', 'x', 0, 2, 1, 1],
      fingers: [null, null, null, 2, 1, 1],
      baseFret: 1
    },
    ukulele: {
      frets: [2, 2, 1, 3],
      fingers: [2, 3, 1, 4],
      baseFret: 1
    }
  },

  // E Chords
  'E': {
    root: 'E',
    quality: 'Major',
    name: 'E 大三和弦',
    description: '震撼且具穿透力，搖滾吉他與開放低音最具張力的代表。',
    formula: '1 - 3 - 5',
    notes: ['E', 'G#', 'B'],
    pianoKeys: [16, 20, 23],
    pianoFingerings: ['1', '3', '5'],
    guitar: {
      frets: [0, 2, 2, 1, 0, 0],
      fingers: [null, 2, 3, 1, null, null],
      baseFret: 1
    },
    ukulele: {
      frets: [1, 4, 0, 2],
      fingers: [1, 4, null, 2],
      baseFret: 1
    }
  },
  'Em': {
    root: 'E',
    quality: 'Minor',
    name: 'E 小三和弦',
    description: '吉他最容易按的和弦之一，充滿空靈與感傷氛圍。',
    formula: '1 - b3 - 5',
    notes: ['E', 'G', 'B'],
    pianoKeys: [16, 19, 23],
    pianoFingerings: ['1', '2', '5'],
    guitar: {
      frets: [0, 2, 2, 0, 0, 0],
      fingers: [null, 2, 3, null, null, null],
      baseFret: 1
    },
    ukulele: {
      frets: [0, 4, 3, 2],
      fingers: [null, 3, 2, 1],
      baseFret: 1
    }
  },
  'Em7': {
    root: 'E',
    quality: 'm7',
    name: 'E 小七和弦 (Em7)',
    description: '4536 王道進行中的「3 級」，提供憂柔抒情的絕妙轉折。',
    formula: '1 - b3 - 5 - b7',
    notes: ['E', 'G', 'B', 'D'],
    pianoKeys: [16, 19, 23, 26],
    pianoFingerings: ['1', '2', '3', '5'],
    guitar: {
      frets: [0, 2, 0, 0, 0, 0],
      fingers: [null, 2, null, null, null, null],
      baseFret: 1
    },
    ukulele: {
      frets: [0, 2, 0, 2],
      fingers: [null, 1, null, 2],
      baseFret: 1
    }
  },

  // F Chords
  'F': {
    root: 'F',
    quality: 'Major',
    name: 'F 大三和弦',
    description: '吉他學習者必經的「大魔王」封閉和弦，具有宏大舒展的次屬感。',
    formula: '1 - 3 - 5',
    notes: ['F', 'A', 'C'],
    pianoKeys: [17, 21, 24],
    pianoFingerings: ['1', '3', '5'],
    guitar: {
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 1
    },
    ukulele: {
      frets: [2, 0, 1, 0],
      fingers: [2, null, 1, null],
      baseFret: 1
    }
  },
  'Fmaj7': {
    root: 'F',
    quality: 'maj7',
    name: 'F 大七和弦 (Fmaj7)',
    description: '4536251 王道進攻第一和弦！夢幻、漂浮、流行神曲的起手式。',
    formula: '1 - 3 - 5 - 7',
    notes: ['F', 'A', 'C', 'E'],
    pianoKeys: [17, 21, 24, 28],
    pianoFingerings: ['1', '2', '3', '5'],
    guitar: {
      frets: ['x', 'x', 3, 2, 1, 0],
      fingers: [null, null, 3, 2, 1, null],
      baseFret: 1
    },
    ukulele: {
      frets: [5, 5, 0, 0],
      fingers: [1, 2, null, null],
      baseFret: 1
    }
  },
  'Fm': {
    root: 'F',
    quality: 'Minor',
    name: 'F 小三和弦',
    description: '借用和弦（Borrowed Chord / iv 級），給流行副歌催淚的核彈效果。',
    formula: '1 - b3 - 5',
    notes: ['F', 'Ab', 'C'],
    pianoKeys: [17, 20, 24],
    pianoFingerings: ['1', '2', '5'],
    guitar: {
      frets: [1, 3, 3, 1, 1, 1],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 1
    },
    ukulele: {
      frets: [1, 0, 1, 3],
      fingers: [1, null, 2, 4],
      baseFret: 1
    }
  },

  // G Chords
  'G': {
    root: 'G',
    quality: 'Major',
    name: 'G 大三和弦',
    description: 'C 大調的屬和弦 (V 級)，提供強烈的回歸力量與穩定性。',
    formula: '1 - 3 - 5',
    notes: ['G', 'B', 'D'],
    pianoKeys: [19, 23, 26],
    pianoFingerings: ['1', '3', '5'],
    guitar: {
      frets: [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, null, null, null, 3],
      baseFret: 1
    },
    ukulele: {
      frets: [0, 2, 3, 2],
      fingers: [null, 1, 3, 2],
      baseFret: 1
    }
  },
  'G7': {
    root: 'G',
    quality: '7',
    name: 'G 屬七和弦 (G7)',
    description: '古典與流行最常見的「正格終止」，強烈吸引耳朵回到 C 和弦。',
    formula: '1 - 3 - 5 - b7',
    notes: ['G', 'B', 'D', 'F'],
    pianoKeys: [19, 23, 26, 29],
    pianoFingerings: ['1', '2', '3', '5'],
    guitar: {
      frets: [3, 2, 0, 0, 0, 1],
      fingers: [3, 2, null, null, null, 1],
      baseFret: 1
    },
    ukulele: {
      frets: [0, 2, 1, 2],
      fingers: [null, 2, 1, 3],
      baseFret: 1
    }
  },

  // A Chords
  'Am': {
    root: 'A',
    quality: 'Minor',
    name: 'A 小三和弦',
    description: 'C 大調的關係小調 (vi 級)，溫柔、深情、略帶傷感。',
    formula: '1 - b3 - 5',
    notes: ['A', 'C', 'E'],
    pianoKeys: [21, 24, 28],
    pianoFingerings: ['1', '2', '5'],
    guitar: {
      frets: ['x', 0, 2, 2, 1, 0],
      fingers: [null, null, 2, 3, 1, null],
      baseFret: 1
    },
    ukulele: {
      frets: [2, 0, 0, 0],
      fingers: [2, null, null, null],
      baseFret: 1
    }
  },
  'Am7': {
    root: 'A',
    quality: 'm7',
    name: 'A 小七和弦 (Am7)',
    description: '比 Am 更加通透清新的小調七和弦，手感輕鬆自然。',
    formula: '1 - b3 - 5 - b7',
    notes: ['A', 'C', 'E', 'G'],
    pianoKeys: [21, 24, 28, 31],
    pianoFingerings: ['1', '2', '3', '5'],
    guitar: {
      frets: ['x', 0, 2, 0, 1, 0],
      fingers: [null, null, 2, null, 1, null],
      baseFret: 1
    },
    ukulele: {
      frets: [0, 0, 0, 0],
      fingers: [null, null, null, null],
      baseFret: 1
    }
  },
  'A': {
    root: 'A',
    quality: 'Major',
    name: 'A 大三和弦',
    description: '明亮具有朝氣，吉他三根手指並排按壓的經典和聲。',
    formula: '1 - 3 - 5',
    notes: ['A', 'C#', 'E'],
    pianoKeys: [21, 25, 28],
    pianoFingerings: ['1', '3', '5'],
    guitar: {
      frets: ['x', 0, 2, 2, 2, 0],
      fingers: [null, null, 1, 2, 3, null],
      baseFret: 1
    },
    ukulele: {
      frets: [2, 1, 0, 0],
      fingers: [2, 1, null, null],
      baseFret: 1
    }
  },

  // B Chords
  'Bdim': {
    root: 'B',
    quality: 'dim',
    name: 'B 減三和弦',
    description: '具有強烈不安定感與收縮張力，引導向主音。',
    formula: '1 - b3 - b5',
    notes: ['B', 'D', 'F'],
    pianoKeys: [23, 26, 29],
    pianoFingerings: ['1', '2', '4'],
    guitar: {
      frets: ['x', 2, 3, 4, 3, 'x'],
      fingers: [null, 1, 2, 4, 3, null],
      baseFret: 2
    },
    ukulele: {
      frets: [1, 2, 1, 2],
      fingers: [1, 3, 2, 4],
      baseFret: 1
    }
  }
};
