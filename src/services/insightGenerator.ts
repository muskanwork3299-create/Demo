import { 
  DeterministicMetrics, 
  FindingItem, 
  PeriodRawData,
  PipelineStage 
} from '../types/reporting';
import { formatCurrency, formatPercent } from '../calculations/engine';

/**
 * Insight Generator Service
 * 
 * Demonstrates how an AI model (Anthropic Claude 3.5 Sonnet) is supplied
 * pre-calculated deterministic figures in a strictly bound JSON payload.
 * 
 * The AI generates business semantic explanations, narrative context, and recommended
 * operational next steps without performing math or modifying values.
 */
export function generateFindings(
  metrics: DeterministicMetrics,
  currentPeriod: PeriodRawData,
  simulateMissingPrior: boolean
): FindingItem[] {
  const findings: FindingItem[] = [];

  // ==========================================
  // 1. KEY FINDINGS
  // ==========================================
  const targetAchieved = metrics.targetAchievementPercent >= 100;
  findings.push({
    id: 'f-quota-achievement',
    category: 'key_finding',
    categoryLabel: 'Key Finding',
    title: `Monthly Revenue Target Exceeded by ${formatPercent(metrics.targetAchievementPercent - 100)}`,
    plainEnglishExplanation: `Total booked revenue reached ${formatCurrency(metrics.currentRevenue)}, exceeding the monthly target of ${formatCurrency(metrics.targetRevenue)} by ${formatCurrency(metrics.targetVarianceCurrency)} (${metrics.targetAchievementPercent}% quota achievement).`,
    observedFact: `Total verified revenue for ${metrics.periodLabel} is ${formatCurrency(metrics.currentRevenue)} against a deterministic target baseline of ${formatCurrency(metrics.targetRevenue)}.`,
    interpretation: `Quota attainment was supported primarily by Enterprise tier expansion, with large accounts making up ${metrics.enterpriseSharePercent}% of total volume. This indicates strong revenue concentration in top-tier accounts.`,
    suggestedAction: `Review enterprise capacity to ensure delivery timelines can support the expanded seat counts booked this cycle.`,
    claudeModelUsed: 'claude-3-5-sonnet-20241022 (Simulated Output)',
    guardrailStatus: 'verified_match',
    confidenceScore: 'Deterministic 100% Match',
    calculationFormula: '(Current Booked Revenue / Target Quota) * 100',
    calculationBreakdown: `(${formatCurrency(metrics.currentRevenue)} / ${formatCurrency(metrics.targetRevenue)}) * 100 = ${metrics.targetAchievementPercent}%`,
    sourceMetrics: [
      {
        metricName: 'Current Period Revenue',
        sourceValue: formatCurrency(metrics.currentRevenue),
        sourceTable: 'billing_ledger_monthly',
        sourceField: 'SUM(current_revenue)',
        isDeterministic: true
      },
      {
        metricName: 'Target Quota Baseline',
        sourceValue: formatCurrency(metrics.targetRevenue),
        sourceTable: 'sales_targets_2026',
        sourceField: 'target_revenue',
        isDeterministic: true
      },
      {
        metricName: 'Variance to Quota',
        sourceValue: `+${formatCurrency(metrics.targetVarianceCurrency)}`,
        sourceTable: 'calculation_engine',
        sourceField: 'currentRevenue - targetRevenue',
        isDeterministic: true
      }
    ]
  });

  // Enterprise Concentration Key Finding
  findings.push({
    id: 'f-enterprise-concentration',
    category: 'key_finding',
    categoryLabel: 'Key Finding',
    title: `Enterprise Tier Represents ${metrics.enterpriseSharePercent}% of Period Revenue`,
    plainEnglishExplanation: `Five enterprise accounts generated ${formatCurrency(metrics.currentRevenue * (metrics.enterpriseSharePercent / 100))}, representing over three-quarters of all billed revenue for this cycle.`,
    observedFact: `The top 5 accounts in the Enterprise tier generated ${metrics.enterpriseSharePercent}% of all revenue, while Mid-Market accounted for ${metrics.midMarketSharePercent}% and Growth accounted for ${metrics.growthSharePercent}%.`,
    interpretation: `Revenue performance is heavily anchored to top enterprise renewals and expansions. While this reflects strong product-market fit among large organizations, high account concentration introduces asymmetric risk if an enterprise tier client churns.`,
    suggestedAction: `Maintain proactive executive sponsor cadence for the top 5 accounts; evaluate Mid-Market pipeline acceleration to diversify revenue distribution.`,
    claudeModelUsed: 'claude-3-5-sonnet-20241022 (Simulated Output)',
    guardrailStatus: 'verified_match',
    confidenceScore: 'Deterministic 100% Match',
    calculationFormula: 'SUM(Enterprise Account Revenue) / Total Current Revenue',
    calculationBreakdown: `Enterprise subtotal / ${formatCurrency(metrics.currentRevenue)} = ${metrics.enterpriseSharePercent}%`,
    sourceMetrics: [
      {
        metricName: 'Enterprise Share',
        sourceValue: `${metrics.enterpriseSharePercent}%`,
        sourceTable: 'accounts_dimension',
        sourceField: 'segment_revenue_ratio',
        isDeterministic: true
      },
      {
        metricName: 'Mid-Market Share',
        sourceValue: `${metrics.midMarketSharePercent}%`,
        sourceTable: 'accounts_dimension',
        sourceField: 'segment_revenue_ratio',
        isDeterministic: true
      },
      {
        metricName: 'Growth Share',
        sourceValue: `${metrics.growthSharePercent}%`,
        sourceTable: 'accounts_dimension',
        sourceField: 'segment_revenue_ratio',
        isDeterministic: true
      }
    ]
  });

  // ==========================================
  // 2. PERIOD-OVER-PERIOD COMPARISONS
  // ==========================================
  if (simulateMissingPrior || !metrics.priorPeriodAvailable) {
    findings.push({
      id: 'f-missing-pop-data',
      category: 'period_comparison',
      categoryLabel: 'Period Comparison (Simulated Test)',
      title: 'Period-over-Period Trend Suspended: Prior Dataset Omitted',
      plainEnglishExplanation: 'Previous-period benchmark records were intentionally omitted in this test scenario. Consequently, no period-over-period percentage variance or trend line was fabricated.',
      observedFact: 'Benchmark prior-period ledger records are unavailable in the query window. Unrelated valid metrics (current revenue: ' + formatCurrency(metrics.currentRevenue) + ') remain fully verified.',
      interpretation: 'The reporting engine deliberately halts delta computations when baseline records are absent. AI explanations acknowledge the lack of historical trend data rather than inventing estimates or hallucinating zero change.',
      suggestedAction: 'Verify prior-period data sync pipeline in your data warehouse before requesting comparative executive analysis.',
      claudeModelUsed: 'claude-3-5-sonnet-20241022 (Simulated Output)',
      guardrailStatus: 'omitted_due_to_missing_data',
      confidenceScore: 'Integrity Guardrail Triggered',
      calculationFormula: 'Comparison Omitted (Current - Null = Undefined)',
      calculationBreakdown: 'Prior revenue record is NULL. Formula evaluation halted by deterministic safety guard.',
      sourceMetrics: [
        {
          metricName: 'Prior Period Revenue',
          sourceValue: 'NULL / Unavailable',
          sourceTable: 'billing_ledger_monthly',
          sourceField: 'prior_month_revenue',
          isDeterministic: true
        },
        {
          metricName: 'Comparison Status',
          sourceValue: 'SUSPENDED',
          sourceTable: 'system_guardrail',
          sourceField: 'validation_flag',
          isDeterministic: true
        }
      ]
    });
  } else {
    findings.push({
      id: 'f-pop-revenue-growth',
      category: 'period_comparison',
      categoryLabel: 'Period-over-Period',
      title: `Revenue Grew ${formatPercent(metrics.revenueChangePercent)} Compared to Previous Period`,
      plainEnglishExplanation: `Total revenue expanded by ${formatCurrency(metrics.revenueChangeCurrency)} from ${formatCurrency(metrics.priorRevenue)} in September 2026 to ${formatCurrency(metrics.currentRevenue)} in October 2026 (+${metrics.revenueChangePercent}%).`,
      observedFact: `Verified September revenue of ${formatCurrency(metrics.priorRevenue)} compared to verified October revenue of ${formatCurrency(metrics.currentRevenue)} reflects a deterministic net delta of ${formatCurrency(metrics.revenueChangeCurrency)}.`,
      interpretation: `Net expansion outpaced contraction and churn. Gains were driven by major expansion in Northstar Global Logistics (+${formatCurrency(60000)}) and Helios Renewable Grid (+${formatCurrency(40000)}), offsetting contraction in Crestview Financial Partners (-${formatCurrency(60000)}).`,
      suggestedAction: `Capitalize on positive expansion momentum by identifying repeatable use cases in EMEA logistics and renewable infrastructure.`,
      claudeModelUsed: 'claude-3-5-sonnet-20241022 (Simulated Output)',
      guardrailStatus: 'verified_match',
      confidenceScore: 'Deterministic 100% Match',
      calculationFormula: '((Current Revenue - Prior Revenue) / Prior Revenue) * 100',
      calculationBreakdown: `((${formatCurrency(metrics.currentRevenue)} - ${formatCurrency(metrics.priorRevenue)}) / ${formatCurrency(metrics.priorRevenue)}) * 100 = +${metrics.revenueChangePercent}%`,
      sourceMetrics: [
        {
          metricName: 'Prior Period Revenue (Sep 2026)',
          sourceValue: formatCurrency(metrics.priorRevenue),
          sourceTable: 'billing_ledger_monthly',
          sourceField: 'SUM(prior_revenue)',
          isDeterministic: true
        },
        {
          metricName: 'Current Period Revenue (Oct 2026)',
          sourceValue: formatCurrency(metrics.currentRevenue),
          sourceTable: 'billing_ledger_monthly',
          sourceField: 'SUM(current_revenue)',
          isDeterministic: true
        },
        {
          metricName: 'Net Currency Delta',
          sourceValue: `+${formatCurrency(metrics.revenueChangeCurrency)}`,
          sourceTable: 'calculation_engine',
          sourceField: 'currentRevenue - priorRevenue',
          isDeterministic: true
        }
      ]
    });
  }

  // ==========================================
  // 3. EXCEPTIONS REQUIRING ATTENTION
  // ==========================================
  findings.push({
    id: 'f-exception-crestview-downsize',
    category: 'exception_attention',
    categoryLabel: 'Exception Requiring Attention',
    title: 'Crestview Financial Contracted by $60,000 Following Unit Restructuring',
    plainEnglishExplanation: 'Crestview Financial Partners reduced their contracted volume from $195,000 to $135,000 (-30.8%), representing the largest single account contraction in the reporting period.',
    observedFact: 'Account ACC-105 downsized billed ARR by $60,000 in October 2026. Renewal quarter is marked as Q4 2026.',
    interpretation: 'Account notes identify a consolidation of Crestview’s wealth advisory unit as the cause of the seat reduction. Note that this correlation with internal restructuring does not guarantee broader vulnerability across other financial sector clients.',
    suggestedAction: 'Engage Crestview’s account director to audit remaining user engagement before the final Q4 renewal sign-off.',
    claudeModelUsed: 'claude-3-5-sonnet-20241022 (Simulated Output)',
    guardrailStatus: 'verified_match',
    confidenceScore: 'Deterministic 100% Match',
    calculationFormula: 'Account Current Revenue - Account Prior Revenue',
    calculationBreakdown: '$135,000 - $195,000 = -$60,000 (-30.77%)',
    sourceMetrics: [
      {
        metricName: 'Crestview Current Revenue',
        sourceValue: '$135,000',
        sourceTable: 'accounts_ledger',
        sourceField: 'ACC-105.current_revenue',
        isDeterministic: true
      },
      {
        metricName: 'Crestview Prior Revenue',
        sourceValue: '$195,000',
        sourceTable: 'accounts_ledger',
        sourceField: 'ACC-105.prior_revenue',
        isDeterministic: true
      },
      {
        metricName: 'Contraction Variance',
        sourceValue: '-$60,000',
        sourceTable: 'calculation_engine',
        sourceField: 'variance_currency',
        isDeterministic: true
      }
    ]
  });

  findings.push({
    id: 'f-exception-churn-cobalt',
    category: 'exception_attention',
    categoryLabel: 'Exception Requiring Attention',
    title: 'Cobalt Cyber Defense Churned ($40,000 ARR Lost Due to Acquisition)',
    plainEnglishExplanation: 'Cobalt Cyber Defense was sunset following an acquisition by a third-party competitor, resulting in a full ARR loss of $40,000.',
    observedFact: 'Account ACC-111 transitioned to status Churned in October 2026, dropping from $40,000 prior revenue to $0 current revenue.',
    interpretation: 'The loss is categorized as M&A-driven termination rather than product dissatisfaction or platform outage. Total churn ARR for the period is confined to this single account.',
    suggestedAction: 'Document customer migration insights from the departing champion to evaluate retention strategies for accounts in M&A transitions.',
    claudeModelUsed: 'claude-3-5-sonnet-20241022 (Simulated Output)',
    guardrailStatus: 'verified_match',
    confidenceScore: 'Deterministic 100% Match',
    calculationFormula: 'Account Prior Revenue - Account Current Revenue (Full Churn)',
    calculationBreakdown: '$40,000 - $0 = -$40,000 Churn Loss',
    sourceMetrics: [
      {
        metricName: 'Cobalt Prior Revenue',
        sourceValue: '$40,000',
        sourceTable: 'accounts_ledger',
        sourceField: 'ACC-111.prior_revenue',
        isDeterministic: true
      },
      {
        metricName: 'Cobalt Current Revenue',
        sourceValue: '$0',
        sourceTable: 'accounts_ledger',
        sourceField: 'ACC-111.current_revenue',
        isDeterministic: true
      }
    ]
  });

  // ==========================================
  // 4. POTENTIAL NEXT STEPS
  // ==========================================
  findings.push({
    id: 'f-nextstep-enterprise-playbook',
    category: 'next_step',
    categoryLabel: 'Potential Next Step',
    title: 'Replicate Northstar & Helios Expansion Playbook in European Accounts',
    plainEnglishExplanation: 'Northstar Global Logistics and Helios Renewable Grid accounted for $100,000 in net new expansion ARR. Identifying the specific product triggers (telemetry add-ons) can guide Q4 sales enablement.',
    observedFact: 'Combined expansion across Northstar (+ $60,000) and Helios (+ $40,000) equaled 80.6% of all expansion ARR gained in the period.',
    interpretation: 'Both accounts adopted telemetry and high-tier analytics modules. While this correlation suggests growing demand for operational monitoring, expansion should be validated against customer workload metrics before committing to roadmap shifts.',
    suggestedAction: 'Have Solutions Engineering summarize the technical requirements that closed the Helios and Northstar expansions to prepare the Q1 enterprise pipeline.',
    claudeModelUsed: 'claude-3-5-sonnet-20241022 (Simulated Output)',
    guardrailStatus: 'verified_match',
    confidenceScore: 'Deterministic 100% Match',
    calculationFormula: '(Northstar Expansion + Helios Expansion) / Total Net Expansion',
    calculationBreakdown: '($60,000 + $40,000) / $124,000 = 80.64%',
    sourceMetrics: [
      {
        metricName: 'Northstar Net Expansion',
        sourceValue: '+$60,000',
        sourceTable: 'accounts_ledger',
        sourceField: 'ACC-101.variance',
        isDeterministic: true
      },
      {
        metricName: 'Helios Net Expansion',
        sourceValue: '+$40,000',
        sourceTable: 'accounts_ledger',
        sourceField: 'ACC-103.variance',
        isDeterministic: true
      }
    ]
  });

  findings.push({
    id: 'f-nextstep-midmarket-acceleration',
    category: 'next_step',
    categoryLabel: 'Potential Next Step',
    title: 'Accelerate Mid-Market Pipeline to Mitigate High Revenue Concentration',
    plainEnglishExplanation: 'Because the top 5 enterprise accounts contribute 74.5% of total revenue, initiating targeted mid-market outbound campaigns in Q1 can create a more resilient ARR base.',
    observedFact: 'Current revenue distribution shows Enterprise at 74.5%, Mid-Market at 20.7%, and Growth at 4.8%.',
    interpretation: 'Enterprise deal cycles carry longer lead times and higher single-point vulnerability. Broadening the Mid-Market tier from $291,000 toward $400,000 monthly ARR would improve portfolio diversification.',
    suggestedAction: 'Schedule a joint Sales & Marketing review to assess Mid-Market qualified pipeline for Q1 2027.',
    claudeModelUsed: 'claude-3-5-sonnet-20241022 (Simulated Output)',
    guardrailStatus: 'verified_match',
    confidenceScore: 'Deterministic 100% Match',
    calculationFormula: 'Segment Revenue Distribution Matrix',
    calculationBreakdown: `Enterprise: ${metrics.enterpriseSharePercent}% · Mid-Market: ${metrics.midMarketSharePercent}% · Growth: ${metrics.growthSharePercent}%`,
    sourceMetrics: [
      {
        metricName: 'Enterprise Concentration',
        sourceValue: `${metrics.enterpriseSharePercent}%`,
        sourceTable: 'calculation_engine',
        sourceField: 'enterpriseSharePercent',
        isDeterministic: true
      },
      {
        metricName: 'Mid-Market Concentration',
        sourceValue: `${metrics.midMarketSharePercent}%`,
        sourceTable: 'calculation_engine',
        sourceField: 'midMarketSharePercent',
        isDeterministic: true
      }
    ]
  });

  return findings;
}

/**
 * Data Provenance Pipeline Definition
 * Explains the 6-stage architecture to prospective clients.
 */
export const DATA_PROVENANCE_STAGES: PipelineStage[] = [
  {
    id: 'source_data',
    stepNumber: 1,
    title: '1. Source Data Extraction',
    subtitle: 'Authoritative SQL Ledger',
    role: 'Deterministic',
    description: 'Raw transactional billing ledger records are extracted directly from client ERP/Postgres data warehouses. No AI is present in the data extraction phase.',
    snippetLanguage: 'sql',
    codeOrDataSnippet: `-- Verified Ledger Query
SELECT 
  account_id, 
  account_name, 
  segment, 
  billed_arr_current, 
  billed_arr_prior,
  status
FROM finance_ledger_monthly
WHERE period = '2026-10'
ORDER BY billed_arr_current DESC;`
  },
  {
    id: 'calc_engine',
    stepNumber: 2,
    title: '2. Calculation Logic',
    subtitle: 'Deterministic Math Engine',
    role: 'Transformation',
    description: 'All totals, period-over-period percentages, variances, and target achievements are computed in strict application code with zero rounding drift or AI estimation.',
    snippetLanguage: 'typescript',
    codeOrDataSnippet: `// 100% Deterministic Financial Calculations
const currentRevenue = accounts.reduce((s, a) => s + a.currentRevenue, 0);
const targetAchievement = (currentRevenue / targetQuota) * 100;
const periodVariancePercent = priorRevenue 
  ? ((currentRevenue - priorRevenue) / priorRevenue) * 100 
  : null; // Suspended if prior data is missing!`
  },
  {
    id: 'structured_payload',
    stepNumber: 3,
    title: '3. Structured Payload',
    subtitle: 'Strict JSON Contract',
    role: 'Transformation',
    description: 'The pre-computed numbers are assembled into a rigid, typed JSON payload. Claude is instructed that all figures are immutable source facts.',
    snippetLanguage: 'json',
    codeOrDataSnippet: `{
  "period": "2026-10",
  "deterministic_metrics": {
    "current_revenue": 1408500,
    "target_quota": 1350000,
    "target_achievement_pct": 104.33,
    "prior_period_revenue": 1285000,
    "period_growth_pct": 9.61
  },
  "constraints": {
    "allow_math_alteration": false,
    "must_cite_source_fields": true
  }
}`
  },
  {
    id: 'claude_prompt',
    stepNumber: 4,
    title: '4. AI Semantic Synthesis',
    subtitle: 'Anthropic Claude 3.5 Sonnet',
    role: 'AI Semantic Engine',
    description: 'Claude translates the verified numbers into clear executive business context, highlighting anomalies, risk areas, and operational recommendations without altering numbers.',
    snippetLanguage: 'markdown',
    codeOrDataSnippet: `You are an executive business analyst. You are provided with deterministic, pre-calculated financial metrics from our verified reporting ledger.

CRITICAL INVARIANTS:
1. Do not calculate, estimate, or modify any financial figures.
2. Every business claim must cite the exact supplied source field.
3. Distinguish observed facts from interpretations. Never confuse correlation with causation.
4. If a metric is marked NULL (missing data), explicitly explain that trend calculations are suspended.`
  },
  {
    id: 'guardrail_validation',
    stepNumber: 5,
    title: '5. Guardrail Validation',
    subtitle: 'Automated Fact Reconciliation',
    role: 'Safety Guardrail',
    description: 'Before displaying to executives, an automated reconciliation engine parses the AI response and cross-verifies every single number against the deterministic engine output.',
    snippetLanguage: 'typescript',
    codeOrDataSnippet: `// Automated Boundary Guardrail
for (const finding of claudeResponse.findings) {
  for (const metric of finding.sourceMetrics) {
    const verifiedValue = ledgerIndex.get(metric.sourceField);
    if (metric.sourceValue !== verifiedValue) {
      throw new SecurityGuardrailException(
        \`AI attempted numerical hallucination: \${metric.sourceValue} !== \${verifiedValue}\`
      );
    }
  }
}`
  },
  {
    id: 'executive_view',
    stepNumber: 6,
    title: '6. Executive Presentation',
    subtitle: 'InsightLayer Preview UI',
    role: 'Presentation',
    description: 'The final report presents plain-English findings paired with instant one-click evidence inspection, verified calculations, and data provenance.',
    snippetLanguage: 'json',
    codeOrDataSnippet: `{
  "ui_state": "Rendered",
  "verified_findings_count": 6,
  "confidence": "Deterministic Math + Claude Explanation",
  "client_ready": true
}`
  }
];
