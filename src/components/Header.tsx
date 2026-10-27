import React from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Code2,
  Calendar,
  Layers
} from 'lucide-react';
import { PeriodId } from '../types/reporting';

interface HeaderProps {
  selectedPeriod: PeriodId;
  onPeriodChange: (period: PeriodId) => void;
  isSimulatingMissingData: boolean;
  onToggleMissingData: () => void;
  onGenerateInsights: () => void;
  isGenerating: boolean;
  onResetDemo: () => void;
  onOpenPromptInspector: () => void;
  generationState: 'idle' | 'loading' | 'success';
}

export const Header: React.FC<HeaderProps> = ({
  selectedPeriod,
  onPeriodChange,
  isSimulatingMissingData,
  onToggleMissingData,
  onGenerateInsights,
  isGenerating,
  onResetDemo,
  onOpenPromptInspector,
  generationState
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#faf9f5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-4">
          
          {/* Brand & Context */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
                IL
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  InsightLayer
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  AI Reporting Preview
                </span>
              </div>
            </div>

            <div className="h-4 w-px bg-stone-300 hidden sm:block" />

            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="font-medium">Interactive Client Demo</span>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Period Selector */}
            <div className="flex items-center bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <label htmlFor="period-select" className="sr-only">Reporting Period</label>
              <select
                id="period-select"
                value={selectedPeriod}
                onChange={(e) => onPeriodChange(e.target.value as PeriodId)}
                className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer pr-1"
              >
                <option value="2026-10">October 2026 (Current)</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-08">August 2026</option>
              </select>
            </div>

            {/* Test Missing Data Toggle */}
            <button
              onClick={onToggleMissingData}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                isSimulatingMissingData
                  ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300'
                  : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-50'
              }`}
              title="Simulates a missing previous-period dataset to test missing-data integrity guardrails"
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${isSimulatingMissingData ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>{isSimulatingMissingData ? 'Missing Data: Active' : 'Test Missing Data'}</span>
            </button>

            {/* Claude API Pipeline Inspector */}
            <button
              onClick={onOpenPromptInspector}
              type="button"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
              title="Inspect Anthropic Claude prompt contract and data schema"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Inspect Prompt Contract</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onResetDemo}
              type="button"
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-stone-100 transition-colors"
              title="Reset to default scenario"
              aria-label="Reset to default scenario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Generate Insights Button */}
            <button
              onClick={onGenerateInsights}
              disabled={isGenerating}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap ${
                isGenerating
                  ? 'bg-indigo-400 text-white cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Insights...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Insights</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
