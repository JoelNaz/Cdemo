import { useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Outstanding, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';

const tripleLineTrend = [
  { month: 'Oct', outstanding: 8.2, collection: 7.6, primary: 18.4 },
  { month: 'Nov', outstanding: 9.1, collection: 7.2, primary: 19.2 },
  { month: 'Dec', outstanding: 10.4, collection: 6.8, primary: 20.1 },
  { month: 'Jan', outstanding: 12.8, collection: 6.2, primary: 21.0 },
  { month: 'Feb', outstanding: 15.3, collection: 5.8, primary: 21.8 },
  { month: 'Mar', outstanding: 18.6, collection: 5.2, primary: 22.4 },
];

const kpis = [
  { label: 'Total Outstanding', value: 18600000, delta: 10400000, deltaUnit: '₹ since Oct', comparison: 'Oct: ₹8.2L' },
  { label: '>30d Outstanding', value: 11200000, delta: null, comparison: '60% of total' },
  { label: 'Collection Rate', value: 72.4, format: 'pct', delta: -8.9, deltaUnit: 'pp', comparison: 'SPLY: 81.3%' },
  { label: 'Outstanding:Primary', value: 42.1, format: 'pct', delta: 12.1, deltaUnit: 'pp above norm', comparison: 'Norm: 30%' },
  { label: 'Distributors >30%', value: 4, comparison: 'Out of 12 total DBs' },
  { label: 'Worst Case', value: 50, format: 'pct', comparison: 'Kumar Enterprises (DA-09)' },
];

const relevantFindings = driftFindings.filter(f => f.target_screen === 'S-08');

const tableColumns = [
  { key: 'name', label: 'Distributor' },
  { key: 'district', label: 'District' },
  { key: 'total_outstanding', label: 'Total Outstanding', format: v => `₹${(v / 100000).toFixed(1)}L` },
  { key: 'outstanding_gt30d', label: '>30d', format: v => `₹${(v / 100000).toFixed(1)}L` },
  { key: 'collection_rate', label: 'Collection%', format: v => (
    <span style={{ color: v < 60 ? 'var(--critical)' : v < 75 ? 'var(--warning)' : 'var(--success)' }}>{v}%</span>
  )},
  { key: 'outstanding_vs_primary', label: 'Outstanding:Primary', format: v => (
    <span style={{ color: v > 40 ? 'var(--critical)' : v > 30 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>{v}%</span>
  )},
];

const ttStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 };

export default function S08Outstanding() {
  const { trackScreenVisit, setChatOpen } = useApp();
  useEffect(() => { trackScreenVisit('S-08'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-08</div>
          <h2 className="screen-title">Outstanding Health</h2>
          <div className="screen-subtitle">Outstanding aging, collection rate, distributor credit · North-2 · March 2026</div>
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
          <div className="section-label">Outstanding vs Collection vs Primary — 6 Months</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 210, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tripleLineTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`₹${v}L`, '']} />
                <Line type="monotone" dataKey="outstanding" stroke="var(--critical)" strokeWidth={2} dot={{ r: 3, fill: 'var(--critical)' }} name="Outstanding" />
                <Line type="monotone" dataKey="collection" stroke="var(--success)" strokeWidth={2} dot={{ r: 3, fill: 'var(--success)' }} name="Collection" />
                <Line type="monotone" dataKey="primary" stroke="var(--info)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Primary" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="section-label">Outstanding:Primary by Distributor</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 210, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={l2Outstanding} layout="vertical" margin={{ top: 5, right: 40, left: 100, bottom: 5 }}>
                <XAxis type="number" domain={[0, 60]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 9 }} axisLine={false} tickLine={false} width={95} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v}%`, 'Outstanding:Primary']} />
                <ReferenceLine x={30} stroke="var(--warning)" strokeDasharray="3 3" label={{ value: 'Threshold', position: 'top', fill: 'var(--warning)', fontSize: 10 }} />
                <Bar dataKey="outstanding_vs_primary" radius={3}>
                  {l2Outstanding.map((d, i) => (
                    <Cell key={i} fill={d.outstanding_vs_primary > 40 ? 'var(--critical)' : d.outstanding_vs_primary > 30 ? 'var(--warning)' : 'var(--success)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>Distributor Outstanding Detail</div>
      <DataTable columns={tableColumns} data={l2Outstanding} />
    </div>
  );
}
