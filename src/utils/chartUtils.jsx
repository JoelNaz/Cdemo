export const ttStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-light)',
  borderRadius: 10,
  color: 'var(--text-primary)',
  fontSize: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
  padding: '10px 14px',
};

export const CHART_HEIGHT = 260;

export const gridProps = {
  strokeDasharray: '3 4',
  stroke: 'var(--border)',
  strokeOpacity: 0.45,
  vertical: false,
};

export const xAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: 'var(--text-muted)', fontSize: 11 },
};

export const yAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: 'var(--text-muted)', fontSize: 11 },
};

export const activeDot = (color) => ({ r: 6, fill: color, stroke: 'var(--bg-card)', strokeWidth: 2, filter: `drop-shadow(0 0 4px ${color}80)` });

export const legendWrapperStyle = {
  fontSize: 11,
  color: 'var(--text-secondary)',
  paddingTop: 6,
};

export const chartCardClass = 'bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]';
export const chartCardStyle = (h = CHART_HEIGHT) => ({ height: h, boxShadow: 'var(--card-shadow)' });

export function GradFill({ id, color, startOpacity = 0.28, endOpacity = 0 }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={startOpacity} />
      <stop offset="95%" stopColor={color} stopOpacity={endOpacity} />
    </linearGradient>
  );
}
