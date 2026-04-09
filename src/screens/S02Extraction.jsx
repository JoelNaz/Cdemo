import { useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid, Legend } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Extraction, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ttStyle, CHART_HEIGHT, gridProps, xAxisProps, yAxisProps, activeDot, legendWrapperStyle, chartCardClass, chartCardStyle, GradFill } from '../utils/chartUtils';

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
  const { trackScreenVisit } = useApp();
  useEffect(() => { trackScreenVisit('S-02'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-02</div>
          <h2 className="screen-title">Extraction Health</h2>
          <div className="screen-subtitle">WD%, WSP/outlet, extraction vs benchmark · North-2 · March 2026</div>
        </div>
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
          <div className="section-label">WSP/Outlet vs Benchmark Trend</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={extractionTrend} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <GradFill id="gradWsp" color="var(--critical)" startOpacity={0.25} />
                  <GradFill id="gradBench" color="var(--success)" startOpacity={0.15} />
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...xAxisProps} />
                <YAxis {...yAxisProps} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`₹${v.toLocaleString()}`, '']} />
                <Legend wrapperStyle={legendWrapperStyle} iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="wsp" stroke="var(--critical)" strokeWidth={2.5} fill="url(#gradWsp)" dot={{ r: 3.5, fill: 'var(--critical)', strokeWidth: 0 }} activeDot={activeDot('var(--critical)')} name="WSP/Outlet" />
                <Area type="monotone" dataKey="bench" stroke="var(--success)" strokeWidth={2} strokeDasharray="6 3" fill="url(#gradBench)" dot={false} activeDot={activeDot('var(--success)')} name="Benchmark" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="section-label">Extraction Rate by District</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={l2Extraction.slice(0, 6)} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="district" {...xAxisProps} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <YAxis {...yAxisProps} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v.toFixed(1)}%`, 'Extraction Rate']} />
                <ReferenceLine y={73.8} stroke="var(--success)" strokeDasharray="4 3" label={{ value: 'Benchmark 73.8%', position: 'insideTopRight', fill: 'var(--success)', fontSize: 10 }} />
                <Bar dataKey="extraction_rate" radius={6} maxBarSize={36}>
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
