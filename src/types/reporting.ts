export type PeriodId = '2026-10' | '2026-09' | '2026-08';

export interface AccountRecord {
  id: string;
  name: string;
  segment: 'Enterprise' | 'Mid-Market' | 'Growth';
  currentRevenue: number;
  priorRevenue: number | null;
  renewalQuarter: string;
  region: 'Americas' | 'EMEA' | 'APAC';
  status: 'Expanded' | 'New' | 'Flat' | 'Contracted' | 'Churned';
  notes?: string;
}

export interface PeriodRawData {
  periodId: PeriodId;
  label: string;
  startDate: string;
  endDate: string;
  targetRevenue: number;
  accounts: AccountRecord[];
  dailyTrend: {
    day: number;
    date: string;
    dailyRevenue: number;
    cumulativeRevenue: number;
  }[];
}

export interface DeterministicMetrics {
  periodId: PeriodId;
  periodLabel: string;
  currentRevenue: number;
  targetRevenue: number;
  targetAchievementPercent: number;
  targetVarianceCurrency: number;
  
  // Prior period comparison
  priorPeriodAvailable: boolean;
  priorRevenue: number | null;
  revenueChangeCurrency: number | null;
  revenueChangePercent: number | null;
  missingDataReason?: string;

  // Account breakdown metrics
  totalAccountsCount: number;
  expandedAccountsCount: number;
  contractedAccountsCount: number;
  newAccountsCount: number;
  churnedAccountsCount: number;
  
  netExpansionARR: number;
  newBusinessARR: number;
  churnedARR: number;
  topGainerAccount: { name: string; variance: number } | null;
  topRiskAccount: { name: string; variance: number } | null;
  
  // Segment concentrations
  enterpriseSharePercent: number;
  midMarketSharePercent: number;
  growthSharePercent: number;
}

export type FindingCategory = 
  | 'key_finding'
  | 'period_comparison'
  | 'exception_attention'
  | 'next_step';

export interface EvidenceSourceMetric {
  metricName: string;
  sourceValue: string | number;
  sourceTable: string;
  sourceField: string;
  isDeterministic: boolean;
}

export interface FindingItem {
  id: string;
  category: FindingCategory;
  categoryLabel: string;
  title: string;
  plainEnglishExplanation: string;
  observedFact: string;
  interpretation: string;
  suggestedAction?: string;
  
  // Provenance & Evidence
  sourceMetrics: EvidenceSourceMetric[];
  calculationFormula?: string;
  calculationBreakdown?: string;
  guardrailStatus: 'verified_match' | 'omitted_due_to_missing_data';
  confidenceScore?: string;
  claudeModelUsed: string;
}

export type PipelineStageId = 
  | 'source_data'
  | 'calc_engine'
  | 'structured_payload'
  | 'claude_prompt'
  | 'guardrail_validation'
  | 'executive_view';

export interface PipelineStage {
  id: PipelineStageId;
  stepNumber: number;
  title: string;
  subtitle: string;
  role: 'Deterministic' | 'Transformation' | 'AI Semantic Engine' | 'Safety Guardrail' | 'Presentation';
  description: string;
  codeOrDataSnippet: string;
  snippetLanguage: 'sql' | 'typescript' | 'json' | 'markdown';
}
