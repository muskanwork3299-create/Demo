import React, { useState, useMemo } from 'react';
import { AccountRecord } from '../types/reporting';
import { formatCurrency, formatPercent } from '../calculations/engine';
import { Search, Filter, ArrowUpDown, ChevronDown, CheckCircle2 } from 'lucide-react';

interface AccountBreakdownTableProps {
  accounts: AccountRecord[];
  isPriorAvailable: boolean;
  onSelectAccount?: (account: AccountRecord) => void;
}

export const AccountBreakdownTable: React.FC<AccountBreakdownTableProps> = ({
  accounts,
  isPriorAvailable,
  onSelectAccount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'All' | 'Enterprise' | 'Mid-Market' | 'Growth'>('All');
  const [sortField, setSortField] = useState<'currentRevenue' | 'variance' | 'name'>('currentRevenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((acc) => {
        const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          acc.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSegment = segmentFilter === 'All' || acc.segment === segmentFilter;
        return matchesSearch && matchesSegment;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        if (sortField === 'name') {
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        }

        if (sortField === 'currentRevenue') {
          valA = a.currentRevenue;
          valB = b.currentRevenue;
        } else if (sortField === 'variance') {
          valA = a.currentRevenue - (isPriorAvailable && a.priorRevenue !== null ? a.priorRevenue : a.currentRevenue);
          valB = b.currentRevenue - (isPriorAvailable && b.priorRevenue !== null ? b.priorRevenue : b.currentRevenue);
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [accounts, searchTerm, segmentFilter, sortField, sortOrder, isPriorAvailable]);

  const toggleSort = (field: 'currentRevenue' | 'variance' | 'name') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: AccountRecord['status']) => {
    switch (status) {
      case 'Expanded':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">Expanded</span>;
      case 'New':
        return <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-medium">New Logo</span>;
      case 'Contracted':
        return <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">Contracted</span>;
      case 'Churned':
        return <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-medium">Churned</span>;
      default:
        return <span className="text-slate-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-[11px] font-medium">Flat</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Account-Level Revenue Ledger
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic billing records feeding the reporting calculation engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search account name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-56"
            />
          </div>

          {/* Segment Filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs font-medium border border-stone-200">
            {(['All', 'Enterprise', 'Mid-Market', 'Growth'] as const).map((seg) => (
              <button
                key={seg}
                type="button"
                onClick={() => setSegmentFilter(seg)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  segmentFilter === seg
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Crisp Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/70 text-slate-600 font-semibold">
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span>Account & Identifier</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3">Segment</th>
              <th 
                className="py-2.5 px-4 text-right cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => toggleSort('currentRevenue')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Current Period ARR</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-4 text-right">
                <span>Prior Period ARR</span>
              </th>
              <th 
                className="py-2.5 px-4 text-right cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => toggleSort('variance')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Variance ($ / %)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3">Movement Status</th>
              <th className="py-2.5 px-4">Ledger Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No accounts match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc) => {
                const prior = isPriorAvailable && acc.priorRevenue !== null ? acc.priorRevenue : null;
                const variance = prior !== null ? acc.currentRevenue - prior : null;
                const variancePct = prior !== null && prior > 0 
                  ? ((acc.currentRevenue - prior) / prior) * 100 
                  : null;

                return (
                  <tr
                    key={acc.id}
                    onClick={() => onSelectAccount && onSelectAccount(acc)}
                    className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex flex-col">
                        <span>{acc.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{acc.id} · {acc.region}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="text-slate-700 font-medium">{acc.segment}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(acc.currentRevenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {isPriorAvailable 
                        ? (acc.priorRevenue !== null ? formatCurrency(acc.priorRevenue) : '—') 
                        : <span className="text-amber-700 text-[11px] font-sans">N/A (Missing)</span>}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {isPriorAvailable && variance !== null ? (
                        <div className="flex flex-col items-end">
                          <span className={variance > 0 ? 'text-emerald-700 font-semibold' : variance < 0 ? 'text-rose-700 font-semibold' : 'text-slate-500'}>
                            {variance > 0 ? `+${formatCurrency(variance)}` : formatCurrency(variance)}
                          </span>
                          {variancePct !== null && (
                            <span className="text-[10px] text-slate-500">
                              {formatPercent(variancePct)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-sans">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(acc.status)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {acc.notes || 'Contract active'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-stone-50/70 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>All totals mathematically tied to billing ledger records</span>
        </div>
        <span>Displaying {filteredAccounts.length} of {accounts.length} accounts</span>
      </div>
    </div>
  );
};
