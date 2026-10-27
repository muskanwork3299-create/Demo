import React, { useEffect } from 'react';
import { FindingItem } from '../types/reporting';
import { 
  X, 
  Database, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Compass,
  FileCode,
  Info
} from 'lucide-react';

interface EvidencePanelProps {
  finding: FindingItem | null;
  onClose: () => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  finding,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!finding) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-panel-title"
      >
        {/* Panel Header */}
        <div className="p-5 border-b border-stone-200 sticky top-0 bg-white/95 backdrop-blur-md z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Evidence & Calculation Audit
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ID: {finding.id}
              </span>
            </div>
            <h2 id="evidence-panel-title" className="text-base font-bold text-slate-900 leading-snug">
              {finding.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close evidence panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Content: 4 Distinct Tiers */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Integrity Guarantee Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950">
              <div className="font-semibold text-emerald-900">
                100% Deterministic Guarantee
              </div>
              <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                The figures below were extracted directly from the system ledger. Anthropic Claude was supplied read-only values to write the narrative explanation without executing math.
              </p>
            </div>
          </div>

          {/* TIER 1: Verified Source Figures */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center text-slate-700">
                <Database className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                1. Verified Source Figures
              </h3>
            </div>

            <div className="bg-stone-50 rounded-xl border border-stone-200 divide-y divide-stone-200 overflow-hidden text-xs">
              {finding.sourceMetrics.map((metric, idx) => (
                <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {metric.metricName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Table: <code className="text-slate-700 font-semibold">{metric.sourceTable}</code> · Field: <code className="text-slate-700 font-semibold">{metric.sourceField}</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-stone-200 text-xs tabular-nums">
                      {metric.sourceValue}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TIER 2: Deterministic Calculation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                2. Deterministic Calculation (Code Engine)
              </h3>
            </div>

            <div className="bg-blue-50/40 rounded-xl border border-blue-200/80 p-4 space-y-2.5 text-xs text-blue-950">
              <div>
                <span className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider">
                  Mathematical Formula:
                </span>
                <div className="font-mono text-xs font-semibold text-blue-900 bg-white/80 p-2 rounded border border-blue-200 mt-1">
                  {finding.calculationFormula || 'Direct Table Extract (No transformation applied)'}
                </div>
              </div>

              {finding.calculationBreakdown && (
                <div>
                  <span className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider">
                    Computed Step-by-Step:
                  </span>
                  <div className="font-mono text-xs text-slate-800 bg-white p-2.5 rounded border border-blue-200 mt-1 leading-relaxed">
                    {finding.calculationBreakdown}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-blue-800 pt-1">
                <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                <span>Computed by TypeScript application engine before AI payload assembly.</span>
              </div>
            </div>
          </div>

          {/* TIER 3: AI-Generated Explanations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                3. AI-Generated Business Interpretation
              </h3>
            </div>

            <div className="bg-indigo-50/30 rounded-xl border border-indigo-200/70 p-4 space-y-3 text-xs text-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-indigo-100">
                <span>Model: <strong className="text-slate-800 font-mono text-[10px]">{finding.claudeModelUsed}</strong></span>
                <span className="text-indigo-700 font-medium">Prompt: Executive Narrative Synthesis</span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Observed Fact:
                </span>
                <p className="mt-1 font-mono text-xs text-slate-900 bg-white p-2.5 rounded border border-stone-200">
                  {finding.observedFact}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-indigo-800 uppercase tracking-wider">
                  AI Contextual Interpretation:
                </span>
                <p className="mt-1 text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded border border-indigo-100">
                  {finding.interpretation}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 italic">
                <Info className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Anti-Hallucination Guardrail: Claude is prohibited from claiming correlation implies causation.</span>
              </div>
            </div>
          </div>

          {/* TIER 4: Suggested Operational Action */}
          {finding.suggestedAction && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  4. Recommended Operational Next Step
                </h3>
              </div>

              <div className="bg-amber-50/50 rounded-xl border border-amber-200 p-4 text-xs text-amber-950 space-y-2">
                <p className="leading-relaxed">
                  {finding.suggestedAction}
                </p>
                <div className="text-[11px] text-amber-800 font-medium pt-1 border-t border-amber-200/60">
                  Status: For Human Review & Executive Decision-Making
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audited Against Data Warehouse Ledger</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-slate-700 hover:bg-stone-100 font-medium transition-colors"
          >
            Done Inspecting
          </button>
        </div>

      </div>
    </div>
  );
};
