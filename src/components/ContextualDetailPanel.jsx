import { useEffect } from 'react';
import { X, TrendingDown, TrendingUp, MapPin, Clock, GitBranch } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine, CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { kpiContextualData } from '../data/mockData';
import { ttStyle, gridProps, xAxisProps, yAxisProps, GradFill } from '../utils/chartUtils';

const statusColor = {
  ok: 'var(--success)',
  warn: 'var(--warning)',
  critical: 'var(--critical)',
};

function SpatialRow({ item, unit }) {
  const color = statusColor[item.status] || 'var(--info)';
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <MapPin className="w-3 h-3 flex-shrink-0" style={{ color }} />
        <span className="text-[11.5px] font-medium text-[var(--text-secondary)] truncate">{item.geo}</span>
      </div>
      <span className="text-[12px] font-bold text-[var(--text-primary)] [font-variant-numeric:tabular-nums]">
        {typeof item.value === 'number' && unit === '%'
          ? `${item.value}%`
          : typeof item.value === 'number' && !unit
          ? item.value.toFixed(2)
          : item.value}
      </span>
      <span
        className="text-[10.5px] font-bold min-w-[48px] text-right [font-variant-numeric:tabular-nums]"
        style={{ color: item.delta < 0 ? 'var(--critical)' : 'var(--success)' }}
      >
        {item.delta > 0 ? '+' : ''}{item.delta}{unit === '%' ? 'pp' : ''}
      </span>
    </div>
  );
}

function CausalRow({ item }) {
  const isDown = item.direction === 'down';
  return (
    <div className="flex items-center gap-2.5 py-1.5 border-b border-[var(--border)] last:border-0">
      <div className="flex-1 text-[11.5px] text-[var(--text-secondary)]">{item.driver}</div>
      <div className="flex items-center gap-1">
        {isDown
          ? <TrendingDown className="w-3.5 h-3.5 text-[var(--critical)]" />
          : <TrendingUp className="w-3.5 h-3.5 text-[var(--success)]" />}
        <span
          className="text-[11px] font-bold [font-variant-numeric:tabular-nums]"
          style={{ color: isDown ? 'var(--critical)' : 'var(--success)' }}
        >
          {item.contribution > 0 ? '+' : ''}{item.contribution}
        </span>
      </div>
      <div className="w-24 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${Math.min(Math.abs(item.contribution) * 10, 100)}%`,
            background: isDown ? 'var(--critical)' : 'var(--success)',
          }}
        />
      </div>
    </div>
  );
}

export default function ContextualDetailPanel() {
  const { contextPanel, closeContextPanel } = useApp();
  const data = contextPanel ? kpiContextualData[contextPanel] : null;

  useEffect(() => {
    if (!contextPanel) return;
    const handle = (e) => { if (e.key === 'Escape') closeContextPanel(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [contextPanel, closeContextPanel]);

  if (!contextPanel) return null;

  const isOpen = !!contextPanel;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[200] transition-opacity"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={closeContextPanel}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 w-[480px] max-w-[95vw] bg-[var(--bg-secondary)] border-l border-[var(--border)] z-[201] flex flex-col overflow-hidden"
        style={{ boxShadow: '-8px 0 40px rgba(0,0,0,0.28)', transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-start gap-3 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[1.5px] mb-1">
              Contextual Detail
            </div>
            <div className="text-[16px] font-extrabold text-[var(--text-primary)] tracking-tight">
              {data ? data.metric : contextPanel}
            </div>
            {data && (
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{data.description}</div>
            )}
          </div>
          <button
            onClick={closeContextPanel}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors flex-shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!data ? (
          <div className="flex-1 flex items-center justify-center text-[12px] text-[var(--text-muted)]">
            No contextual data available for this metric.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

            {/* Current vs SPLY summary */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: 'Current', value: data.current, highlight: true },
                { label: 'SPLY', value: data.sply },
                { label: 'Δ vs SPLY', value: data.delta, isDelta: true },
              ].map(({ label, value, highlight, isDelta }) => (
                <div
                  key={label}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-center"
                  style={{ boxShadow: 'var(--card-shadow)' }}
                >
                  <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.8px] mb-1">{label}</div>
                  <div
                    className="text-[18px] font-extrabold [font-variant-numeric:tabular-nums] leading-none"
                    style={{
                      color: isDelta
                        ? (value < 0 ? 'var(--critical)' : 'var(--success)')
                        : highlight ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {isDelta && value > 0 ? '+' : ''}{value}{data.unit === '%' ? '%' : ''}
                  </div>
                </div>
              ))}
            </div>

            {/* Temporal trend */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3 h-3 text-[var(--accent)]" />
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.9px]">Temporal — 6 Month Trend</span>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3.5" style={{ height: 160, boxShadow: 'var(--card-shadow)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.temporal} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <defs><GradFill id="ctxGrad" color="var(--accent)" startOpacity={0.25} /></defs>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="month" {...xAxisProps} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                    <YAxis {...yAxisProps} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                    <Tooltip contentStyle={ttStyle} />
                    <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2.5} fill="url(#ctxGrad)" dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }} name={data.metric} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spatial breakdown */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin className="w-3 h-3 text-[var(--accent)]" />
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.9px]">Spatial — District / Entity Breakdown</span>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-1" style={{ boxShadow: 'var(--card-shadow)' }}>
                {data.spatial.map((item, i) => (
                  <SpatialRow key={i} item={item} unit={data.unit} />
                ))}
              </div>
            </div>

            {/* Causal decomposition */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <GitBranch className="w-3 h-3 text-[var(--accent)]" />
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.9px]">Causal — What Drove This</span>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-1" style={{ boxShadow: 'var(--card-shadow)' }}>
                {data.causal.map((item, i) => (
                  <CausalRow key={i} item={item} />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
