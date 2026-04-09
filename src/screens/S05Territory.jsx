import { useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, CartesianGrid, Legend } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Territory, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ttStyle, CHART_HEIGHT, gridProps, xAxisProps, yAxisProps, activeDot, legendWrapperStyle, chartCardClass, chartCardStyle, GradFill } from '../utils/chartUtils';

const mauTrend = [
  { month: 'Oct', mau: 86, pjp: 79 }, { month: 'Nov', mau: 84, pjp: 77 },
  { month: 'Dec', mau: 83, pjp: 76 }, { month: 'Jan', mau: 81, pjp: 74 },
  { month: 'Feb', mau: 80, pjp: 72 }, { month: 'Mar', mau: 78, pjp: 68 },
];

const kpis = [
  { label: 'Visit Compliance', value: 71.4, format: 'pct', delta: -12.6, deltaUnit: 'pp vs target', comparison: 'Target: 84%' },
  { label: 'Productive Calls', value: 58.9, format: 'pct', delta: -11.1, deltaUnit: 'pp', comparison: 'Target: 70%' },
  { label: 'MAU', value: 78, format: 'pct', delta: -8, deltaUnit: 'pp vs SPLY', comparison: 'SPLY: 86%' },
  { label: 'PJP MAU', value: 68, format: 'pct', delta: -11, deltaUnit: 'pp', comparison: 'SPLY: 79%' },
  { label: 'OFR', value: 84.2, format: 'pct', delta: -7.4, deltaUnit: 'pp', comparison: 'SPLY: 91.6%' },
  { label: 'Avg Lines/Call', value: 2.4, delta: -0.6, deltaUnit: ' lines', comparison: 'Target: 3.0' },
];

const relevantFindings = driftFindings.filter(f => f.target_screen === 'S-05');

const tableColumns = [
  { key: 'beat_id', label: 'Beat' },
  { key: 'district', label: 'District' },
  { key: 'planned_outlets', label: 'Planned' },
  { key: 'actual_visited', label: 'Visited' },
  { key: 'visit_compliance', label: 'Compliance%', format: v => (
    <span style={{ color: v < 60 ? 'var(--critical)' : v < 75 ? 'var(--warning)' : 'var(--success)' }}>{v.toFixed(1)}%</span>
  )},
  { key: 'productive_calls', label: 'Productive%', format: v => `${v}%` },
  { key: 'mau', label: 'MAU%', format: v => `${v}%` },
  { key: 'beat_revenue', label: 'Revenue', format: v => `₹${(v / 100000).toFixed(1)}L` },
  { key: 'beat_revenue_vs_design', label: 'vs Design', format: v => <span style={{ color: v < -15 ? 'var(--critical)' : v < 0 ? 'var(--warning)' : 'var(--success)' }}>{v > 0 ? '+' : ''}{v}%</span> },
];


export default function S05Territory() {
  const { trackScreenVisit, setChatOpen } = useApp();
  useEffect(() => { trackScreenVisit('S-05'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-05</div>
          <h2 className="screen-title">Territory & SFA Health</h2>
          <div className="screen-subtitle">Visit compliance, MAU, beat productivity · North-2 · March 2026</div>
        </div>
        <button className="ask-ai-btn" onClick={() => setChatOpen(true)}>Ask AI</button>
      </div>

      <KpiStrip kpis={kpis} />

      {relevantFindings.length > 0 && (
        <div className="mb-5">
          <div className="section-label">Active Findings</div>
          {relevantFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
        </div>
      )}

      <div className="two-col">
        <div>
          <div className="section-label">MAU &amp; PJP MAU Trend — 6 Months</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mauTrend} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <GradFill id="gradMau" color="var(--accent)" startOpacity={0.25} />
                  <GradFill id="gradPjp" color="var(--info)" startOpacity={0.2} />
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...xAxisProps} />
                <YAxis domain={[55, 95]} {...yAxisProps} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v}%`, '']} />
                <Legend wrapperStyle={legendWrapperStyle} iconType="circle" iconSize={8} />
                <ReferenceLine y={80} stroke="var(--border-light)" strokeDasharray="4 3" />
                <Area type="monotone" dataKey="mau" stroke="var(--accent)" strokeWidth={2.5} fill="url(#gradMau)" dot={{ r: 3.5, fill: 'var(--accent)', strokeWidth: 0 }} activeDot={activeDot('var(--accent)')} name="MAU" />
                <Area type="monotone" dataKey="pjp" stroke="var(--info)" strokeWidth={2.5} fill="url(#gradPjp)" dot={{ r: 3.5, fill: 'var(--info)', strokeWidth: 0 }} activeDot={activeDot('var(--info)')} name="PJP MAU" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="section-label">Beat Compliance vs Target</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={l2Territory} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="beat_name" {...xAxisProps} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                <YAxis {...yAxisProps} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v}%`, 'Compliance']} />
                <ReferenceLine y={84} stroke="var(--success)" strokeDasharray="4 3" label={{ value: 'Target 84%', position: 'insideTopRight', fill: 'var(--success)', fontSize: 10 }} />
                <Bar dataKey="visit_compliance" radius={6} maxBarSize={32}>
                  {l2Territory.map((d, i) => (
                    <Cell key={i} fill={d.visit_compliance < 60 ? 'var(--critical)' : d.visit_compliance < 75 ? 'var(--warning)' : 'var(--success)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>Beat-Level Breakdown</div>
      <DataTable columns={tableColumns} data={l2Territory} />
    </div>
  );
}
