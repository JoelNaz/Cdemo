import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Promo, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';

const waterfallData = [
  { name: 'Baseline', value: 4200000, fill: 'var(--info)' },
  { name: 'Target Uplift', value: 630000, fill: 'var(--success)' },
  { name: 'Actual Uplift', value: 84000, fill: 'var(--warning)' },
  { name: 'Shortfall', value: -546000, fill: 'var(--critical)' },
];

const kpis = [
  { label: 'Active Schemes', value: 3, comparison: 'Across 8 districts' },
  { label: 'Total Scheme Spend', value: 1250000, delta: null, comparison: 'Budget: ₹15L' },
  { label: 'Avg Uplift', value: 5, format: 'pct', delta: -10, deltaUnit: 'pp vs target', comparison: 'Target: 15%' },
  { label: 'Avg ROI', value: 0.7, format: 'ratio', delta: null, comparison: 'Target: >1.5x' },
  { label: 'Eligible Outlets', value: 840, comparison: 'Across active schemes' },
  { label: 'Participation Rate', value: 30, format: 'pct', delta: -30, deltaUnit: 'pp vs target', comparison: 'Target: 60%' },
];

const relevantFindings = driftFindings.filter(f => f.target_screen === 'S-06');

const tableColumns = [
  { key: 'name', label: 'Scheme' },
  { key: 'district', label: 'District' },
  { key: 'baseline_value', label: 'Baseline ₹', format: v => `₹${(v / 100000).toFixed(1)}L` },
  { key: 'actual_value', label: 'Actual ₹', format: v => `₹${(v / 100000).toFixed(1)}L` },
  { key: 'uplift_pct', label: 'Uplift%', format: v => <span style={{ color: v < 5 ? 'var(--critical)' : v < 10 ? 'var(--warning)' : 'var(--success)' }}>{v}%</span> },
  { key: 'roi', label: 'ROI', format: v => <span style={{ color: v < 1 ? 'var(--critical)' : v < 1.5 ? 'var(--warning)' : 'var(--success)' }}>{v}x</span> },
  { key: 'participation_rate', label: 'Participation%', format: v => `${v}%` },
  { key: 'eligible_outlets', label: 'Eligible' },
];

const ttStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 };

export default function S06Promo() {
  const { trackScreenVisit, setChatOpen } = useApp();
  useEffect(() => { trackScreenVisit('S-06'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-06</div>
          <h2 className="screen-title">Promo Health</h2>
          <div className="screen-subtitle">Scheme performance, uplift vs target, ROI · North-2 · March 2026</div>
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
          <div className="section-label">Uplift Waterfall — Rural Penetration Scheme</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 200, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(Math.abs(v) / 100000).toFixed(1)}L`} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`₹${(Math.abs(v) / 100000).toFixed(1)}L`, '']} />
                <Bar dataKey="value" radius={3}>
                  {waterfallData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="section-label">Participation Rate by Scheme</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 200, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={l2Promo} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="scheme_name" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v}%`, 'Participation']} />
                <ReferenceLine y={60} stroke="var(--success)" strokeDasharray="3 3" label={{ value: 'Target 60%', position: 'top', fill: 'var(--success)', fontSize: 10 }} />
                <Bar dataKey="participation_rate" radius={3}>
                  {l2Promo.map((d, i) => (
                    <Cell key={i} fill={d.participation_rate < 35 ? 'var(--critical)' : d.participation_rate < 50 ? 'var(--warning)' : 'var(--success)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>Scheme-Level Performance</div>
      <DataTable columns={tableColumns} data={l2Promo} />
    </div>
  );
}
