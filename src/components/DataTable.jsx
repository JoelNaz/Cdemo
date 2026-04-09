import { useState, useMemo } from 'react';

export default function DataTable({ columns, data, highlightRules = {} }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (col) => {
    if (col.format) return;
    if (sortKey === col.key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div
      className="overflow-x-auto mb-5 border border-[var(--border)] rounded-xl overflow-hidden"
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      <table className="w-full border-collapse text-[12.5px]">
        <thead>
          <tr>
            {columns.map((col, i) => {
              const sortable = !col.format;
              const isActive = sortKey === col.key;
              return (
                <th
                  key={i}
                  onClick={() => handleSort(col)}
                  className={`text-left px-3.5 py-[11px] bg-[var(--bg-tertiary)] text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-[0.9px] border-b border-[var(--border)] whitespace-nowrap select-none ${sortable ? 'cursor-pointer hover:text-[var(--text-primary)]' : ''} transition-colors`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortable && (
                      <span className="flex flex-col leading-none" style={{ opacity: isActive ? 1 : 0.3 }}>
                        <span style={{ color: isActive && sortDir === 'asc' ? 'var(--accent)' : undefined, fontSize: 7, lineHeight: 1 }}>▲</span>
                        <span style={{ color: isActive && sortDir === 'desc' ? 'var(--accent)' : undefined, fontSize: 7, lineHeight: 1 }}>▼</span>
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, ri) => (
            <tr key={ri} className="group">
              {columns.map((col, ci) => {
                const val = row[col.key];
                let cls = ci === 0
                  ? 'text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-secondary)]';

                if (highlightRules[col.key]) {
                  const rule = highlightRules[col.key];
                  if (rule.negative && val < rule.negative) cls = 'text-[var(--critical)] font-bold';
                  if (rule.positive && val > rule.positive) cls = 'text-[var(--success)] font-bold';
                  if (rule.highlight && rule.highlight(val)) cls = 'text-[var(--accent)] font-bold';
                }

                return (
                  <td
                    key={ci}
                    className={`px-3.5 py-2.5 group-hover:bg-[var(--bg-hover)] transition-colors ${ri < sorted.length - 1 ? 'border-b border-[var(--border)]' : ''} ${cls}`}
                  >
                    {col.format ? col.format(val, row) : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
