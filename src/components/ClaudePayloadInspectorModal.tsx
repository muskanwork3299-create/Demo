import React, { useState, useEffect } from 'react';
import { DeterministicMetrics, PeriodRawData } from '../types/reporting';
import { X, Copy, Check, Code2, ShieldAlert, Cpu } from 'lucide-react';

interface ClaudePayloadInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: DeterministicMetrics;
  currentPeriod: PeriodRawData;
  isSimulatingMissingData: boolean;
}

export const ClaudePayloadInspectorModal: React.FC<ClaudePayloadInspectorModalProps> = ({
  isOpen,
  onClose,
  metrics,
  currentPeriod,
  isSimulatingMissingData,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'payload' | 'schema'>('prompt');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const samplePrompt = `System:
You are an executive business analyst and reporting specialist for enterprise SaaS organizations.
You are given verified, deterministic financial figures calculated by the client's internal reporting engine.

CRITICAL INVARIANTS:
1. MATHEMATICAL INTEGRITY: You MUST NOT compute, estimate, fabricate, or modify any financial numbers or percentages.
2. CITATION MANDATE: Every finding MUST link to the exact source metric and calculation formula supplied.
3. CAUSATION DISTINCTION: Distinguish observed facts from interpretations and recommendations. NEVER imply that correlation proves causation.
4. INCOMPLETE DATA HANDLING: If a metric is marked NULL or "unavailable" (e.g. missing prior-period data), you MUST explicitly state that trend calculations are suspended rather than guessing.

User Request:
Analyze the supplied deterministic JSON metrics for period ${metrics.periodLabel} and generate structured business insights categorized into:
- Key Findings
- Period-over-Period Comparisons
- Exceptions Requiring Attention
- Potential Next Steps`;

  const structuredPayload = {
    period: metrics.periodId,
    label: metrics.periodLabel,
    deterministic_metrics: {
      current_revenue: metrics.currentRevenue,
      target_revenue: metrics.targetRevenue,
      target_achievement_pct: metrics.targetAchievementPercent,
      target_variance_currency: metrics.targetVarianceCurrency,
      prior_period_available: metrics.priorPeriodAvailable,
      prior_revenue: metrics.priorRevenue,
      revenue_change_currency: metrics.revenueChangeCurrency,
      revenue_change_percent: metrics.revenueChangePercent,
      missing_data_reason: metrics.missingDataReason || null,
      account_summary: {
        total_accounts: metrics.totalAccountsCount,
        enterprise_share_pct: metrics.enterpriseSharePercent,
        mid_market_share_pct: metrics.midMarketSharePercent,
        growth_share_pct: metrics.growthSharePercent,
        net_expansion_arr: metrics.netExpansionARR,
        new_business_arr: metrics.newBusinessARR,
        churned_arr: metrics.churnedARR
      }
    },
    raw_accounts_ledger: currentPeriod.accounts.map((a) => ({
      id: a.id,
      name: a.name,
      segment: a.segment,
      current: a.currentRevenue,
      prior: a.priorRevenue,
      status: a.status
    }))
  };

  const schemaExample = `interface ClaudeInsightResponse {
  findings: Array<{
    id: string;
    category: 'key_finding' | 'period_comparison' | 'exception_attention' | 'next_step';
    title: string;
    plainEnglishExplanation: string;
    observedFact: string;        // Strict factual statement from data
    interpretation: string;      // Business context & qualitative reading
    suggestedAction?: string;    // Recommended next step for leadership
    sourceMetrics: Array<{
      metricName: string;
      sourceValue: string | number;
      sourceTable: string;
      sourceField: string;
      isDeterministic: boolean;  // Must match engine output
    }>;
  }>;
}`;

  const copyToClipboard = () => {
    let textToCopy = '';
    if (activeTab === 'prompt') textToCopy = samplePrompt;
    else if (activeTab === 'payload') textToCopy = JSON.stringify(structuredPayload, null, 2);
    else textToCopy = schemaExample;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[88vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Anthropic Claude Prompt & Payload Contract
              </h3>
              <p className="text-xs text-slate-500">
                Client integration preview: how numbers remain immutable while AI synthesizes explanations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'prompt'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              System & User Prompt
            </button>
            <button
              onClick={() => setActiveTab('payload')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'payload'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live JSON Context Payload
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'schema'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Output Schema Interface
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs bg-slate-900 text-slate-100">
          {activeTab === 'prompt' && (
            <pre className="whitespace-pre-wrap leading-relaxed text-indigo-200">
              {samplePrompt}
            </pre>
          )}

          {activeTab === 'payload' && (
            <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300">
              {JSON.stringify(structuredPayload, null, 2)}
            </pre>
          )}

          {activeTab === 'schema' && (
            <pre className="whitespace-pre-wrap leading-relaxed text-sky-300">
              {schemaExample}
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span>
              In production, this payload is sent to <code className="font-mono text-slate-900 font-semibold">/api/insights/claude-pipeline</code> via server-side execution.
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
