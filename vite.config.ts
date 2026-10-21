import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function aiCoachPlugin(): Plugin {
  return {
    name: 'ai-coach-server-plugin',
    configureServer(server) {
      // 1. AI Coach Chat & Socratic guidance endpoint
      server.middlewares.use('/api/coach', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const { message, imageBase64, imageMimeType } = parsed;

            const apiKey = process.env.GEMINI_API_KEY;

            if (apiKey) {
              const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const systemInstruction = `你是「MuStudio 音樂領航所」的 AI 個人音樂教練。
你的教學核心是「拋磚引玉機制（Socratic Music Coaching）」：
1. 寫歌沒靈感時：絕對不要直接幫學生寫出整首完整的詞曲！而是用啟發性的二選一或情境問題引導，例如：
   「你這首歌想表達的是『失戀的難過』還是『夏天的熱血』？如果是熱血，我們試試看把速度加快到 120 BPM，第一個和弦你覺得用明亮的 C 還是憂鬱的 Am 呢？」
2. 樂理卡關時：不要直接報答案，引導學生親自觀察與數數：
   「你聽聽看，從 C 到 G 上升了幾個階梯？我們一起數數看（C-D-E-F-G）...沒錯，是 5 個階梯！這就是純五度！」
3. 彈奏抓不到拍子或上傳樂譜時：引導學生拆解小節與音符時值：
   「我們看看你上傳的這段譜，第三小節的附點四分音符，它佔了幾拍呢？試試看把一拍切成兩個半拍，在心中數 1-and-2-and。」
4. 每次回答請簡明生動、親切鼓勵，並在最後提供 2~3 個供學生點擊的「拋磚引玉下一步探索選項」。

請嚴格以 JSON 格式回應，格式如下：
{
  "answer": "你親切富有啟發性的引導回答內容",
  "socraticSuggestions": ["探索選項1", "探索選項2", "探索選項3"]
}`;

              const parts: any[] = [];
              if (imageBase64) {
                parts.push({
                  inlineData: {
                    mimeType: imageMimeType || 'image/jpeg',
                    data: imageBase64,
                  },
                });
              }
              parts.push({
                text: `學生發問或演奏/樂譜問題：${message || '老師，請給我一些練習指引'}`,
              });

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: { parts },
                config: {
                  systemInstruction,
                  responseMimeType: 'application/json',
                  temperature: 0.7,
                },
              });

              const text = response.text || '{}';
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(text);
              return;
            }

            // Fallback Socratic guidance if API key is not present
            const msgLower = (message || '').toLowerCase();
            let fallbackAnswer = '';
            let fallbackSuggestions = ['試試看把速度放慢 20 BPM', '換成 Am 和弦試試看', '一起數數拍子 1 and 2 and'];

            if (msgLower.includes('靈感') || msgLower.includes('寫歌') || msgLower.includes('作曲')) {
              fallbackAnswer = `寫歌遇到瓶頸是很棒的訊號，代表大腦正在準備孕育突破！\n\n請問這首歌你現在心中浮現的畫面，是「深夜下雨獨自一人的沉靜」，還是「晴天海邊微風的放鬆」？\n如果偏向安靜內省，我們可以嘗試用 Am 或 Dm 起手；如果是放鬆浪漫，試試看 Fmaj7 飄飄的感覺。你更想嘗試哪一種？`;
              fallbackSuggestions = ['深夜沉靜，試試 Am 起手', '放鬆浪漫，試試 Fmaj7 飄逸感', '我想加快節奏寫熱血搖滾'];
            } else if (msgLower.includes('拍') || msgLower.includes('節奏') || msgLower.includes('合不起來')) {
              fallbackAnswer = `雙手合不起來或是節拍不穩，是每位音樂人都經歷過的大魔王關卡！\n\n別著急，我們試試看「分部降速法」：\n第一步：先暫停左手，只開節拍器 60 BPM，右手跟著打拍子，數得出「1 and 2 and」嗎？\n第二步：換左手單獨走低音。你現在是卡在哪一個小節的換和弦呢？`;
              fallbackSuggestions = ['卡在第 3 拍的附點音符', '右手可以，加左手就亂掉', '如何用節拍器練慢速？'];
            } else if (imageBase64) {
              fallbackAnswer = `我看見你上傳的這張樂譜或彈奏截圖了！\n\n請注意看高音譜表上的調號與第二小節的和弦標記：\n「你注意到這個和弦標示了嗎？從根音算起，它的三音是升號還是還原呢？」試著先在鍵盤或吉他上單按它的根音，我們一步步把它拼起來！`;
              fallbackSuggestions = ['找出這個和弦的組成音', '這個小節的切分音怎麼數？', '用 C 大調來彈這首曲子'];
            } else {
              fallbackAnswer = `很高興能陪伴你的音樂練習旅程！音樂最迷人的地方在於沒有絕對唯一的標準答案。\n\n針對你剛才提到的想法，我們一起來做個有趣的聽覺實驗：如果現在把這段旋律的最後一個音往上跳進一個三度，你覺得情緒是變明亮了，還是變急促了呢？`;
              fallbackSuggestions = ['聽聽看三度跳進的效果', '我想了解 4536 流行和弦', '測驗我的聽力音感'];
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                answer: fallbackAnswer,
                socraticSuggestions: fallbackSuggestions,
              })
            );
          } catch (err: any) {
            console.error('AI Coach Server Error:', err);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                answer: `教練剛才在聆聽你的音符！讓我們繼續：音樂創作與練習時，試試看先把複雜的樂句拆成兩個簡單小節，你覺得目前最需要突破的是「手指靈活度」還是「和弦進行靈感」呢？`,
                socraticSuggestions: ['和弦進行卡關', '右手旋律抓不到拍點', '我想做聽力挑戰'],
              })
            );
          }
        });
      });

      // 2. Song Practice Guide / Efficiency Steps Generator
      server.middlewares.use('/api/song-guide', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const { songName, instrument, level } = parsed;
            const querySong = (songName || '晴天').trim();
            const inst = instrument || '流行鋼琴';
            const userLvl = level || '有基礎';

            const apiKey = process.env.GEMINI_API_KEY;

            if (apiKey) {
              const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const systemInstruction = `你是「MuStudio 音樂領航所」的權威曲目練習戰略家與音樂教練。
你的任務是針對學生想要練習的任何一首曲子（無論是流行歌、古典樂、日漫配樂或西洋老歌），規劃出【最高效率的 4 階段練習步驟與避坑指南】。
學生指定的樂器是「${inst}」，目前程度是「${userLvl}」。

請嚴格輸出符合以下 JSON 格式的回應：
{
  "songName": "曲目名稱",
  "artist": "歌手或作曲家",
  "instrument": "${inst}",
  "key": "曲目的原曲調性 (例如 G 大調 / Am 小調)",
  "bpm": 80,
  "timeSignature": "4/4",
  "chords": ["和弦1", "和弦2", "和弦3", "和弦4"],
  "overview": "這首歌的風格特色與核心結構亮點（1-2句話）",
  "stages": [
    {
      "phase": "第 1 階段",
      "phaseTitle": "骨架定錨：單旋律/根音與節奏慢速分拆",
      "timeAllocation": "前 20% 練習時間",
      "focus": "此階段核心目標",
      "steps": ["步驟1", "步驟2", "步驟3"],
      "suggestedSpeed": "建議練習速度 BPM"
    },
    {
      "phase": "第 2 階段",
      "phaseTitle": "瓶頸突破：大魔王小節高頻循環專攻",
      "timeAllocation": "中 40% 練習時間",
      "focus": "此階段核心目標",
      "steps": ["步驟1", "步驟2", "步驟3"],
      "suggestedSpeed": "建議練習速度 BPM"
    },
    {
      "phase": "第 3 階段",
      "phaseTitle": "聲部合體：垂直咬合與強弱動態層次",
      "timeAllocation": "後 25% 練習時間",
      "focus": "此階段核心目標",
      "steps": ["步驟1", "步驟2", "步驟3"],
      "suggestedSpeed": "建議練習速度 BPM"
    },
    {
      "phase": "第 4 階段",
      "phaseTitle": "原速演繹與情感留白",
      "timeAllocation": "最後 15% 練習時間",
      "focus": "此階段核心目標",
      "steps": ["步驟1", "步驟2"],
      "suggestedSpeed": "原速 BPM"
    }
  ],
  "bottlenecks": [
    {
      "spot": "最容易卡關的小節或和弦轉換",
      "issue": "學生常犯的致命盲點",
      "solution": "具體突破解方"
    },
    {
      "spot": "第二個常見弱點",
      "issue": "盲點說明",
      "solution": "具體突破解方"
    }
  ],
  "coachSecretTip": "教練私房一句話最高效練習心法"
}`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: `請為曲目《${querySong}》量身定制最有效率的練習步驟與避坑指南。`,
                config: {
                  systemInstruction,
                  responseMimeType: 'application/json',
                  temperature: 0.5,
                },
              });

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(response.text || '{}');
              return;
            }

            // Fallback generated strategy if API key is not active
            const fallbackResult = {
              songName: querySong,
              artist: '音樂經典作品',
              instrument: inst,
              key: 'C 大調 / Am 小調',
              bpm: 78,
              timeSignature: '4/4',
              chords: ['C', 'G', 'Am', 'F'],
              overview: `《${querySong}》具有極具感染力的旋律線條，在${inst}上演奏時，重心在於「主歌流暢敘事」與「副歌情緒爆發」的對比。`,
              stages: [
                {
                  phase: '第 1 階段',
                  phaseTitle: '骨架定錨：右手單旋律與左手低音分部練習',
                  timeAllocation: '前 20% 練習時間',
                  focus: '建立乾淨的音高幾何與指法記憶，切忌一開始就雙手合奏。',
                  steps: [
                    '將節拍器調至 55 BPM（降速 65%），單獨練熟主歌第一段。',
                    '左手只彈單音根音，確保每一小節第 1 拍正拍垂直咬合。',
                    '標註段落中的共同音，讓手掌在最省力的狀態下移位。'
                  ],
                  suggestedSpeed: '55 BPM'
                },
                {
                  phase: '第 2 階段',
                  phaseTitle: '瓶頸突破：大魔王小節高頻循環專攻',
                  timeAllocation: '中 40% 練習時間',
                  focus: '找出這首歌最容易卡頓的 2~4 個小節，單獨循環 20 遍。',
                  steps: [
                    '將換和弦卡頓的段落抽離出來，只在兩小節之間反覆來回。',
                    '前一小節第 4 拍後半拍手指提前放鬆，眼睛看向下一個位置。',
                    '利用「變速練習法」：一次慢速、一次常速，打破肌肉僵硬慣性。'
                  ],
                  suggestedSpeed: '65 BPM'
                },
                {
                  phase: '第 3 階段',
                  phaseTitle: '聲部合體：垂直對位與音量平衡',
                  timeAllocation: '後 25% 練習時間',
                  focus: '主旋律音量突出 70%，伴奏聲部退居 30%。',
                  steps: [
                    '伴奏加入抒情分解音型，踏板在每小節落鍵瞬間換踩。',
                    '閉眼盲彈伴奏，嘴巴哼唱旋律，確保大腦不必同時監控兩隻手。'
                  ],
                  suggestedSpeed: '72 BPM'
                },
                {
                  phase: '第 4 階段',
                  phaseTitle: '原速演繹與情感呼吸',
                  timeAllocation: '最後 15% 練習時間',
                  focus: '恢復原速，融入樂句呼吸與強弱起伏。',
                  steps: [
                    '恢復原速 78 BPM 完整彈奏全曲。',
                    '在樂句結尾給予極其自然的呼吸微停頓。'
                  ],
                  suggestedSpeed: '78 BPM (原速)'
                }
              ],
              bottlenecks: [
                {
                  spot: '換和弦時容易提前停頓半拍',
                  issue: '手掌完全離開琴鍵去摸下一個和弦，造成節奏中斷。',
                  solution: '找出共同音當作錨點，哪怕慢半拍也不許拖拍，左手優先落下！'
                },
                {
                  spot: '雙手合奏時右手被左手節奏拖走',
                  issue: '四肢獨立性尚未完全脫鉤。',
                  solution: '先以 50 BPM 極慢速度像慢動作鏡頭一樣觀察雙手音符垂直交會點。'
                }
              ],
              coachSecretTip: `練好《${querySong}》的關鍵是「不要從頭到尾一遍一遍刷」，而是把 80% 的精力集中在那 20% 最難的轉折小節！`
            };

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(fallbackResult));
          } catch (err: any) {
            console.error('Song Guide API Error:', err);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to generate song guide' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aiCoachPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
