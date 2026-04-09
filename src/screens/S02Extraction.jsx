import { useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid, Legend } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Extraction, driftFindings, trendData } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ttStyle, CHART_HEIGHT, gridProps, xAxisProps, yAxisProps, activeDot, legendWrapperStyle, chartCardClass, chartCardStyle, GradFill } from '../utils/chartUtils';

const kpis = [
  { label: 'WD%', value: 61.7, format: 'pct', delta: -3.5, deltaUnit: 'pp vs SPLY', comparison: 'SPLY: 65.2%' },
  { label: 'WSP/Outlet', value: 3200, delta: -640, deltaUnit: '₹ vs SPLY', comparison: 'Benchmark: ₹5,200' },
  { label: 'Extraction Rate', value: 62, format: 'pct', delta: -12, deltaUnit: 'pp', comparison: 'Benchmark: 73.8%' },
  { label: 'UoS', value: 1980, delta: -220, deltaUnit: ' outlets', comparison: 'Unique outlets selling' },
  { label: 'Lines/Call', value: 2.4, delta: -0.6, deltaUnit: ' lines', comparison: 'Target: 3.0' },
  { label: 'Extraction Gap', value: 12.3, format: 'pct', delta: -4.1, deltaUnit: 'pp widening', comparison: 'vs category median' },
];

const relevantFindings = driftFindings.filter(f => f.target_screen === 'S-02');

const districtExtractionData = Object.values(
  l2Extraction.reduce((acc, row) => {
    if (!acc[row.district]) acc[row.district] = { district: row.district, total: 0, count: 0 };
    acc[row.district].total += row.extraction_rate;
    acc[row.district].count += 1;
    return acc;
  }, {})
).map(d => ({ district: d.district, extraction_rate: Math.round(d.total / d.count) }));

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
              <AreaChart data={trendData.wsp_trend} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
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
              <BarChart data={districtExtractionData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="district" {...xAxisProps} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <YAxis {...yAxisProps} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v.toFixed(1)}%`, 'Extraction Rate']} />
                <Legend
                  wrapperStyle={legendWrapperStyle}
                  content={() => (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 10, color: 'var(--text-muted)', paddingTop: 4 }}>
                      {[
                        { color: 'var(--critical)', label: '< 50%  Critical' },
                        { color: 'var(--warning)',  label: '50–65%  Below Benchmark' },
                        { color: 'var(--success)',  label: '≥ 65%  On Track' },
                      ].map(({ color, label }) => (
                        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                />
                <ReferenceLine y={73.8} stroke="var(--success)" strokeDasharray="4 3" label={{ value: 'Benchmark 73.8%', position: 'insideTopRight', fill: 'var(--success)', fontSize: 10 }} />
                <Bar dataKey="extraction_rate" radius={6} maxBarSize={28}>
                  {districtExtractionData.map((d, i) => (
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
