import { useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Reach, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';

const ndTrend = [
  { month: 'Oct', nd: 47.1 }, { month: 'Nov', nd: 46.3 }, { month: 'Dec', nd: 45.8 },
  { month: 'Jan', nd: 44.9 }, { month: 'Feb', nd: 43.7 }, { month: 'Mar', nd: 42.3 },
];

const outletFunnel = [
  { stage: 'Viable (POI)', count: 8200 }, { stage: 'Geo-Tagged', count: 5400 },
  { stage: 'PJP', count: 4100 }, { stage: 'Billed', count: 3800 },
  { stage: 'Active', count: 3200 }, { stage: 'GEO ECO', count: 2880 },
];

const kpis = [
  { label: 'ND%', value: 42.3, format: 'pct', delta: -4.8, deltaUnit: 'pp vs SPLY', comparison: 'SPLY: 47.1%' },
  { label: 'GEO ECO Count', value: 2880, delta: -320, deltaUnit: ' outlets', comparison: 'SPLY: 3200' },
  { label: 'GEO ECO%', value: 35.1, format: 'pct', delta: -3.9, deltaUnit: 'pp', comparison: 'SPLY: 39.0%' },
  { label: 'Outlet Additions', value: 125, delta: -55, deltaUnit: ' vs SPLY', comparison: 'SPLY: 180' },
  { label: 'Outlet Churn', value: 344, delta: 124, deltaUnit: ' vs SPLY', comparison: 'SPLY: 220' },
  { label: 'Coverage Gap', value: 3960, delta: 480, deltaUnit: ' outlets gap', comparison: 'vs POI universe' },
];

const relevantFindings = driftFindings.filter(f => f.target_screen === 'S-01');

const tableColumns = [
  { key: 'district', label: 'District' },
  { key: 'town_class', label: 'Town Class' },
  { key: 'nd_pct', label: 'ND%', format: v => `${v.toFixed(1)}%` },
  { key: 'active_outlets', label: 'Active Outlets' },
  { key: 'total_viable', label: 'Total Viable' },
  { key: 'outlet_churn', label: 'Churn', format: v => <span style={{ color: v > 50 ? 'var(--critical)' : 'inherit' }}>{v}</span> },
  { key: 'outlet_additions', label: 'Additions' },
  { key: 'coverage_gap', label: 'Gap' },
];

const highlightRules = {
  nd_pct: { negative: 40 },
  outlet_churn: { highlight: v => v > 50 },
};

const ttStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 };

export default function S01Reach() {
  const { trackScreenVisit, setChatOpen } = useApp();
  useEffect(() => { trackScreenVisit('S-01'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-01</div>
          <h2 className="screen-title">Reach Health</h2>
          <div className="screen-subtitle">ND%, GEO ECO, outlet funnel, churn analysis · North-2 · March 2026</div>
        </div>
        <button className="ask-ai-btn" onClick={() => setChatOpen(true)}>Ask AI</button>
      </div>

      <KpiStrip kpis={kpis} />

      {relevantFindings.length > 0 && (
        <div className="mb-5">
          <div className="section-label">Active Findings on This Screen</div>
          {relevantFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
        </div>
      )}

      <div className="two-col">
        <div>
          <div className="section-label">ND% Trend — 6 Months</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 200, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ndTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[38, 50]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v}%`, 'ND%']} />
                <Line type="monotone" dataKey="nd" stroke="var(--critical)" strokeWidth={2} dot={{ fill: 'var(--critical)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="section-label">Outlet Funnel</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 200, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outletFunnel} layout="vertical" margin={{ top: 5, right: 40, left: 60, bottom: 5 }}>
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={ttStyle} />
                <Bar dataKey="count" radius={3}>
                  {outletFunnel.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? 'var(--border-light)' : i < 3 ? 'var(--info)' : i < 5 ? 'var(--accent)' : 'var(--success)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>District-Level Reach Breakdown</div>
      <DataTable columns={tableColumns} data={l2Reach} highlightRules={highlightRules} />
    </div>
  );
}
