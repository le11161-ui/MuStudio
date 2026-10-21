import React, { useState } from 'react';
import {
  X,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  Beaker,
  History,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import {
  APP_CHANGELOG,
  CURRENT_APP_VERSION,
  getStoredVersion,
  hasNewVersionAvailable,
  getLatestAvailableVersion,
  applyVersionUpdate,
  simulateNewVersionTrigger,
  clearSimulatedVersion,
} from '../utils/versionManager';

interface VersionUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  onVersionStateChanged?: () => void;
}

export const VersionUpdateModal: React.FC<VersionUpdateModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onVersionStateChanged,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [, setRefreshKey] = useState(0);

  if (!isOpen) return null;

  const storedVersion = getStoredVersion();
  const latestVersion = getLatestAvailableVersion();
  const hasUpdate = hasNewVersionAvailable();

  const handleApplyUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setUpdateSuccess(true);
      applyVersionUpdate();
      if (onVersionStateChanged) onVersionStateChanged();
    }, 600);
  };

  const handleSimulateUpdate = () => {
    simulateNewVersionTrigger('v2.6.0 (包含吉他六線指彈譜庫與和弦指法即時鏡像)');
    setRefreshKey((k) => k + 1);
    if (onVersionStateChanged) onVersionStateChanged();
  };

  const handleResetVersion = () => {
    clearSimulatedVersion();
    setRefreshKey((k) => k + 1);
    if (onVersionStateChanged) onVersionStateChanged();
  };

  const handleFeatureJump = (category: string) => {
    onClose();
    if (!onNavigateToTab) return;
    if (category.includes('排程') || category.includes('課程')) {
      onNavigateToTab('routine');
    } else if (category.includes('極致') || category.includes('目錄')) {
      onNavigateToTab('growth');
    } else if (category.includes('樂理') || category.includes('五度圈')) {
      onNavigateToTab('circle');
    } else if (category.includes('耳力') || category.includes('聽音')) {
      onNavigateToTab('ear');
    } else if (category.includes('特權') || category.includes('XP')) {
      onNavigateToTab('profile');
    } else {
      onNavigateToTab('growth');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              hasUpdate
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 animate-pulse'
                : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
            }`}>
              {hasUpdate ? <Sparkles className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  MuStudio 版本更新中心
                </h2>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  hasUpdate
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                    : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                }`}>
                  {hasUpdate ? '✨ 發現新版本等待套用' : '✅ 目前已是最新穩定版本'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                即時掌握系統功能迭代 · 一鍵更新快取 · 查閱各版本新增功能整理
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Update Action Bar */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono w-full sm:w-auto">
            <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 flex-1 sm:flex-initial">
              <span className="text-slate-500 block text-[10px]">當前安裝快取版本</span>
              <span className="text-slate-200 font-bold text-sm">{storedVersion}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />
            <div className="bg-slate-900 px-3 py-2 rounded-xl border border-amber-500/30 flex-1 sm:flex-initial">
              <span className="text-amber-500/80 block text-[10px]">雲端最新發布版本</span>
              <span className="text-amber-300 font-bold text-sm">{latestVersion}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {hasUpdate ? (
              <button
                onClick={handleApplyUpdate}
                disabled={isUpdating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                <span>{isUpdating ? '正在套用更新...' : '🔄 換成更新版本 (清除快取並套用)'}</span>
              </button>
            ) : (
              <button
                onClick={handleApplyUpdate}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                title="重新整理以確保快取為最新狀態"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>檢查並重新整理快取</span>
              </button>
            )}
          </div>
        </div>

        {updateSuccess && (
          <div className="px-6 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>已成功更新至最新版本！正在刷新應用程式...</span>
          </div>
        )}

        {/* Scrollable Changelog Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          {/* Version Cards */}
          {APP_CHANGELOG.map((item) => (
            <div
              key={item.version}
              className={`rounded-2xl border p-5 transition-all ${
                item.isLatest
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className={`text-base font-bold font-mono px-2.5 py-0.5 rounded-lg ${
                    item.isLatest
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.version}
                  </span>
                  <h3 className="font-bold text-white text-sm sm:text-base">{item.releaseTitle}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.releaseDate}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.isLatest
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Highlights Grid */}
              <div className="grid grid-cols-1 gap-3">
                {item.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">{hl.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200">{hl.title}</h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-800 text-amber-400 border border-amber-500/20">
                            {hl.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {hl.description}
                        </p>
                      </div>
                    </div>

                    {item.isLatest && onNavigateToTab && (
                      <button
                        onClick={() => handleFeatureJump(hl.category)}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0 self-end sm:self-auto cursor-pointer transition-colors"
                      >
                        <span>立即體驗</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Interactive Simulation / Testing Zone */}
          <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/40">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Beaker className="w-4 h-4 text-purple-400" />
                <span>更新推送與通知按鈕測試專區 (Simulation Tool)</span>
              </div>
              <span className="text-[10px] text-slate-500">測試頂部已更新換成更新版本按鈕之即時連動</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              點擊下方按鈕可模擬發布未來新版本（如 v2.6.0），觀察頂部導覽列按鈕如何即時亮起提示；若已更新完成亦可點擊「恢復最新版」恢復狀態。
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSimulateUpdate}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🧪 模擬推送新版本 (觸發頂部即時通知)</span>
              </button>
              <button
                onClick={handleResetVersion}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <span>恢復當前正常版本 (v2.5.0)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>更新即時監測運行中 · 支援一鍵無損切換</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
