/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { PeriodId, FindingItem, AccountRecord } from './types/reporting';
import { SAMPLE_PERIODS_DATA } from './data/sampleDataset';
import { computeDeterministicMetrics } from './calculations/engine';
import { generateFindings } from './services/insightGenerator';
import { Header } from './components/Header';
import { ExecutiveReport } from './components/ExecutiveReport';
import { FindingsSection } from './components/FindingsSection';
import { EvidencePanel } from './components/EvidencePanel';
import { DataProvenancePipeline } from './components/DataProvenancePipeline';
import { ClaudePayloadInspectorModal } from './components/ClaudePayloadInspectorModal';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodId>('2026-10');
  const [isSimulatingMissingData, setIsSimulatingMissingData] = useState<boolean>(false);
  const [selectedFinding, setSelectedFinding] = useState<FindingItem | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationState, setGenerationState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [isPromptInspectorOpen, setIsPromptInspectorOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Period datasets
  const currentPeriodData = SAMPLE_PERIODS_DATA[selectedPeriod];
  
  // Prior period determination
  const priorPeriodData = useMemo(() => {
    if (selectedPeriod === '2026-10') return SAMPLE_PERIODS_DATA['2026-09'];
    if (selectedPeriod === '2026-09') return SAMPLE_PERIODS_DATA['2026-08'];
    return null; // August has no prior benchmark in sample dataset
  }, [selectedPeriod]);

  // Deterministic financial calculation engine
  const metrics = useMemo(() => {
    return computeDeterministicMetrics(
      currentPeriodData,
      priorPeriodData,
      isSimulatingMissingData
    );
  }, [currentPeriodData, priorPeriodData, isSimulatingMissingData]);

  // AI-generated business findings (grounded in the deterministic metrics)
  const findings = useMemo(() => {
    return generateFindings(
      metrics,
      currentPeriodData,
      isSimulatingMissingData
    );
  }, [metrics, currentPeriodData, isSimulatingMissingData]);

  // Trigger insight generation simulation
  const handleGenerateInsights = useCallback(() => {
    setIsGenerating(true);
    setGenerationState('loading');
    setNotification('Simulating Anthropic Claude 3.5 Sonnet pipeline execution...');

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationState('success');
      setNotification('Insights refreshed. 100% mathematical reconciliation verified.');
      setTimeout(() => setNotification(null), 3500);
    }, 700);
  }, []);

  // Toggle missing data simulation
  const handleToggleMissingData = useCallback(() => {
    setIsSimulatingMissingData((prev) => {
      const next = !prev;
      setNotification(
        next 
          ? 'Missing Data Test Active: Prior-period baseline omitted. PoP trend suspended.'
          : 'Normal baseline restored. Prior-period benchmark connected.'
      );
      setTimeout(() => setNotification(null), 3500);
      return next;
    });
  }, []);

  // Reset to default
  const handleResetDemo = useCallback(() => {
    setSelectedPeriod('2026-10');
    setIsSimulatingMissingData(false);
    setSelectedFinding(null);
    setGenerationState('idle');
    setNotification('Demo reset to standard October 2026 baseline.');
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Handle selecting an account in the ledger table
  const handleSelectAccount = useCallback((account: AccountRecord) => {
    // If there is an exception or finding about this account, open it!
    const matchedFinding = findings.find((f) => 
      f.title.toLowerCase().includes(account.name.split(' ')[0].toLowerCase()) ||
      f.plainEnglishExplanation.toLowerCase().includes(account.name.toLowerCase())
    );

    if (matchedFinding) {
      setSelectedFinding(matchedFinding);
    } else {
      setNotification(`Selected ${account.name} (ARR: $${account.currentRevenue.toLocaleString()}). Full deterministic reconciliation active.`);
      setTimeout(() => setNotification(null), 3000);
    }
  }, [findings]);

  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col font-sans text-slate-900">
      
      {/* Top Header */}
      <Header
        selectedPeriod={selectedPeriod}
        onPeriodChange={(period) => {
          setSelectedPeriod(period);
          setNotification(`Switched reporting view to ${SAMPLE_PERIODS_DATA[period].label}`);
          setTimeout(() => setNotification(null), 2500);
        }}
        isSimulatingMissingData={isSimulatingMissingData}
        onToggleMissingData={handleToggleMissingData}
        onGenerateInsights={handleGenerateInsights}
        isGenerating={isGenerating}
        onResetDemo={handleResetDemo}
        onOpenPromptInspector={() => setIsPromptInspectorOpen(true)}
        generationState={generationState}
      />

      {/* Floating Status Notification Toast */}
      {notification && (
        <aside 
          aria-label="System status alert"
          className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>{notification}</span>
        </aside>
      )}

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Section 1: Executive Financial Report */}
        <section aria-labelledby="executive-report-heading">
          <div className="mb-4">
            <h1 id="executive-report-heading" className="text-2xl font-bold tracking-tight text-slate-900">
              Executive Revenue Performance
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verified financial figures computed by deterministic reporting rules ({currentPeriodData.label})
            </p>
          </div>

          <ExecutiveReport
            metrics={metrics}
            currentPeriod={currentPeriodData}
            priorPeriod={priorPeriodData}
            isSimulatingMissingData={isSimulatingMissingData}
            onSelectAccount={handleSelectAccount}
          />
        </section>

        {/* Section 2: AI-Generated Findings ("What the Numbers Tell Us") */}
        <section aria-labelledby="ai-findings-heading">
          <FindingsSection
            findings={findings}
            selectedFindingId={selectedFinding?.id || null}
            onSelectFinding={(f) => setSelectedFinding(f)}
            isSimulatingMissingData={isSimulatingMissingData}
          />
        </section>

        {/* Section 3: Data Provenance Pipeline */}
        <section aria-labelledby="pipeline-heading">
          <DataProvenancePipeline />
        </section>

      </main>

      {/* Evidence Side Panel (Drawer) */}
      <EvidencePanel
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />

      {/* Claude Prompt & Schema Inspector Modal */}
      <ClaudePayloadInspectorModal
        isOpen={isPromptInspectorOpen}
        onClose={() => setIsPromptInspectorOpen(false)}
        metrics={metrics}
        currentPeriod={currentPeriodData}
        isSimulatingMissingData={isSimulatingMissingData}
      />

      {/* Quiet Professional B2B Footer */}
      <footer className="border-t border-stone-200 bg-stone-50 py-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">InsightLayer</span>
            <span>·</span>
            <span>Anthropic Claude Integration Preview</span>
            <span>·</span>
            <span className="text-[11px] text-slate-400">Illustrative Data Only</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Deterministic Math First</span>
            <span>·</span>
            <span>AI Narrative Synthesis</span>
            <span>·</span>
            <button
              onClick={() => setIsPromptInspectorOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2"
            >
              View API Contract
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
