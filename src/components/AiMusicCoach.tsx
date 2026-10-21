import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Upload,
  Camera,
  Mic,
  Square,
  Image as ImageIcon,
  Bot,
  User,
  Lightbulb,
  Music,
  ArrowRight,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { CoachMessage } from '../types/music';

interface AiMusicCoachProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiMusicCoach: React.FC<AiMusicCoachProps> = ({
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: `你好！我是你的專屬 AI 音樂教練 🎵\n\n我的指導哲學是「拋磚引玉」——我不會直接幫你把整首歌寫完或直接給死板的答案，而是透過啟發性的提問、音樂色彩實驗與節奏拆解，陪你親手鍛造屬於你自己的音樂直覺！\n\n你可以直接打字發問、上傳樂譜照片，或錄下你哼唱/彈奏的聲音。今天有什麼想一起探索的嗎？`,
      timestamp: '剛剛',
      socraticSuggestions: [
        '寫歌卡在副歌，想找旋律情緒靈感',
        '為什麼 4536251 被稱為華語王道進行？',
        '附點音符跟切分音總是搶拍，該怎麼練？',
        '鋼琴左右手合奏時，左手一動右手就斷掉'
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageMime, setSelectedImageMime] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Audio Recording in Browser
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle passed initial prompt from Skill tree or Chords
  useEffect(() => {
    if (initialPrompt) {
      setInputMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Image Upload Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageMime(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Microphone Recording Handler
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone permission not granted:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Send Message to Server-side Gemini API
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputMessage;
    if ((!prompt.trim() && !selectedImage && !audioBlobUrl) || isLoading) return;

    const userMsg: CoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: '剛剛',
      imagePreview: selectedImage || undefined,
      audioPreview: audioBlobUrl || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    const currentImg = selectedImage;
    const currentMime = selectedImageMime;
    setSelectedImage(null);
    setAudioBlobUrl(null);
    setIsLoading(true);

    try {
      // Strip data url prefix for API payload if image exists
      let base64Clean = undefined;
      if (currentImg) {
        base64Clean = currentImg.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      }

      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          imageBase64: base64Clean,
          imageMimeType: currentMime,
        }),
      });

      if (!response.ok) {
        throw new Error('Coach API response error');
      }

      const data = await response.json();
      const coachMsg: CoachMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: data.answer || '音樂的靈感正如溪流般源源不絕。我們繼續前進！',
        timestamp: '剛剛',
        socraticSuggestions: data.socraticSuggestions || [
          '換一個小調和弦聽聽看',
          '把速度放慢到 60 BPM',
          '數數看附點音符時值'
        ],
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: CoachMessage = {
        id: `coach-fallback-${Date.now()}`,
        sender: 'coach',
        text: `我非常欣賞你對這段音樂的思考！\n\n「試著感受這段樂句的心跳——如果是在第 4 拍後半拍切分進來，你覺得會帶來更多熱情還是懸疑呢？」\n我們可以試著打開智慧節拍器，一起跟著打拍子感受！`,
        timestamp: '剛剛',
        socraticSuggestions: ['感受切分音帶來的動態', '切換到智慧節拍器練習', '探索更多王道和弦進行'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">AI 個人音樂教練</h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              拋磚引玉引導機制
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            不代筆、不死記。啟發你對旋律情緒、和弦張力與節奏時值的直覺。
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'coach',
                text: '對話已重置！隨時拍照樂譜、哼唱一段旋律，或提出任何寫歌困惑，我們隨時開始！',
                timestamp: '剛剛',
                socraticSuggestions: [
                  '我想寫夏天熱血的歌，副歌該怎麼開始？',
                  'F 封閉和弦手指一直悶音按不緊',
                  '如何用切分音讓爵士鼓律動更有靈魂？'
                ],
              },
            ]);
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>開啟新對話</span>
        </button>
      </div>

      {/* Main Chat Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[650px] overflow-hidden shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 border border-amber-500/30 text-amber-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble Container */}
                <div className={`space-y-3 max-w-[85%] sm:max-w-[75%]`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {/* Attached Image Preview if any */}
                    {msg.imagePreview && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-slate-700 max-h-56">
                        <img
                          src={msg.imagePreview}
                          alt="上傳的樂譜或練習照片"
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}

                    {/* Attached Audio Preview if any */}
                    {msg.audioPreview && (
                      <div className="mb-3 p-2 bg-slate-900 rounded-lg flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-amber-400" />
                        <audio controls src={msg.audioPreview} className="w-full h-8" />
                      </div>
                    )}

                    <div>{msg.text}</div>
                  </div>

                  {/* Socratic Guidance Suggestion Buttons (拋磚引玉探索選項) */}
                  {!isUser && msg.socraticSuggestions && msg.socraticSuggestions.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>拋磚引玉下一步探索：</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.socraticSuggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="text-xs px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 rounded-lg transition-colors text-left flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <span>{sug}</span>
                            <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3.5 flex-row">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-400 rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>教練正在聆聽樂思，思考如何為你拋磚引玉...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Attachment Preview */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3">
          {/* Previews before sending */}
          {(selectedImage || audioBlobUrl) && (
            <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-xl border border-slate-800">
              {selectedImage && (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-700">
                  <img
                    src={selectedImage}
                    alt="樂譜預覽"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-0 right-0 bg-slate-950/80 text-white text-[10px] p-0.5"
                  >
                    ✕
                  </button>
                </div>
              )}

              {audioBlobUrl && (
                <div className="flex items-center gap-2 flex-1">
                  <audio controls src={audioBlobUrl} className="h-8 flex-1" />
                  <button
                    onClick={() => setAudioBlobUrl(null)}
                    className="text-xs text-rose-400 px-2 py-1"
                  >
                    刪除
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form Controls */}
          <div className="flex items-end gap-2">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Photo / Sheet Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="拍照或上傳樂譜照片"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Voice Recorder Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 border-rose-400 text-white animate-pulse'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isRecording ? '點擊結束錄音' : '錄製哼唱或演奏聲音'}
            >
              {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input Area */}
            <div className="flex-1 relative">
              <textarea
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isRecording
                    ? '正在錄音中... 唱完後點擊停止'
                    : '輸入寫歌問題、樂理疑惑或練習卡關處 (Enter 發送)'
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none max-h-24"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!inputMessage.trim() && !selectedImage && !audioBlobUrl)}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
