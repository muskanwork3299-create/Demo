import { PeriodRawData, DeterministicMetrics } from '../types/reporting';

/**
 * Deterministic Financial Calculation Engine
 * 
 * CRITICAL ARCHITECTURAL GUARANTEE:
 * All calculations are executed directly in deterministic TypeScript logic.
 * AI models are strictly prohibited from calculating, guessing, or approximating
 * financial totals, percentages, or variances.
 */
export function computeDeterministicMetrics(
  currentPeriod: PeriodRawData,
  priorPeriod: PeriodRawData | null,
  simulateMissingPriorData: boolean = false
): DeterministicMetrics {
  // 1. Current Period Totals
  const currentRevenue = currentPeriod.accounts.reduce(
    (sum, acc) => sum + acc.currentRevenue,
    0
  );

  const targetRevenue = currentPeriod.targetRevenue;
  const targetAchievementPercent = Number(
    ((currentRevenue / targetRevenue) * 100).toFixed(2)
  );
  const targetVarianceCurrency = currentRevenue - targetRevenue;

  // 2. Prior Period Comparison (Deterministic or Explicitly Unavailable)
  const isPriorAvailable = !simulateMissingPriorData && priorPeriod !== null;

  let priorRevenue: number | null = null;
  let revenueChangeCurrency: number | null = null;
  let revenueChangePercent: number | null = null;
  let missingDataReason: string | undefined = undefined;

  if (isPriorAvailable && priorPeriod) {
    priorRevenue = priorPeriod.accounts.reduce(
      (sum, acc) => sum + acc.currentRevenue,
      0
    );
    revenueChangeCurrency = currentRevenue - priorRevenue;
    if (priorRevenue > 0) {
      revenueChangePercent = Number(
        (((currentRevenue - priorRevenue) / priorRevenue) * 100).toFixed(2)
      );
    }
  } else if (simulateMissingPriorData) {
    missingDataReason =
      'Deliberately simulated test scenario: Previous-period benchmark dataset omitted. Trend and percentage variance calculations are suspended to protect data integrity.';
  } else {
    missingDataReason =
      'Prior-period benchmark is not configured in the active ledger window.';
  }

  // 3. Account-Level Aggregates
  let expandedCount = 0;
  let contractedCount = 0;
  let newCount = 0;
  let churnedCount = 0;

  let netExpansionARR = 0;
  let newBusinessARR = 0;
  let churnedARR = 0;

  let topGainer: { name: string; variance: number } | null = null;
  let topRisk: { name: string; variance: number } | null = null;

  currentPeriod.accounts.forEach((acc) => {
    const prior = isPriorAvailable && acc.priorRevenue !== null ? acc.priorRevenue : 0;
    const variance = acc.currentRevenue - prior;

    if (acc.status === 'New') {
      newCount++;
      newBusinessARR += acc.currentRevenue;
    } else if (acc.status === 'Churned') {
      churnedCount++;
      churnedARR += (acc.priorRevenue || 0);
    } else if (acc.status === 'Expanded' && isPriorAvailable) {
      expandedCount++;
      if (variance > 0) netExpansionARR += variance;
    } else if (acc.status === 'Contracted' && isPriorAvailable) {
      contractedCount++;
    }

    if (isPriorAvailable) {
      if (!topGainer || variance > topGainer.variance) {
        if (variance > 0) topGainer = { name: acc.name, variance };
      }
      if (!topRisk || variance < topRisk.variance) {
        if (variance < 0) topRisk = { name: acc.name, variance };
      }
    }
  });

  // Segment Revenue Breakdown
  let enterpriseRev = 0;
  let midMarketRev = 0;
  let growthRev = 0;

  currentPeriod.accounts.forEach((acc) => {
    if (acc.segment === 'Enterprise') enterpriseRev += acc.currentRevenue;
    else if (acc.segment === 'Mid-Market') midMarketRev += acc.currentRevenue;
    else if (acc.segment === 'Growth') growthRev += acc.currentRevenue;
  });

  const enterpriseSharePercent = currentRevenue > 0 
    ? Number(((enterpriseRev / currentRevenue) * 100).toFixed(1)) 
    : 0;
  const midMarketSharePercent = currentRevenue > 0 
    ? Number(((midMarketRev / currentRevenue) * 100).toFixed(1)) 
    : 0;
  const growthSharePercent = currentRevenue > 0 
    ? Number(((growthRev / currentRevenue) * 100).toFixed(1)) 
    : 0;

  return {
    periodId: currentPeriod.periodId,
    periodLabel: currentPeriod.label,
    currentRevenue,
    targetRevenue,
    targetAchievementPercent,
    targetVarianceCurrency,
    priorPeriodAvailable: isPriorAvailable,
    priorRevenue,
    revenueChangeCurrency,
    revenueChangePercent,
    missingDataReason,
    totalAccountsCount: currentPeriod.accounts.length,
    expandedAccountsCount: expandedCount,
    contractedAccountsCount: contractedCount,
    newAccountsCount: newCount,
    churnedAccountsCount: churnedCount,
    netExpansionARR,
    newBusinessARR,
    churnedARR,
    topGainerAccount: topGainer,
    topRiskAccount: topRisk,
    enterpriseSharePercent,
    midMarketSharePercent,
    growthSharePercent,
  };
}

/**
 * Clean deterministic currency formatter
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Clean deterministic percentage formatter
 */
export function formatPercent(percent: number | null | undefined): string {
  if (percent === null || percent === undefined) return '—';
  const prefix = percent > 0 ? '+' : '';
  return `${prefix}${percent.toFixed(2)}%`;
}
