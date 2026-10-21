import React, { useState } from 'react';
import { Download, Upload, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, X, Database } from 'lucide-react';
import { loadUserProfile, saveUserProfile } from '../utils/profileStorage';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExportData = () => {
    try {
      const backupData: Record<string, unknown> = {};
      const keysToBackup = [
        'mustudio_user_profile',
        'mustudio_daily_routine',
        'mustudio_repertoire_progress',
        'mustudio_practice_sessions',
        'mustudio_client_version_cache',
      ];

      keysToBackup.forEach((key) => {
        const val = localStorage.getItem(key);
        if (val) {
          try {
            backupData[key] = JSON.parse(val);
          } catch {
            backupData[key] = val;
          }
        }
      });

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `MuStudio_Music_Backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: '備份檔已成功產生並下載！練琴歷程、XP 與自訂課表皆已安全封裝。',
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: '匯出備份失敗，請確認瀏覽器支援檔案下載。',
      });
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Invalid JSON');
        }

        Object.entries(parsed).forEach(([k, v]) => {
          if (k.startsWith('mustudio_')) {
            localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
          }
        });

        setStatusMessage({
          type: 'success',
          text: '數據還原成功！系統將在 1 秒後自動重載以套用最新進度。',
        });

        setTimeout(() => {
          if (onDataRestored) onDataRestored();
          window.location.reload();
        }, 1200);
      } catch {
        setStatusMessage({
          type: 'error',
          text: '備份檔格式不符，請確認是否為由 MuStudio 匯出的 JSON 備份檔。',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleMasterData = () => {
    const profile = loadUserProfile();
    profile.totalXp += 1500;
    profile.level = Math.max(profile.level, 7);
    profile.practiceDaysStreak = Math.max(profile.practiceDaysStreak, 14);
    profile.totalPracticeMinutes += 180;
    saveUserProfile(profile);

    setStatusMessage({
      type: 'success',
      text: '已注入資深學員示範數據 (+1500 XP，連勝14天，解鎖大師音色與特權庫！)',
    });

    setTimeout(() => {
      if (onDataRestored) onDataRestored();
      window.location.reload();
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">個人練琴歷程與數據備份</h3>
              <p className="text-xs text-slate-400">JSON 離線檔備份 · 換電腦/手機輕鬆轉移 · 數據不流失</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>匯出備份檔案</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  將目前累積的 XP、等級、今日課表、技能解鎖與練琴日誌下載為 JSON 檔案。
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>立即下載備份檔</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>還原備份檔案</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  選取之前下載的 JSON 備份檔，一鍵還原所有累積的進度與自訂設定。
                </p>
              </div>
              <label className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>選取檔案還原</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Quick Bonus / Demo Seed */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-200 block text-xs">示範資深學員數據</span>
              <span className="text-[11px] text-slate-500">快速注入 1500 XP 與 14 天連勝，直接測試全特權體驗</span>
            </div>
            <button
              onClick={handleLoadSampleMasterData}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold shrink-0 cursor-pointer transition-colors"
            >
              一鍵體驗滿級特權
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>本地本機純前端儲存，無需上傳至伺服器</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
