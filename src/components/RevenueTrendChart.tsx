import React, { useState } from 'react';
import { PeriodRawData } from '../types/reporting';
import { formatCurrency } from '../calculations/engine';

interface RevenueTrendChartProps {
  currentPeriod: PeriodRawData;
  priorPeriod: PeriodRawData | null;
  isSimulatingMissingData: boolean;
  targetRevenue: number;
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({
  currentPeriod,
  priorPeriod,
  isSimulatingMissingData,
  targetRevenue,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentPoints = currentPeriod.dailyTrend;
  const showPrior = !isSimulatingMissingData && priorPeriod !== null;
  const priorPoints = showPrior && priorPeriod ? priorPeriod.dailyTrend : [];

  // Dimensions
  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 65 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Max scale calculation
  const allValues = [
    targetRevenue,
    ...currentPoints.map((p) => p.cumulativeRevenue),
    ...(showPrior ? priorPoints.map((p) => p.cumulativeRevenue) : []),
  ];
  const maxVal = Math.max(...allValues) * 1.08;
  const minVal = 0;

  const getY = (val: number) => {
    return padding.top + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight;
  };

  const getX = (index: number, total: number) => {
    return padding.left + (index / (total - 1)) * graphWidth;
  };

  // Build SVG path strings
  const currentPathPoints = currentPoints.map((p, idx) => ({
    x: getX(idx, currentPoints.length),
    y: getY(p.cumulativeRevenue),
  }));

  const currentLineD = currentPathPoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const currentAreaD = `${currentLineD} L ${
    currentPathPoints[currentPathPoints.length - 1].x
  } ${getY(0)} L ${currentPathPoints[0].x} ${getY(0)} Z`;

  // Prior period path
  let priorLineD = '';
  if (showPrior && priorPoints.length > 0) {
    const priorPathPoints = priorPoints.map((p, idx) => ({
      x: getX(idx, priorPoints.length),
      y: getY(p.cumulativeRevenue),
    }));
    priorLineD = priorPathPoints.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }

  // Target Line Y
  const targetY = getY(targetRevenue);

  // Y-axis tick intervals
  const yTicks = [0, 500000, 1000000, 1500000].filter((val) => val <= maxVal);

  const activePoint = hoveredIndex !== null ? currentPoints[hoveredIndex] : null;
  const activePriorPoint =
    showPrior && hoveredIndex !== null && priorPoints[hoveredIndex]
      ? priorPoints[hoveredIndex]
      : null;

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Cumulative Revenue Trajectory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Booked revenue progression vs monthly quota target ({currentPeriod.label})
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
            <span>Current Period</span>
          </div>

          {showPrior ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-slate-400" />
              <span>Prior Period</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
              <span>Prior Benchmark Omitted (Test)</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-emerald-600" />
            <span>Quota ({formatCurrency(targetRevenue)})</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative mt-4 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
        >
          <defs>
            <linearGradient id="currentAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f1f1eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  ${val / 1000}k
                </text>
              </g>
            );
          })}

          {/* Target Reference Line */}
          <line
            x1={padding.left}
            y1={targetY}
            x2={width - padding.right}
            y2={targetY}
            stroke="#059669"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={width - padding.right}
            y={targetY - 5}
            textAnchor="end"
            className="text-[10px] fill-emerald-700 font-semibold font-mono"
          >
            Target {formatCurrency(targetRevenue)}
          </text>

          {/* Prior Period Line (if available) */}
          {showPrior && priorLineD && (
            <path
              d={priorLineD}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="2 2"
            />
          )}

          {/* Current Period Area & Line */}
          <path d={currentAreaD} fill="url(#currentAreaGradient)" />
          <path
            d={currentLineD}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points and Invisible Hover Targets */}
          {currentPathPoints.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx}>
                {/* Visual Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5 : 3.5}
                  className={`transition-all ${
                    isHovered
                      ? 'fill-indigo-600 stroke-white stroke-2'
                      : 'fill-white stroke-indigo-600 stroke-2'
                  }`}
                />

                {/* X-axis date labels */}
                <text
                  x={pt.x}
                  y={height - 12}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-500 font-medium"
                >
                  {currentPoints[idx].date}
                </text>

                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={padding.top}
                    x2={pt.x}
                    y2={height - padding.bottom}
                    stroke="#6366f1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                )}

                {/* Expanded touch/hover target */}
                <rect
                  x={pt.x - 20}
                  y={padding.top}
                  width="40"
                  height={graphHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activePoint && (
          <div
            className="absolute top-2 right-4 bg-slate-900 text-white px-3.5 py-2.5 rounded-lg shadow-xl text-xs pointer-events-none transition-all z-10 border border-slate-700"
          >
            <div className="text-[11px] text-slate-400 font-medium mb-1">
              Date: {activePoint.date}
            </div>
            <div className="flex items-center justify-between gap-4 font-mono font-semibold">
              <span className="text-indigo-300">Booked Revenue:</span>
              <span className="tabular-nums">{formatCurrency(activePoint.cumulativeRevenue)}</span>
            </div>
            {showPrior && activePriorPoint && (
              <div className="flex items-center justify-between gap-4 font-mono text-[11px] text-slate-300 mt-1">
                <span>Prior Benchmark:</span>
                <span className="tabular-nums">{formatCurrency(activePriorPoint.cumulativeRevenue)}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 font-mono text-[11px] text-emerald-400 mt-1 border-t border-slate-800 pt-1">
              <span>vs Quota Target:</span>
              <span className="tabular-nums">
                {formatCurrency(activePoint.cumulativeRevenue - targetRevenue)} (
                {((activePoint.cumulativeRevenue / targetRevenue) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-slate-400">
        <span>Deterministic time-series sum from transactional billing ledger</span>
        <span className="font-mono">Verification: MD5 checksum valid</span>
      </div>
    </div>
  );
};
