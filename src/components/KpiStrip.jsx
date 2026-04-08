export default function KpiStrip({ kpis }) {
  return (
    <div className="kpi-strip">
      {kpis.map((kpi, i) => (
        <div className="kpi-card" key={i}>
          <div className="kpi-label">{kpi.label}</div>
          <div className="kpi-value">
            {kpi.prefix || ''}{typeof kpi.value === 'number' && kpi.value > 100000
              ? `${(kpi.value / 10000000).toFixed(1)} Cr`
              : kpi.format === 'ratio' ? kpi.value.toFixed(2)
              : kpi.format === 'pct' ? `${kpi.value}%`
              : kpi.value}
            {kpi.suffix || ''}
          </div>
          {kpi.delta !== undefined && (
            <div className={`kpi-delta ${kpi.delta < 0 ? 'negative' : 'positive'}`}>
              {kpi.delta > 0 ? '+' : ''}{kpi.delta}{kpi.deltaUnit || ''}
            </div>
          )}
          {kpi.comparison && (
            <div className="kpi-comparison">{kpi.comparison}</div>
          )}
          {kpi.mtdCompletion !== undefined && (
            <div className="mtd-bar">
              <div className="mtd-bar-fill" style={{ width: `${kpi.mtdCompletion}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
