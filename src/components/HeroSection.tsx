import React from 'react';
import { ArrowRight, Sparkles, Sliders, Award, Layers, BookOpen } from 'lucide-react';
import heroStudioImg from '../assets/images/hero_music_studio_1792073384338.jpg';

interface HeroSectionProps {
  onSelectTab: (tab: string) => void;
  onOpenGuide?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTab, onOpenGuide }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Vision & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide">
              <span>目標導向學習</span>
              <span aria-hidden="true">·</span>
              <span>無死背考卷</span>
              <span aria-hidden="true">·</span>
              <span>4 大實戰樂器樹</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              音樂不再靠死記，<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                從聽覺、和弦到創作
              </span>
              的沉浸式實驗室
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              打破傳統「年級與版本」的繁複教材，依流行鋼琴、民謠吉他、爵士鼓與 DTM 數位編曲切換學習地圖。搭配互動和弦指法、智慧節拍器與採用「拋磚引玉」引導的 AI 個人音樂教練。
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => onSelectTab('skilltree')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>探索技能路線圖</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('songguide')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
              >
                <span>🔍 查曲目高效練法</span>
              </button>

              <button
                onClick={() => onSelectTab('routine')}
                className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-md shadow-amber-500/10"
              >
                <span>🗓️ 今日課程排程</span>
              </button>

              <button
                onClick={() => onSelectTab('profile')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>📝 自主記錄練習狀況</span>
              </button>

              {onOpenGuide && (
                <button
                  onClick={onOpenGuide}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-md shadow-amber-500/10"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>📖 功能整理表 & 使用指南</span>
                </button>
              )}

              <button
                onClick={() => onSelectTab('coach')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI 音樂教練</span>
              </button>
            </div>

            {/* Quick KPI Strip with tabular numbers */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">4 條</div>
                <div className="text-xs text-slate-400 mt-0.5">專業目標技能樹</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">即時合成器發聲</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono tabular-nums">啟發式</div>
                <div className="text-xs text-slate-400 mt-0.5">拋磚引玉引導機制</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Studio Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src={heroStudioImg}
                alt="MuStudio 音樂領航所實體工作室環境"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-slate-200 font-medium">沉浸式 Web Audio 聲學合成</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">44.1kHz Hi-Fi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
