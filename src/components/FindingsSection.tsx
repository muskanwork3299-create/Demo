import React, { useState } from 'react';
import { FindingItem, FindingCategory } from '../types/reporting';
import { 
  Sparkles, 
  ArrowRight, 
  FileCheck2, 
  AlertTriangle, 
  ArrowUpRight, 
  Lightbulb, 
  ShieldCheck,
  Check
} from 'lucide-react';

interface FindingsSectionProps {
  findings: FindingItem[];
  selectedFindingId: string | null;
  onSelectFinding: (finding: FindingItem) => void;
  isSimulatingMissingData: boolean;
}

export const FindingsSection: React.FC<FindingsSectionProps> = ({
  findings,
  selectedFindingId,
  onSelectFinding,
  isSimulatingMissingData,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | FindingCategory>('all');

  const categories = [
    { id: 'all', label: 'All Findings' },
    { id: 'key_finding', label: 'Key Findings' },
    { id: 'period_comparison', label: 'Period Comparisons' },
    { id: 'exception_attention', label: 'Exceptions' },
    { id: 'next_step', label: 'Next Steps' },
  ] as const;

  const filteredFindings = findings.filter((f) => {
    if (activeCategory === 'all') return true;
    return f.category === activeCategory;
  });

  const getCategoryBadge = (category: FindingCategory) => {
    switch (category) {
      case 'key_finding':
        return <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-medium">Key Finding</span>;
      case 'period_comparison':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium">Period Comparison</span>;
      case 'exception_attention':
        return <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">Exception</span>;
      case 'next_step':
        return <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">Next Step</span>;
    }
  };

  return (
    <section className="space-y-4 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              What the Numbers Tell Us
            </h2>
            <span className="text-xs text-slate-500 font-medium bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
              Simulated Claude Output
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Plain-English executive explanations grounded in deterministic calculations. Select any finding to inspect verified source figures.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-medium border border-stone-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Findings Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFindings.map((finding) => {
          const isSelected = selectedFindingId === finding.id;

          return (
            <div
              key={finding.id}
              onClick={() => onSelectFinding(finding)}
              className={`group text-left p-5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white border-stone-200 hover:border-indigo-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(finding.category)}
                    <span className="text-[11px] font-mono text-slate-400">
                      {finding.guardrailStatus === 'verified_match' ? '100% Verified' : 'Test Guardrail'}
                    </span>
                  </div>

                  <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Finding Title */}
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-950 transition-colors leading-snug">
                  {finding.title}
                </h3>

                {/* Plain English Narrative */}
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {finding.plainEnglishExplanation}
                </p>

                {/* Fact vs Interpretation Distinction */}
                <div className="mt-3.5 space-y-1.5 pt-3 border-t border-stone-100 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-slate-500 shrink-0 w-24">Observed Fact:</span>
                    <span className="text-slate-700 font-mono text-[10px] tabular-nums leading-tight">{finding.observedFact}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-indigo-800 shrink-0 w-24">Interpretation:</span>
                    <span className="text-slate-600 leading-tight">{finding.interpretation}</span>
                  </div>
                  {finding.suggestedAction && (
                    <div className="flex items-start gap-1.5">
                      <span className="font-semibold text-amber-900 shrink-0 w-24">Next Step:</span>
                      <span className="text-slate-600 leading-tight">{finding.suggestedAction}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Source Metrics Pill List */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  Source Evidence:
                </span>
                {finding.sourceMetrics.map((sm, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono bg-stone-100 text-slate-700 px-2 py-0.5 rounded border border-stone-200 tabular-nums"
                  >
                    {sm.metricName}: <strong className="text-slate-900">{sm.sourceValue}</strong>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
