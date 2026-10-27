import React from 'react';
import { 
  DeterministicMetrics, 
  PeriodRawData, 
  AccountRecord 
} from '../types/reporting';
import { formatCurrency, formatPercent } from '../calculations/engine';
import { RevenueTrendChart } from './RevenueTrendChart';
import { AccountBreakdownTable } from './AccountBreakdownTable';
import { 
  TrendingUp, 
  Target, 
  History, 
  DollarSign, 
  AlertCircle, 
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';

interface ExecutiveReportProps {
  metrics: DeterministicMetrics;
  currentPeriod: PeriodRawData;
  priorPeriod: PeriodRawData | null;
  isSimulatingMissingData: boolean;
  onSelectAccount?: (account: AccountRecord) => void;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({
  metrics,
  currentPeriod,
  priorPeriod,
  isSimulatingMissingData,
  onSelectAccount,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Illustrative Data Notice Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-stone-100 border border-stone-200 px-4 py-2.5 rounded-lg text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] bg-stone-200 px-2 py-0.5 rounded">
            Illustrative Data
          </span>
          <span className="text-slate-600">
            Fictional B2B revenue model for client evaluation. All figures computed deterministically.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Deterministic Audit Passed</span>
        </div>
      </div>

      {/* Incomplete Data Scenario Banner (when active) */}
      {isSimulatingMissingData && (
        <div className="bg-amber-50/90 border border-amber-300/80 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-900 text-sm">
              Simulated Test Scenario: Missing Previous-Period Baseline
            </div>
            <p className="text-amber-800 leading-relaxed">
              Prior-period financial records were intentionally excluded to test system resilience. 
              Notice that the reporting engine marks period-over-period comparisons as <strong>Unavailable</strong> and <strong>does not fabricate a 0% or estimated growth rate</strong>. 
              Current period revenue and account records remain verified and visible.
            </p>
          </div>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Current Period Revenue */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Current Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
            {formatCurrency(metrics.currentRevenue)}
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
            <span className="text-slate-400">Target:</span>
            <span className="font-mono tabular-nums font-medium text-slate-700">
              {formatCurrency(metrics.targetRevenue)}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              +{formatPercent(metrics.targetAchievementPercent - 100)}
            </span>
          </div>
        </div>

        {/* 2. Target Achievement */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Target Achievement</span>
            <Target className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
            {metrics.targetAchievementPercent}%
          </div>
          {/* Progress bar */}
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(metrics.targetAchievementPercent, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {metrics.targetVarianceCurrency >= 0 ? '+' : ''}{formatCurrency(metrics.targetVarianceCurrency)} ahead of quota
          </div>
        </div>

        {/* 3. Previous Period Revenue */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Previous Period Revenue</span>
            <History className="w-3.5 h-3.5 text-slate-400" />
          </div>
          {metrics.priorPeriodAvailable && metrics.priorRevenue !== null ? (
            <>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
                {formatCurrency(metrics.priorRevenue)}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                September 2026 baseline
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-semibold text-amber-800 font-mono tracking-tight pt-1">
                Unavailable
              </div>
              <div className="mt-2 text-[11px] text-amber-700 leading-tight">
                Benchmark omitted in test scenario
              </div>
            </>
          )}
        </div>

        {/* 4. Revenue Change (PoP) */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Period-over-Period Delta</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          </div>
          {metrics.priorPeriodAvailable && metrics.revenueChangeCurrency !== null ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
                  {formatCurrency(metrics.revenueChangeCurrency)}
                </span>
                <span className={`text-sm font-semibold font-mono ${metrics.revenueChangePercent && metrics.revenueChangePercent > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatPercent(metrics.revenueChangePercent)}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Deterministic delta calculation
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-semibold text-amber-800 font-mono tracking-tight pt-1">
                N/A (Omitted)
              </div>
              <div className="mt-2 text-[11px] text-amber-700 leading-tight">
                No fabricated percentage displayed
              </div>
            </>
          )}
        </div>

      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
        <div className="flex flex-col">
          <span className="text-slate-500 text-[11px]">Enterprise Share</span>
          <span className="font-mono font-bold text-slate-900 text-sm mt-0.5">
            {metrics.enterpriseSharePercent}%
          </span>
          <span className="text-[10px] text-slate-400">Top 5 enterprise accounts</span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-500 text-[11px]">Net Expansion ARR</span>
          <span className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
            +{formatCurrency(metrics.netExpansionARR)}
          </span>
          <span className="text-[10px] text-slate-400">From existing client accounts</span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-500 text-[11px]">New Business ARR</span>
          <span className="font-mono font-bold text-indigo-700 text-sm mt-0.5">
            +{formatCurrency(metrics.newBusinessARR)}
          </span>
          <span className="text-[10px] text-slate-400">1 new onboarding (Solis Energy)</span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-500 text-[11px]">Lost Churn ARR</span>
          <span className="font-mono font-bold text-rose-700 text-sm mt-0.5">
            -{formatCurrency(metrics.churnedARR)}
          </span>
          <span className="text-[10px] text-slate-400">Cobalt Cyber Defense (M&A)</span>
        </div>
      </div>

      {/* Interactive Trend Chart */}
      <RevenueTrendChart
        currentPeriod={currentPeriod}
        priorPeriod={priorPeriod}
        isSimulatingMissingData={isSimulatingMissingData}
        targetRevenue={metrics.targetRevenue}
      />

      {/* Account-Level Breakdown Data Grid */}
      <AccountBreakdownTable
        accounts={currentPeriod.accounts}
        isPriorAvailable={metrics.priorPeriodAvailable}
        onSelectAccount={onSelectAccount}
      />

    </div>
  );
};
