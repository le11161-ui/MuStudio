import React, { useState } from 'react';
import {
  DailyRoutinePlan,
  RoutineStep,
  DEFAULT_PRESET_ROUTINES,
  loadDailyRoutinePlan,
  saveDailyRoutinePlan,
  buildPlanFromPreset,
} from '../utils/routineStorage';
import { audioEngine } from '../utils/audioEngine';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Edit3,
  RotateCcw,
  BookOpen,
  Volume2,
  Check,
  Flame,
  Music,
} from 'lucide-react';

interface DailyRoutinePlannerProps {
  onNavigateToTab: (tab: string) => void;
  onApplyPlanToLog?: (summary: { songName: string; minutes: number; notes: string }) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  warmup: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  chords: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  song: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  ear: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  rhythm: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  theory: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  review: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
};

const TOOL_OPTIONS: { route: string; label: string }[] = [
  { route: 'songguide', label: '曲目高效練法與琴鍵' },
  { route: 'toolbox', label: '和弦指法庫' },
  { route: 'circle', label: '五度圈轉調盤' },
  { route: 'ear', label: '聽音盲測中心' },
  { route: 'metronome', label: '智慧節拍器' },
  { route: 'score', label: '簡譜五線譜轉換器' },
  { route: 'skilltree', label: '4大樂器技能樹' },
  { route: 'coach', label: 'AI 音樂教練' },
  { route: 'profile', label: '今日練習日誌與程度' },
];

export const DailyRoutinePlanner: React.FC<DailyRoutinePlannerProps> = ({
  onNavigateToTab,
  onApplyPlanToLog,
}) => {
  const [plan, setPlan] = useState<DailyRoutinePlan>(() => loadDailyRoutinePlan());
  const [isAddingCustom, setIsAddingCustom] = useState<boolean>(false);
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  // New step form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newMinutes, setNewMinutes] = useState<number>(10);
  const [newCategory, setNewCategory] = useState<RoutineStep['category']>('song');
  const [newToolRoute, setNewToolRoute] = useState<string>('songguide');
  const [newNotes, setNewNotes] = useState<string>('');

  const showToast = (msg: string) => {
    setToastAlert(msg);
    setTimeout(() => setToastAlert(null), 3500);
  };

  const completedCount = plan.steps.filter((s) => s.completed).length;
  const progressPercent = plan.steps.length > 0 ? Math.round((completedCount / plan.steps.length) * 100) : 0;
  const totalMinutes = plan.steps.reduce((sum, s) => sum + (Number(s.targetMinutes) || 0), 0);

  const handleToggleComplete = (stepId: string) => {
    const updatedSteps = plan.steps.map((s) => {
      if (s.id === stepId) {
        const nextState = !s.completed;
        if (nextState) {
          // Play acoustic confirmation chord
          const rootFreq = audioEngine.noteToFreq('C4') || 261.63;
          audioEngine.playPianoNote(rootFreq, 0.8);
          audioEngine.playPianoNote(rootFreq * 1.25, 0.8, 0.08);
          audioEngine.playPianoNote(rootFreq * 1.5, 0.8, 0.16);
        }
        return { ...s, completed: nextState };
      }
      return s;
    });

    const updatedPlan: DailyRoutinePlan = {
      ...plan,
      steps: updatedSteps,
    };
    setPlan(updatedPlan);
    saveDailyRoutinePlan(updatedPlan);

    const targetStep = updatedSteps.find((s) => s.id === stepId);
    if (targetStep && targetStep.completed) {
      showToast(`🎉 已完成【${targetStep.title}】！離今日目標更進一步！`);
    }
  };

  const handleLoadPreset = (preset: typeof DEFAULT_PRESET_ROUTINES[0]) => {
    const newPlan = buildPlanFromPreset(preset);
    setPlan(newPlan);
    showToast(`📋 已成功套用【${preset.name}】課表！`);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= plan.steps.length) return;

    const newSteps = [...plan.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;

    // re-index order
    const ordered = newSteps.map((s, idx) => ({
      ...s,
      order: idx + 1,
      title: s.title.replace(/^Step \d+:\s*/, `Step ${idx + 1}: `),
    }));

    const updatedPlan = { ...plan, steps: ordered };
    setPlan(updatedPlan);
    saveDailyRoutinePlan(updatedPlan);
  };

  const handleDeleteStep = (stepId: string) => {
    const filtered = plan.steps
      .filter((s) => s.id !== stepId)
      .map((s, idx) => ({
        ...s,
        order: idx + 1,
        title: s.title.replace(/^Step \d+:\s*/, `Step ${idx + 1}: `),
      }));

    const updatedPlan = { ...plan, steps: filtered };
    setPlan(updatedPlan);
    saveDailyRoutinePlan(updatedPlan);
    showToast('已移除該步驟');
  };

  const handleAddCustomStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedTool = TOOL_OPTIONS.find((t) => t.route === newToolRoute);
    const categoryLabels: Record<string, string> = {
      warmup: '熱身暖手',
      chords: '和聲練習',
      song: '曲目實戰',
      ear: '耳力盲測',
      rhythm: '律動節奏',
      theory: '樂理進階',
      review: '打卡反思',
    };

    const nextOrder = plan.steps.length + 1;
    const cleanTitle = newTitle.startsWith('Step') ? newTitle : `Step ${nextOrder}: ${newTitle}`;

    const newStep: RoutineStep = {
      id: `step-${Date.now()}`,
      order: nextOrder,
      title: cleanTitle,
      targetMinutes: Number(newMinutes) || 10,
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || '個人任務',
      toolRoute: newToolRoute,
      toolLabel: selectedTool?.label || '對應工具',
      notes: newNotes.trim() || '依規劃步驟專注推進。',
      completed: false,
    };

    const updatedPlan: DailyRoutinePlan = {
      ...plan,
      steps: [...plan.steps, newStep],
    };
    setPlan(updatedPlan);
    saveDailyRoutinePlan(updatedPlan);

    // Reset form
    setNewTitle('');
    setNewMinutes(10);
    setNewNotes('');
    setIsAddingCustom(false);
    showToast(`✨ 已新增第 ${nextOrder} 步驟！`);
  };

  const handleResetPlanProgress = () => {
    const reset = plan.steps.map((s) => ({ ...s, completed: false }));
    const updated = { ...plan, steps: reset };
    setPlan(updated);
    saveDailyRoutinePlan(updated);
    showToast('已重設今日排程勾選進度');
  };

  const handleApplyToPracticeLog = () => {
    const songStep = plan.steps.find((s) => s.category === 'song');
    const songName = songStep ? songStep.title.replace(/^Step \d+:\s*/, '') : '今日排程綜合曲目';
    const notesSummary = `今日完成 ${completedCount}/${plan.steps.length} 項課程排程（${plan.routineName}）。包含：` +
      plan.steps.map((s) => `${s.completed ? '✅' : '⏳'} ${s.title}`).join('、');

    if (onApplyPlanToLog) {
      onApplyPlanToLog({
        songName,
        minutes: totalMinutes,
        notes: notesSummary,
      });
    }

    onNavigateToTab('profile');
  };

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-7 shadow-xl shadow-amber-500/5">
      {/* Toast Alert */}
      {toastAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastAlert}</span>
          </div>
          <button onClick={() => setToastAlert(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Calendar className="w-4 h-4" />
            <span>今日練琴任務排程 · 步驟規劃與行動引導</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>今日課程修煉排程規劃 (Practice Course Planner)</span>
            <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              總計 {totalMinutes} 分鐘
            </span>
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            告別「坐到琴前不知道練什麼」的盲目感！清楚規劃**第一步做什麼、第二步做什麼**，按部就班高效推進，並可一鍵跳轉到對應工具！
          </p>
        </div>

        {/* Progress & Quick Stats Card */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">今日完成進度</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono tabular-nums">
              {completedCount} / {plan.steps.length} 步
            </span>
          </div>

          <div className="w-px h-8 bg-slate-800" />

          <div>
            <span className="text-[10px] text-slate-400 block font-mono">完成達成率</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{progressPercent}%</span>
          </div>

          <button
            onClick={handleResetPlanProgress}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="重設今日勾選進度"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-300">
            當前課表：<strong className="text-white font-bold">{plan.routineName}</strong>
          </span>
          <span className="text-slate-400 font-mono">
            {completedCount === plan.steps.length && plan.steps.length > 0 ? (
              <span className="text-emerald-400 font-bold">🎉 今日課程已全部圓滿完成！</span>
            ) : (
              `還剩 ${plan.steps.length - completedCount} 個步驟待完成`
            )}
          </span>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4 PRESET ROUTINES QUICK SWITCH CARDS */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>快速套用經典練琴菜單（點擊即可載入排程）：</span>
          </span>
          <span className="text-[11px] text-slate-500">也可點擊下方「自訂步驟」彈性調整</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEFAULT_PRESET_ROUTINES.map((preset) => {
            const isCurrent = plan.routineName === preset.name;
            return (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white">{preset.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-slate-800/80">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/20 font-bold">
                    {preset.badge}
                  </span>
                  <span className={isCurrent ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {isCurrent ? '✓ 套用中' : '點擊載入 ➔'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* ACTIVE STEP CHECKLIST (先做什麼、在做什麼) */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>今日執行清單（由上而下循序漸進）</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
              共 {plan.steps.length} 個步驟
            </span>
          </h4>

          <button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingCustom ? '收起自訂表單' : '➕ 新增自訂步驟'}</span>
          </button>
        </div>

        {/* Add custom step form */}
        {isAddingCustom && (
          <form
            onSubmit={handleAddCustomStep}
            className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-amber-500/40 space-y-4 animate-fade-in text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <span>➕ 規劃自訂步驟 (Step {plan.steps.length + 1})</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-mono text-slate-400">步驟任務名稱 *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例如：主歌 4536 和弦盲彈換指練習、小星星重配試聽..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">預計練習時間 (分鐘)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={newMinutes}
                  onChange={(e) => setNewMinutes(Number(e.target.value) || 10)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">任務類別</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as RoutineStep['category'])}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="warmup">熱身暖手</option>
                  <option value="chords">和聲練習</option>
                  <option value="song">曲目實戰</option>
                  <option value="ear">耳力盲測</option>
                  <option value="rhythm">律動節奏</option>
                  <option value="theory">樂理進階</option>
                  <option value="review">打卡反思</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">一鍵跳轉對應工具</label>
                <select
                  value={newToolRoute}
                  onChange={(e) => setNewToolRoute(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {TOOL_OPTIONS.map((t) => (
                    <option key={t.route} value={t.route}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">操作要領筆記（可選）</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="例如：先降速至 60 BPM，手指放鬆，無雜音再提速..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer shadow-md shadow-amber-500/20"
              >
                加入排程
              </button>
            </div>
          </form>
        )}

        {/* Steps List */}
        <div className="space-y-2.5">
          {plan.steps.map((step, idx) => {
            const catBadge = CATEGORY_COLORS[step.category] || 'text-slate-300 bg-slate-800 border-slate-700';

            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  step.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30 shadow-sm opacity-90'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left: Checkbox + Title + Badges */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggleComplete(step.id)}
                    className="mt-0.5 text-amber-400 hover:text-amber-300 cursor-pointer shrink-0"
                    title={step.completed ? '標記為未完成' : '標記為已完成'}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-amber-400" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold transition-all ${
                          step.completed ? 'line-through text-slate-400 font-normal' : 'text-white'
                        }`}
                      >
                        {step.title}
                      </span>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${catBadge}`}>
                        {step.categoryLabel}
                      </span>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        ⏱️ {step.targetMinutes} 分鐘
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{step.notes}</p>
                  </div>
                </div>

                {/* Right: Quick Launch & Reorder Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Jump button */}
                  <button
                    onClick={() => onNavigateToTab(step.toolRoute)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    title={`立即前往「${step.toolLabel}」執行此步驟`}
                  >
                    <span>🚀 {step.toolLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {/* Reorder Up */}
                  <button
                    onClick={() => handleMoveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="向上移動步驟"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Reorder Down */}
                  <button
                    onClick={() => handleMoveStep(idx, 'down')}
                    disabled={idx === plan.steps.length - 1}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="向下移動步驟"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer transition-colors"
                    title="刪除此步驟"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Banner & Sync to Log */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            練習完畢後，點擊右側按鈕可將今日排程總時間（{totalMinutes} 分鐘）與攻克心得一鍵存入練琴日誌！
          </span>
        </div>

        <button
          onClick={handleApplyToPracticeLog}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 shrink-0"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>將今日排程成果帶入日誌 (+XP)</span>
        </button>
      </div>
    </div>
  );
};
