export default function KpiStrip({ kpis, onMetricRightClick }) {
  return (
    <div
      className="grid gap-2.5 mb-[22px]"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(172px, 1fr))' }}
    >
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 transition-[border-color,box-shadow] hover:border-[var(--border-light)] select-none"
          style={{ boxShadow: 'var(--card-shadow)', cursor: onMetricRightClick ? 'context-menu' : 'default' }}
          onContextMenu={onMetricRightClick ? (e) => { e.preventDefault(); onMetricRightClick(kpi, e); } : undefined}
        >
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.9px] mb-2">
            {kpi.label}
          </div>
          <div className="text-[27px] font-extrabold tracking-tight leading-none text-[var(--text-primary)] [font-variant-numeric:tabular-nums]">
            {kpi.prefix || ''}
            {typeof kpi.value === 'number' && kpi.value > 100000
              ? `${(kpi.value / 10000000).toFixed(1)} Cr`
              : kpi.format === 'ratio' ? kpi.value.toFixed(2)
              : kpi.format === 'pct' ? `${kpi.value}%`
              : kpi.value}
            {kpi.suffix || ''}
          </div>
          {kpi.delta !== undefined && kpi.delta !== null && (
            <div className={`text-[11.5px] font-bold mt-1.5 ${kpi.delta < 0 ? 'text-[var(--critical)]' : 'text-[var(--success)]'}`}>
              {kpi.delta > 0 ? '+' : ''}{kpi.delta}{kpi.deltaUnit || ''}
            </div>
          )}
          {kpi.comparison && (
            <div className="text-[10.5px] text-[var(--text-muted)] mt-0.5">{kpi.comparison}</div>
          )}
          {kpi.mtdCompletion !== undefined && (
            <div className="h-[3px] bg-[var(--bg-tertiary)] rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-500"
                style={{ width: `${kpi.mtdCompletion}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
