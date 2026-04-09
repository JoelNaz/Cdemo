import { useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2ChannelMix, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';

const channelTrend = [
  { q: 'Q2 FY25', gt: 78, mt: 12, qc: 7, ecomm: 3 },
  { q: 'Q3 FY25', gt: 76, mt: 13, qc: 7, ecomm: 4 },
  { q: 'Q4 FY25', gt: 74, mt: 14, qc: 7, ecomm: 5 },
  { q: 'Q1 FY26', gt: 72, mt: 15, qc: 8, ecomm: 5 },
];

const pieData = [
  { name: 'GT', value: 72, color: 'var(--accent)' },
  { name: 'MT', value: 15, color: 'var(--info)' },
  { name: 'QC', value: 8, color: 'var(--success)' },
  { name: 'Ecomm', value: 5, color: 'var(--warning)' },
];

const kpis = [
  { label: 'GT Share', value: 72, format: 'pct', delta: -6, deltaUnit: 'pp vs SPLY', comparison: 'SPLY: 78%' },
  { label: 'MT Share', value: 15, format: 'pct', delta: 3, deltaUnit: 'pp', comparison: 'SPLY: 12%' },
  { label: 'QC Share', value: 8, format: 'pct', delta: 1, deltaUnit: 'pp', comparison: 'SPLY: 7%' },
  { label: 'Ecomm Share', value: 5, format: 'pct', delta: 2, deltaUnit: 'pp', comparison: 'SPLY: 3%' },
  { label: 'GT Share Delta', value: -2, deltaUnit: 'pp/qtr', comparison: 'Sustained 3+ qtrs' },
  { label: 'Structural Shift', value: 'Active', delta: null, comparison: 'DA-04 fired' },
];

const relevantFindings = driftFindings.filter(f => f.target_screen === 'S-04');

const tableColumns = [
  { key: 'district', label: 'District' },
  { key: 'gt_share', label: 'GT%', format: v => `${v}%` },
  { key: 'mt_share', label: 'MT%', format: v => `${v}%` },
  { key: 'qc_share', label: 'QC%', format: v => `${v}%` },
  { key: 'ecomm_share', label: 'Ecomm%', format: v => `${v}%` },
  { key: 'gt_share_delta_sply', label: 'GT Δ vs SPLY', format: v => <span style={{ color: v < -2 ? 'var(--critical)' : v < 0 ? 'var(--warning)' : 'var(--success)' }}>{v > 0 ? '+' : ''}{v}pp</span> },
  { key: 'structural_shift', label: 'Shift Flag', format: v => v
    ? <span className="bg-[var(--critical-bg)] text-[var(--critical)] text-[10px] font-bold px-[7px] py-0.5 rounded-[3px] uppercase tracking-[0.8px]">Structural</span>
    : <span className="bg-[var(--info-bg)] text-[var(--info)] text-[10px] font-bold px-[7px] py-0.5 rounded-[3px] uppercase tracking-[0.8px]">Seasonal</span>
  },
];

const ttStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 };

export default function S04Channel() {
  const { trackScreenVisit, setChatOpen } = useApp();
  useEffect(() => { trackScreenVisit('S-04'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-04</div>
          <h2 className="screen-title">Channel Mix</h2>
          <div className="screen-subtitle">GT/MT/QC/ecomm share, structural shift detection · North-2 · March 2026</div>
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
          <div className="section-label">Current Channel Mix</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px] flex items-center justify-center" style={{ height: 200, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="40%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v}%`, '']} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="section-label">Channel Share Trend — Quarterly</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 200, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="q" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} />
                <Bar dataKey="gt" stackId="a" fill="var(--accent)" name="GT" />
                <Bar dataKey="mt" stackId="a" fill="var(--info)" name="MT" />
                <Bar dataKey="qc" stackId="a" fill="var(--success)" name="QC" />
                <Bar dataKey="ecomm" stackId="a" fill="var(--warning)" name="Ecomm" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>District Archetype Classification</div>
      <DataTable columns={tableColumns} data={l2ChannelMix} />
    </div>
  );
}
