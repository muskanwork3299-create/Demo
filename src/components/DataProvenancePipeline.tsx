import React, { useState } from 'react';
import { DATA_PROVENANCE_STAGES } from '../services/insightGenerator';
import { PipelineStage } from '../types/reporting';
import { 
  ArrowRight, 
  Code2, 
  CheckCircle2, 
  Database, 
  Calculator, 
  Cpu, 
  ShieldCheck, 
  LayoutDashboard,
  ExternalLink
} from 'lucide-react';

export const DataProvenancePipeline: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('calc_engine');

  const activeStage = DATA_PROVENANCE_STAGES.find((s) => s.id === activeStageId) || DATA_PROVENANCE_STAGES[1];

  const getStageIcon = (role: PipelineStage['role']) => {
    switch (role) {
      case 'Deterministic':
        return <Database className="w-4 h-4 text-slate-700" />;
      case 'Transformation':
        return <Calculator className="w-4 h-4 text-blue-700" />;
      case 'AI Semantic Engine':
        return <Cpu className="w-4 h-4 text-indigo-700" />;
      case 'Safety Guardrail':
        return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
      case 'Presentation':
        return <LayoutDashboard className="w-4 h-4 text-purple-700" />;
    }
  };

  return (
    <section className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              How This Insight Was Produced
            </h3>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              Data Provenance Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic calculations happen first; Anthropic Claude only explains pre-verified figures.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero AI-Interpolated Figures</span>
        </div>
      </div>

      {/* Visual Pipeline Flow Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {DATA_PROVENANCE_STAGES.map((stage, idx) => {
          const isActive = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              type="button"
              className={`p-3 rounded-lg border text-left transition-all relative ${
                isActive
                  ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  0{stage.stepNumber}
                </span>
                {getStageIcon(stage.role)}
              </div>
              <div className="text-xs font-semibold text-slate-900 truncate">
                {stage.title.replace(/^\d+\.\s*/, '')}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {stage.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail & Code/Data Inspector */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                Step {activeStage.stepNumber} of 6
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                {activeStage.title}: {activeStage.subtitle}
              </h4>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {activeStage.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Architectural Role
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {activeStage.role}
            </span>
          </div>
        </div>

        {/* Code / Data Block */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="font-mono uppercase tracking-wider">
              Underlying {activeStage.snippetLanguage.toUpperCase()} Contract
            </span>
            <span className="text-slate-400">Strict Type Boundary</span>
          </div>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
            <code>{activeStage.codeOrDataSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Pipeline Summary Guarantee */}
      <div className="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-stone-100 gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>Client Architecture Rule:</strong> Claude API key and calls reside in secure server proxy routes (`/api/*`), never in client-side code.
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          Ready for Anthropic Claude 3.5 Sonnet Integration
        </span>
      </div>

    </section>
  );
};
