import { useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Extraction, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';

const extractionTrend = [
  { month: 'Oct', wsp: 3840, bench: 5200 }, { month: 'Nov', wsp: 3720, bench: 5200 },
  { month: 'Dec', wsp: 3610, bench: 5200 }, { month: 'Jan', wsp: 3480, bench: 5200 },
  { month: 'Feb', wsp: 3350, bench: 5200 }, { month: 'Mar', wsp: 3200, bench: 5200 },
];

const kpis = [
  { label: 'WD%', value: 61.7, format: 'pct', delta: -3.5, deltaUnit: 'pp vs SPLY', comparison: 'SPLY: 65.2%' },
  { label: 'WSP/Outlet', value: 3200, delta: -640, deltaUnit: '₹ vs SPLY', comparison: 'Benchmark: ₹5,200' },
  { label: 'Extraction Rate', value: 61.5, format: 'pct', delta: -12.3, deltaUnit: 'pp', comparison: 'Benchmark: 73.8%' },
  { label: 'UoS', value: 1980, delta: -220, deltaUnit: ' outlets', comparison: 'Unique outlets selling' },
  { label: 'Lines/Call', value: 2.4, delta: -0.6, deltaUnit: ' lines', comparison: 'Target: 3.0' },
  { label: 'Extraction Gap', value: 12.3, format: 'pct', delta: -4.1, deltaUnit: 'pp widening', comparison: 'vs category median' },
];

const relevantFindings = driftFindings.filter(f => f.target_screen === 'S-02');

const tableColumns = [
  { key: 'district', label: 'District' },
  { key: 'category', label: 'Category' },
  { key: 'secondary_value', label: 'Secondary ₹', format: v => `₹${(v / 100000).toFixed(1)}L` },
  { key: 'avg_sales_per_outlet', label: 'WSP/Outlet', format: v => `₹${v.toLocaleString()}` },
  { key: 'wd_pct', label: 'WD%', format: v => `${v.toFixed(1)}%` },
  { key: 'extraction_rate', label: 'Extraction%', format: v => `${v.toFixed(1)}%` },
  { key: 'benchmark_extraction', label: 'Benchmark%', format: v => `${v.toFixed(1)}%` },
  { key: 'extraction_gap', label: 'Gap (pp)', format: (v, row) => {
    const gap = row.extraction_rate - row.benchmark_extraction;
    return <span style={{ color: gap < -10 ? 'var(--critical)' : gap < 0 ? 'var(--warning)' : 'var(--success)' }}>{gap.toFixed(1)}</span>;
  }},
];

export default function S02Extraction() {
  const { trackScreenVisit, setChatOpen } = useApp();
  useEffect(() => { trackScreenVisit('S-02'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-02</div>
          <h2 className="screen-title">Extraction Health</h2>
          <div className="screen-subtitle">WD%, WSP/outlet, extraction vs benchmark · North-2 · March 2026</div>
        </div>
        <button className="ask-ai-btn" onClick={() => setChatOpen(true)}>Ask AI</button>
      </div>

      <KpiStrip kpis={kpis} />

      {relevantFindings.length > 0 && (
        <div className="findings-section">
          <div className="section-label">Active Findings</div>
          {relevantFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
        </div>
      )}

      <div className="two-col">
        <div>
          <div className="section-label">WSP/Outlet vs Benchmark Trend</div>
          <div className="chart-container" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={extractionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} formatter={v => [`₹${v.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="wsp" stroke="var(--critical)" strokeWidth={2} dot={{ r: 3, fill: 'var(--critical)' }} name="WSP/Outlet" />
                <Line type="monotone" dataKey="bench" stroke="var(--success)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Benchmark" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="section-label">Extraction Gap by District</div>
          <div className="chart-container" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={l2Extraction.slice(0, 6)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="district" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} formatter={v => [`${v.toFixed(1)}%`, 'Extraction Rate']} />
                <ReferenceLine y={73.8} stroke="var(--success)" strokeDasharray="3 3" label={{ value: 'Benchmark', position: 'top', fill: 'var(--success)', fontSize: 10 }} />
                <Bar dataKey="extraction_rate" radius={4}>
                  {l2Extraction.slice(0, 6).map((d, i) => (
                    <Cell key={i} fill={d.extraction_rate < 50 ? 'var(--critical)' : d.extraction_rate < 65 ? 'var(--warning)' : 'var(--success)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>District × Category Extraction Matrix</div>
      <DataTable columns={tableColumns} data={l2Extraction} />
    </div>
  );
}
