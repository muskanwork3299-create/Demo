import { PeriodRawData, PeriodId } from '../types/reporting';

/**
 * Illustrative sample dataset for InsightLayer evaluation.
 * All figures, account entities, and dates are fictional and designed to test
 * deterministic financial calculations and Claude business explanations.
 */
export const SAMPLE_PERIODS_DATA: Record<PeriodId, PeriodRawData> = {
  '2026-10': {
    periodId: '2026-10',
    label: 'October 2026 (Current)',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    targetRevenue: 1350000,
    accounts: [
      {
        id: 'ACC-101',
        name: 'Northstar Global Logistics',
        segment: 'Enterprise',
        currentRevenue: 285000,
        priorRevenue: 225000,
        renewalQuarter: 'Q4 2026',
        region: 'Americas',
        status: 'Expanded',
        notes: 'Expanded tier-1 analytics package; +3 seats added in EMEA branch.'
      },
      {
        id: 'ACC-102',
        name: 'Vanguard Biopharma Systems',
        segment: 'Enterprise',
        currentRevenue: 240000,
        priorRevenue: 240000,
        renewalQuarter: 'Q1 2027',
        region: 'Americas',
        status: 'Flat',
        notes: 'Platform license renewed at par with multi-year lock-in.'
      },
      {
        id: 'ACC-103',
        name: 'Helios Renewable Grid',
        segment: 'Enterprise',
        currentRevenue: 195000,
        priorRevenue: 155000,
        renewalQuarter: 'Q3 2027',
        region: 'EMEA',
        status: 'Expanded',
        notes: 'Grid telemetry add-on activated across European operations.'
      },
      {
        id: 'ACC-104',
        name: 'Apex Industrial Robotics',
        segment: 'Enterprise',
        currentRevenue: 180000,
        priorRevenue: 140000,
        renewalQuarter: 'Q2 2027',
        region: 'EMEA',
        status: 'Expanded',
        notes: 'Pilot program converted to annual production license.'
      },
      {
        id: 'ACC-105',
        name: 'Crestview Financial Partners',
        segment: 'Enterprise',
        currentRevenue: 135000,
        priorRevenue: 195000,
        renewalQuarter: 'Q4 2026',
        region: 'Americas',
        status: 'Contracted',
        notes: 'Downsized seat count following consolidation of wealth advisory unit.'
      },
      {
        id: 'ACC-106',
        name: 'Mirage Media Networks',
        segment: 'Mid-Market',
        currentRevenue: 115000,
        priorRevenue: 95000,
        renewalQuarter: 'Q1 2027',
        region: 'Americas',
        status: 'Expanded',
        notes: 'Increased ingestion capacity for live streaming infrastructure.'
      },
      {
        id: 'ACC-107',
        name: 'Aether Cloud Infrastructure',
        segment: 'Mid-Market',
        currentRevenue: 98000,
        priorRevenue: 98000,
        renewalQuarter: 'Q4 2026',
        region: 'APAC',
        status: 'Flat',
        notes: 'Steady usage tier under standard annual service contract.'
      },
      {
        id: 'ACC-108',
        name: 'Solis Energy Tech',
        segment: 'Mid-Market',
        currentRevenue: 78000,
        priorRevenue: 0,
        renewalQuarter: 'Q4 2027',
        region: 'APAC',
        status: 'New',
        notes: 'New account onboarding completed on October 9.'
      },
      {
        id: 'ACC-109',
        name: 'Triton Marine Dynamics',
        segment: 'Growth',
        currentRevenue: 52000,
        priorRevenue: 45000,
        renewalQuarter: 'Q2 2027',
        region: 'EMEA',
        status: 'Expanded',
        notes: 'Upgraded from starter tier to professional reporting suite.'
      },
      {
        id: 'ACC-110',
        name: 'Zeta Health Labs',
        segment: 'Growth',
        currentRevenue: 30500,
        priorRevenue: 52000,
        renewalQuarter: 'Q3 2026',
        region: 'Americas',
        status: 'Contracted',
        notes: 'Reduced module scope pending restructuring.'
      },
      {
        id: 'ACC-111',
        name: 'Cobalt Cyber Defense',
        segment: 'Growth',
        currentRevenue: 0,
        priorRevenue: 40000,
        renewalQuarter: 'Q3 2026',
        region: 'Americas',
        status: 'Churned',
        notes: 'Acquired by competitor; platform sunset notification received.'
      }
    ],
    // Total current sum = 285+240+195+180+135+115+98+78+52+30.5+0 = 1,408,500
    // Daily cumulative trend leading up to $1,408,500
    dailyTrend: [
      { day: 1, date: 'Oct 01', dailyRevenue: 42000, cumulativeRevenue: 42000 },
      { day: 5, date: 'Oct 05', dailyRevenue: 185000, cumulativeRevenue: 227000 },
      { day: 10, date: 'Oct 10', dailyRevenue: 290000, cumulativeRevenue: 517000 },
      { day: 15, date: 'Oct 15', dailyRevenue: 260000, cumulativeRevenue: 777000 },
      { day: 20, date: 'Oct 20', dailyRevenue: 245000, cumulativeRevenue: 1022000 },
      { day: 25, date: 'Oct 25', dailyRevenue: 216500, cumulativeRevenue: 1238500 },
      { day: 31, date: 'Oct 31', dailyRevenue: 170000, cumulativeRevenue: 1408500 },
    ]
  },
  '2026-09': {
    periodId: '2026-09',
    label: 'September 2026 (Prior Period)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    targetRevenue: 1250000,
    accounts: [
      {
        id: 'ACC-101',
        name: 'Northstar Global Logistics',
        segment: 'Enterprise',
        currentRevenue: 225000,
        priorRevenue: 210000,
        renewalQuarter: 'Q4 2026',
        region: 'Americas',
        status: 'Expanded'
      },
      {
        id: 'ACC-102',
        name: 'Vanguard Biopharma Systems',
        segment: 'Enterprise',
        currentRevenue: 240000,
        priorRevenue: 230000,
        renewalQuarter: 'Q1 2027',
        region: 'Americas',
        status: 'Expanded'
      },
      {
        id: 'ACC-103',
        name: 'Helios Renewable Grid',
        segment: 'Enterprise',
        currentRevenue: 155000,
        priorRevenue: 155000,
        renewalQuarter: 'Q3 2027',
        region: 'EMEA',
        status: 'Flat'
      },
      {
        id: 'ACC-104',
        name: 'Apex Industrial Robotics',
        segment: 'Enterprise',
        currentRevenue: 140000,
        priorRevenue: 120000,
        renewalQuarter: 'Q2 2027',
        region: 'EMEA',
        status: 'Expanded'
      },
      {
        id: 'ACC-105',
        name: 'Crestview Financial Partners',
        segment: 'Enterprise',
        currentRevenue: 195000,
        priorRevenue: 195000,
        renewalQuarter: 'Q4 2026',
        region: 'Americas',
        status: 'Flat'
      },
      {
        id: 'ACC-106',
        name: 'Mirage Media Networks',
        segment: 'Mid-Market',
        currentRevenue: 95000,
        priorRevenue: 90000,
        renewalQuarter: 'Q1 2027',
        region: 'Americas',
        status: 'Expanded'
      },
      {
        id: 'ACC-107',
        name: 'Aether Cloud Infrastructure',
        segment: 'Mid-Market',
        currentRevenue: 98000,
        priorRevenue: 98000,
        renewalQuarter: 'Q4 2026',
        region: 'APAC',
        status: 'Flat'
      },
      {
        id: 'ACC-109',
        name: 'Triton Marine Dynamics',
        segment: 'Growth',
        currentRevenue: 45000,
        priorRevenue: 45000,
        renewalQuarter: 'Q2 2027',
        region: 'EMEA',
        status: 'Flat'
      },
      {
        id: 'ACC-110',
        name: 'Zeta Health Labs',
        segment: 'Growth',
        currentRevenue: 52000,
        priorRevenue: 50000,
        renewalQuarter: 'Q3 2026',
        region: 'Americas',
        status: 'Flat'
      },
      {
        id: 'ACC-111',
        name: 'Cobalt Cyber Defense',
        segment: 'Growth',
        currentRevenue: 40000,
        priorRevenue: 40000,
        renewalQuarter: 'Q3 2026',
        region: 'Americas',
        status: 'Flat'
      }
    ],
    // Total September = 225+240+155+140+195+95+98+45+52+40 = 1,285,000
    dailyTrend: [
      { day: 1, date: 'Sep 01', dailyRevenue: 38000, cumulativeRevenue: 38000 },
      { day: 5, date: 'Sep 05', dailyRevenue: 165000, cumulativeRevenue: 203000 },
      { day: 10, date: 'Sep 10', dailyRevenue: 270000, cumulativeRevenue: 473000 },
      { day: 15, date: 'Sep 15', dailyRevenue: 240000, cumulativeRevenue: 713000 },
      { day: 20, date: 'Sep 20', dailyRevenue: 220000, cumulativeRevenue: 933000 },
      { day: 25, date: 'Sep 25', dailyRevenue: 192000, cumulativeRevenue: 1125000 },
      { day: 30, date: 'Sep 30', dailyRevenue: 160000, cumulativeRevenue: 1285000 },
    ]
  },
  '2026-08': {
    periodId: '2026-08',
    label: 'August 2026 (Baseline)',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    targetRevenue: 1200000,
    accounts: [
      {
        id: 'ACC-101',
        name: 'Northstar Global Logistics',
        segment: 'Enterprise',
        currentRevenue: 210000,
        priorRevenue: 200000,
        renewalQuarter: 'Q4 2026',
        region: 'Americas',
        status: 'Expanded'
      },
      {
        id: 'ACC-102',
        name: 'Vanguard Biopharma Systems',
        segment: 'Enterprise',
        currentRevenue: 230000,
        priorRevenue: 230000,
        renewalQuarter: 'Q1 2027',
        region: 'Americas',
        status: 'Flat'
      },
      {
        id: 'ACC-103',
        name: 'Helios Renewable Grid',
        segment: 'Enterprise',
        currentRevenue: 155000,
        priorRevenue: 150000,
        renewalQuarter: 'Q3 2027',
        region: 'EMEA',
        status: 'Expanded'
      },
      {
        id: 'ACC-104',
        name: 'Apex Industrial Robotics',
        segment: 'Enterprise',
        currentRevenue: 120000,
        priorRevenue: 110000,
        renewalQuarter: 'Q2 2027',
        region: 'EMEA',
        status: 'Expanded'
      },
      {
        id: 'ACC-105',
        name: 'Crestview Financial Partners',
        segment: 'Enterprise',
        currentRevenue: 195000,
        priorRevenue: 195000,
        renewalQuarter: 'Q4 2026',
        region: 'Americas',
        status: 'Flat'
      },
      {
        id: 'ACC-106',
        name: 'Mirage Media Networks',
        segment: 'Mid-Market',
        currentRevenue: 90000,
        priorRevenue: 85000,
        renewalQuarter: 'Q1 2027',
        region: 'Americas',
        status: 'Expanded'
      },
      {
        id: 'ACC-107',
        name: 'Aether Cloud Infrastructure',
        segment: 'Mid-Market',
        currentRevenue: 98000,
        priorRevenue: 95000,
        renewalQuarter: 'Q4 2026',
        region: 'APAC',
        status: 'Expanded'
      },
      {
        id: 'ACC-109',
        name: 'Triton Marine Dynamics',
        segment: 'Growth',
        currentRevenue: 45000,
        priorRevenue: 40000,
        renewalQuarter: 'Q2 2027',
        region: 'EMEA',
        status: 'Expanded'
      },
      {
        id: 'ACC-110',
        name: 'Zeta Health Labs',
        segment: 'Growth',
        currentRevenue: 50000,
        priorRevenue: 48000,
        renewalQuarter: 'Q3 2026',
        region: 'Americas',
        status: 'Expanded'
      },
      {
        id: 'ACC-111',
        name: 'Cobalt Cyber Defense',
        segment: 'Growth',
        currentRevenue: 40000,
        priorRevenue: 40000,
        renewalQuarter: 'Q3 2026',
        region: 'Americas',
        status: 'Flat'
      }
    ],
    // Total August = 210+230+155+120+195+90+98+45+50+40 = 1,233,000
    dailyTrend: [
      { day: 1, date: 'Aug 01', dailyRevenue: 35000, cumulativeRevenue: 35000 },
      { day: 5, date: 'Aug 05', dailyRevenue: 160000, cumulativeRevenue: 195000 },
      { day: 10, date: 'Aug 10', dailyRevenue: 260000, cumulativeRevenue: 455000 },
      { day: 15, date: 'Aug 15', dailyRevenue: 235000, cumulativeRevenue: 690000 },
      { day: 20, date: 'Aug 20', dailyRevenue: 210000, cumulativeRevenue: 900000 },
      { day: 25, date: 'Aug 25', dailyRevenue: 185000, cumulativeRevenue: 1085000 },
      { day: 31, date: 'Aug 31', dailyRevenue: 148000, cumulativeRevenue: 1233000 },
    ]
  }
};
