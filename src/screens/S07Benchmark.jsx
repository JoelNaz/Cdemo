import { useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, CartesianGrid, Legend, LabelList } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Benchmark, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ttStyle, CHART_HEIGHT, gridProps, xAxisProps, yAxisProps, activeDot, legendWrapperStyle, chartCardClass, chartCardStyle, GradFill } from '../utils/chartUtils';

const gapTrend = [
  { month: 'Oct', nd_gap: -5.2, ext_gap: -8.0 }, { month: 'Nov', nd_gap: -6.1, ext_gap: -8.9 },
  { month: 'Dec', nd_gap: -7.0, ext_gap: -9.8 }, { month: 'Jan', nd_gap: -7.8, ext_gap: -10.5 },
  { month: 'Feb', nd_gap: -8.9, ext_gap: -11.2 }, { month: 'Mar', nd_gap: -9.8, ext_gap: -12.0 },
];

const cohortBar = [
  { name: 'P90 (Best)', nd: 56, ext: 82 }, { name: 'P75', nd: 51, ext: 76 },
  { name: 'Median', nd: 48, ext: 70 }, { name: 'North-2', nd: 42.3, ext: 61.5 },
  { name: 'P25', nd: 38, ext: 55 },
];

const kpis = [
  { label: 'ND% Gap to Median', value: -9.8, deltaUnit: 'pp', comparison: 'Cohort median: 48%' },
  { label: 'ND% Gap to P75', value: -8.7, deltaUnit: 'pp', comparison: 'P75: 51%' },
  { label: 'Extraction Gap to Median', value: -12.0, deltaUnit: 'pp', comparison: 'Median: 73.5%' },
  { label: 'Percentile Rank', value: 28, format: 'pct', comparison: 'Was 42nd pct 6mo ago' },
  { label: 'Gaps Widening', value: '6 months', comparison: 'DA-07 fired' },
  { label: 'Pipeline Ratio Rank', value: 'Worst', comparison: 'Lowest in cohort' },
];

const relevantFindings = driftFindings.filter(f => f.target_screen === 'S-07');

const tableColumns = [
  { key: 'metric', label: 'Metric' },
  { key: 'client_value', label: 'North-2', format: v => typeof v === 'number' ? (v < 2 ? v : `${v}`) : v },
  { key: 'cohort_median', label: 'Cohort Median' },
  { key: 'cohort_p75', label: 'P75' },
  { key: 'gap_to_median', label: 'Gap to Median', format: v => (
    <span style={{ color: v < -5 ? 'var(--critical)' : v < 0 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>{v > 0 ? '+' : ''}{v}</span>
  )},
  { key: 'percentile_rank', label: 'Percentile Rank', format: v => `P${v}` },
  { key: 'trend_3m', label: 'Trend', format: v => <span style={{ color: v === 'widening' ? 'var(--critical)' : v === 'stable' ? 'var(--warning)' : 'var(--success)' }}>{v}</span> },
];


export default function S07Benchmark() {
  const { trackScreenVisit } = useApp();
  useEffect(() => { trackScreenVisit('S-07'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-07</div>
          <h2 className="screen-title">Benchmark</h2>
          <div className="screen-subtitle">Client vs cohort gaps, percentile rank, trend · North-2 · March 2026</div>
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
          <div className="section-label">Gap to Cohort Median — Widening Trend</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gapTrend} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <GradFill id="gradNdGap" color="var(--critical)" startOpacity={0.22} />
                  <GradFill id="gradExtGap" color="var(--warning)" startOpacity={0.18} />
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...xAxisProps} />
                <YAxis {...yAxisProps} tickFormatter={v => `${v}pp`} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v}pp`, '']} />
                <Legend wrapperStyle={legendWrapperStyle} iconType="circle" iconSize={8} />
                <ReferenceLine y={0} stroke="var(--border-light)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="nd_gap" stroke="var(--critical)" strokeWidth={2.5} fill="url(#gradNdGap)" dot={{ r: 3.5, fill: 'var(--critical)', strokeWidth: 0 }} activeDot={activeDot('var(--critical)')} name="ND% Gap" />
                <Area type="monotone" dataKey="ext_gap" stroke="var(--warning)" strokeWidth={2.5} fill="url(#gradExtGap)" dot={{ r: 3.5, fill: 'var(--warning)', strokeWidth: 0 }} activeDot={activeDot('var(--warning)')} name="Extraction Gap" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="section-label">Cohort Percentile Position — ND%</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortBar} margin={{ top: 24, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...xAxisProps} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                <YAxis domain={[30, 65]} {...yAxisProps} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v}%`, 'ND%']} />
                <Bar dataKey="nd" radius={6} maxBarSize={44}>
                  {cohortBar.map((d, i) => (
                    <Cell key={i} fill={d.name === 'North-2' ? 'var(--critical)' : 'var(--border-light)'} opacity={d.name === 'North-2' ? 1 : 0.75} />
                  ))}
                  <LabelList dataKey="nd" position="top" style={{ fill: 'var(--text-secondary)', fontSize: 10 }} formatter={v => `${v}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>Benchmark Gap by Metric</div>
      <DataTable columns={tableColumns} data={l2Benchmark} />
    </div>
  );
}
