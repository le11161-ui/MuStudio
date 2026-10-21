/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { GrowthStudioHub, GrowthSubTab } from './components/GrowthStudioHub';
import { UnifiedToolbox, ToolType } from './components/UnifiedToolbox';
import { AllFeaturesGuideModal } from './components/AllFeaturesGuideModal';
import { VersionUpdateModal } from './components/VersionUpdateModal';
import { AmbientSoundPlayer } from './components/AmbientSoundPlayer';
import { DataBackupModal } from './components/DataBackupModal';
import { loadUserProfile, saveUserProfile } from './utils/profileStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('growth');
  const [growthSubTab, setGrowthSubTab] = useState<GrowthSubTab>('log');
  const [toolsSubTab, setToolsSubTab] = useState<ToolType>('chord');
  const [coachPrompt, setCoachPrompt] = useState<string>('');
  const [targetSongForGuide, setTargetSongForGuide] = useState<string>('晴天');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);
  const [isAmbientModalOpen, setIsAmbientModalOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);

  const handleNavigateToTab = (tab: string) => {
    if (tab === 'manual' || tab === 'guide') {
      setIsGuideOpen(true);
      return;
    }
    if (tab === 'version' || tab === 'update') {
      setIsVersionModalOpen(true);
      return;
    }
    if (tab === 'ambient' || tab === 'soundscape') {
      setIsAmbientModalOpen(true);
      return;
    }
    if (tab === 'backup' || tab === 'data') {
      setIsBackupModalOpen(true);
      return;
    }

    // Hub 1: 個人練習與技能成長 (Growth & Skills)
    if (tab === 'routine' || tab === 'plan' || tab === 'schedule') {
      setActiveTab('growth');
      setGrowthSubTab('routine');
    } else if (tab === 'growth' || tab === 'practice' || tab === 'profile' || tab === 'log') {
      setActiveTab('growth');
      setGrowthSubTab('log');
    } else if (tab === 'songguide') {
      setActiveTab('growth');
      setGrowthSubTab('songguide');
    } else if (tab === 'skilltree' || tab === 'skills' || tab === 'map') {
      setActiveTab('growth');
      setGrowthSubTab('map');
    } else if (tab === 'synergy') {
      setActiveTab('growth');
      setGrowthSubTab('synergy');
    }

    // Hub 2: 實戰工具箱與 AI 教練 (Tools & Coach)
    else if (tab === 'tools' || tab === 'toolbox' || tab === 'chord') {
      setActiveTab('tools');
      setToolsSubTab('chord');
    } else if (tab === 'circle') {
      setActiveTab('tools');
      setToolsSubTab('circle');
    } else if (tab === 'tuner' || tab === 'tune') {
      setActiveTab('tools');
      setToolsSubTab('tuner');
    } else if (tab === 'ear') {
      setActiveTab('tools');
      setToolsSubTab('ear');
    } else if (tab === 'metronome') {
      setActiveTab('tools');
      setToolsSubTab('metronome');
    } else if (tab === 'score' || tab === 'stave') {
      setActiveTab('tools');
      setToolsSubTab('score');
    } else if (tab === 'quiz') {
      setActiveTab('tools');
      setToolsSubTab('quiz');
    } else if (tab === 'coach') {
      setActiveTab('tools');
      setToolsSubTab('coach');
    } else {
      setActiveTab(tab);
    }
  };

  const handleAskCoachAboutSkill = (skillTitle: string, question: string) => {
    setCoachPrompt(question);
    setActiveTab('tools');
    setToolsSubTab('coach');
  };

  const handleAskCoachAboutChord = (chordName: string) => {
    setCoachPrompt(
      `老師好，我在和弦庫看見了「${chordName}」，請問在流行歌創作中，它最常用在什麼情緒的段落？有什麼推薦的和弦進行搭配嗎？`
    );
    setActiveTab('tools');
    setToolsSubTab('coach');
  };

  const handleAskCoachWithPrompt = (prompt: string) => {
    setCoachPrompt(prompt);
    setActiveTab('tools');
    setToolsSubTab('coach');
  };

  const handleInspectSong = (songName: string) => {
    setTargetSongForGuide(songName);
    setActiveTab('growth');
    setGrowthSubTab('songguide');
  };

  const handleSetTodayGoal = (goal: string) => {
    const profile = loadUserProfile();
    profile.primaryGoal = goal;
    saveUserProfile(profile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* 3-Zone Top Bar with Version Button, Ambient Sound, Level Badge, Guide Button & 2 Consolidated Master Hubs */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigateToTab}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenVersionModal={() => setIsVersionModalOpen(true)}
        onOpenAmbientModal={() => setIsAmbientModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Hero Visual Banner with Quick Guide Button */}
      <HeroSection
        onSelectTab={handleNavigateToTab}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Workspace Stage: Consolidated into 2 Master Hubs */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hub 1: 個人練習與技能成長 (練習日誌 · 程度管理 · 今日課程排程 · 曲目高效練法與琴鍵試聽 · 4大樂器技能樹 · 搭配弱項) */}
        {(activeTab === 'growth' ||
          activeTab === 'practice' ||
          activeTab === 'profile' ||
          activeTab === 'songguide' ||
          activeTab === 'skills' ||
          activeTab === 'skilltree' ||
          activeTab === 'synergy') && (
          <GrowthStudioHub
            key={`${growthSubTab}-${targetSongForGuide}`}
            initialSubTab={growthSubTab}
            initialSongName={targetSongForGuide}
            onNavigateToTab={handleNavigateToTab}
            onAskCoachWithPrompt={handleAskCoachWithPrompt}
            onAskCoachAboutSkill={handleAskCoachAboutSkill}
            onSetTodayGoal={handleSetTodayGoal}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {/* Hub 2: 實戰工具箱與 AI 教練 (和弦庫 · 五度圈 · 聽音盲測 · 智慧節拍器 · 簡譜轉換器 · 實戰測驗卷 · AI 個人教練) */}
        {(activeTab === 'tools' ||
          activeTab === 'toolbox' ||
          activeTab === 'circle' ||
          activeTab === 'ear' ||
          activeTab === 'metronome' ||
          activeTab === 'stave' ||
          activeTab === 'score' ||
          activeTab === 'quiz' ||
          activeTab === 'coach') && (
          <UnifiedToolbox
            key={`${toolsSubTab}-${coachPrompt}`}
            initialTool={toolsSubTab}
            coachPrompt={coachPrompt}
            onClearCoachPrompt={() => setCoachPrompt('')}
            onAskCoachAboutChord={handleAskCoachAboutChord}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}
      </main>

      {/* All Features Catalog & How To Use Guide Modal */}
      <AllFeaturesGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onNavigateToTab={handleNavigateToTab}
      />

      {/* Live Version Update Modal (The explicit user feature request) */}
      <VersionUpdateModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        onNavigateToTab={handleNavigateToTab}
      />

      {/* Lo-Fi Ambient Sound Player */}
      <AmbientSoundPlayer
        isOpen={isAmbientModalOpen}
        onClose={() => setIsAmbientModalOpen(false)}
      />

      {/* Data Backup & Restore Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      {/* Subtle Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-bold tracking-tight">MuStudio 音樂領航所</span>
            <span aria-hidden="true">·</span>
            <span>目標導向樂理與實戰實驗室</span>
          </div>
          <div className="flex items-center gap-6">
            <span>鋼琴 · 吉他/烏克麗麗 · 爵士鼓 · DTM 編曲</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Web Audio Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
