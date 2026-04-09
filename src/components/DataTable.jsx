export default function DataTable({ columns, data, highlightRules = {} }) {
  return (
    <div
      className="overflow-x-auto mb-5 border border-[var(--border)] rounded-xl overflow-hidden"
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      <table className="w-full border-collapse text-[12.5px]">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left px-3.5 py-[11px] bg-[var(--bg-tertiary)] text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-[0.9px] border-b border-[var(--border)] whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
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
                    className={`px-3.5 py-2.5 group-hover:bg-[var(--bg-hover)] transition-colors ${ri < data.length - 1 ? 'border-b border-[var(--border)]' : ''} ${cls}`}
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
