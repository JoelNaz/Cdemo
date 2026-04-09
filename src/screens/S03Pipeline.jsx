import { useEffect } from 'react';
import { AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, Cell } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Pipeline, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ttStyle, CHART_HEIGHT, gridProps, xAxisProps, yAxisProps, activeDot, legendWrapperStyle, chartCardClass, chartCardStyle, GradFill } from '../utils/chartUtils';

const secPriTrend = [
  { month: 'Oct', ratio: 0.87 }, { month: 'Nov', ratio: 0.84 }, { month: 'Dec', ratio: 0.80 },
  { month: 'Jan', ratio: 0.77 }, { month: 'Feb', ratio: 0.73 }, { month: 'Mar', ratio: 0.69 },
];

const kpis = [
  { label: 'Sec:Pri Ratio', value: 0.69, format: 'ratio', delta: -20.7, deltaUnit: '% vs SPLY', comparison: 'SPLY: 0.87 | Threshold: 0.60' },
  { label: 'DMS:Pri', value: 0.71, format: 'ratio', delta: -15, deltaUnit: '%', comparison: 'SPLY: 0.84' },
  { label: 'Days Stock', value: 38, delta: 12, deltaUnit: ' days above norm', comparison: 'Norm: 26 days' },
  { label: 'OFR', value: 84.2, format: 'pct', delta: -7.4, deltaUnit: 'pp', comparison: 'SPLY: 91.6%' },
  { label: 'Billing Frequency', value: 3.1, delta: -0.9, deltaUnit: ' days', comparison: 'SPLY: 4.0 days' },
  { label: 'SALY Primary', value: 8, format: 'pct', delta: 8, deltaUnit: '%', comparison: 'Primary up +8%' },
];

const relevantFindings = driftFindings.filter(f => f.target_screen === 'S-03');

const tableColumns = [
  { key: 'name', label: 'Distributor' },
  { key: 'district', label: 'District' },
  { key: 'primary_value', label: 'Primary ₹', format: v => `₹${(v / 100000).toFixed(1)}L` },
  { key: 'secondary_value', label: 'Secondary ₹', format: v => `₹${(v / 100000).toFixed(1)}L` },
  { key: 'pipeline_ratio', label: 'Sec:Pri', format: (v) => (
    <span style={{ color: v < 0.60 ? 'var(--critical)' : v < 0.75 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>{v.toFixed(2)}</span>
  )},
  { key: 'days_stock', label: 'Days Stock', format: v => <span style={{ color: v > 30 ? 'var(--warning)' : 'inherit' }}>{v}</span> },
  { key: 'outstanding_vs_primary', label: 'Outstanding:Primary', format: v => v ? `${v}%` : '-' },
  { key: 'saly_secondary', label: 'SALY Sec', format: v => <span style={{ color: v < 0 ? 'var(--critical)' : 'var(--success)' }}>{v > 0 ? '+' : ''}{v}%</span> },
];


export default function S03Pipeline() {
  const { trackScreenVisit, setChatOpen } = useApp();
  useEffect(() => { trackScreenVisit('S-03'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-03</div>
          <h2 className="screen-title">Pipeline Health</h2>
          <div className="screen-subtitle">Sec:Pri ratio, pipeline stuffing detection, distributor view · North-2 · March 2026</div>
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
          <div className="section-label">Sec:Pri Trend — 6 Months</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={secPriTrend} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                <defs><GradFill id="gradRatio" color="var(--warning)" startOpacity={0.28} /></defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...xAxisProps} />
                <YAxis domain={[0.5, 1.0]} {...yAxisProps} tickFormatter={v => v.toFixed(2)} />
                <Tooltip contentStyle={ttStyle} formatter={v => [v.toFixed(2), 'Sec:Pri']} />
                <ReferenceLine y={0.60} stroke="var(--critical)" strokeDasharray="4 4" label={{ value: 'Threshold 0.60', position: 'insideTopRight', fill: 'var(--critical)', fontSize: 10 }} />
                <Area type="monotone" dataKey="ratio" stroke="var(--warning)" strokeWidth={2.5} fill="url(#gradRatio)" dot={{ fill: 'var(--warning)', r: 3.5, strokeWidth: 0 }} activeDot={activeDot('var(--warning)')} name="Sec:Pri" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="section-label">Primary vs Secondary — Stuffing Detection</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, left: -10, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" strokeOpacity={0.45} />
                <XAxis dataKey="primary_value" name="Primary ₹" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} label={{ value: 'Primary →', position: 'insideBottom', offset: -4, fill: 'var(--text-muted)', fontSize: 10 }} />
                <YAxis dataKey="pipeline_ratio" name="Sec:Pri" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} cursor={{ strokeDasharray: '3 3' }} formatter={(v, name) => [name === 'Sec:Pri' ? v.toFixed(2) : `₹${(v / 100000).toFixed(1)}L`, name]} />
                <ReferenceLine y={0.60} stroke="var(--critical)" strokeDasharray="4 3" label={{ value: 'Threshold', position: 'insideTopRight', fill: 'var(--critical)', fontSize: 10 }} />
                <Scatter data={l2Pipeline} shape={(props) => {
                  const { cx, cy, payload } = props;
                  const isRisk = payload.pipeline_ratio < 0.60;
                  return <circle cx={cx} cy={cy} r={isRisk ? 7 : 5} fill={isRisk ? 'var(--critical)' : 'var(--accent)'} opacity={0.85} stroke={isRisk ? 'var(--critical)' : 'transparent'} strokeWidth={1} strokeOpacity={0.4} />;
                }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>Distributor-Level Pipeline</div>
      <DataTable columns={tableColumns} data={l2Pipeline} />
    </div>
  );
}
