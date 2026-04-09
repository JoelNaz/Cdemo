import { useEffect } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid, LabelList, BarChart } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2Promo, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ttStyle, CHART_HEIGHT, gridProps, xAxisProps, yAxisProps, chartCardClass, chartCardStyle } from '../utils/chartUtils';

const RAW_WATERFALL = [
  { name: 'Baseline',     value: 4200000 },
  { name: 'Target Uplift',value:  630000 },
  { name: 'Actual Uplift',value:   84000 },
  { name: 'Shortfall',    value: -546000 },
];

const buildWaterfall = (items) => {
  let running = 0;
  return items.map((item, i) => {
    const isFirst = i === 0;
    const isNeg   = item.value < 0;
    const base    = isFirst ? 0 : running;
    const barVal  = Math.abs(item.value);
    const bottom  = isNeg ? running + item.value : running;
    running += item.value;
    return {
      ...item,
      base: isFirst ? 0 : bottom,
      bar: barVal,
      total: running,
      color: isFirst ? 'var(--info)' : isNeg ? 'var(--critical)' : (i === 2 ? 'var(--warning)' : 'var(--success)'),
      isFirst,
    };
  });
};

const waterfallData = buildWaterfall(RAW_WATERFALL);

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


export default function S06Promo() {
  const { trackScreenVisit } = useApp();
  useEffect(() => { trackScreenVisit('S-06'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-06</div>
          <h2 className="screen-title">Promo Health</h2>
          <div className="screen-subtitle">Scheme performance, uplift vs target, ROI · North-2 · March 2026</div>
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
          <div className="section-label">Uplift Waterfall — Rural Penetration Scheme</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={waterfallData} margin={{ top: 24, right: 16, left: -4, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...xAxisProps} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <YAxis
                  {...yAxisProps}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`}
                  domain={[0, 5200000]}
                />
                <Tooltip
                  contentStyle={ttStyle}
                  formatter={(v, name, props) => {
                    if (name === 'base') return null;
                    const d = props.payload;
                    return [`₹${(d.bar / 100000).toFixed(1)}L`, d.name];
                  }}
                />
                {/* Invisible base — pushes floating bar up */}
                <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
                {/* Visible floating bar */}
                <Bar dataKey="bar" stackId="w" radius={[5, 5, 0, 0]} maxBarSize={56} isAnimationActive>
                  {waterfallData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  <LabelList
                    dataKey="bar"
                    position="top"
                    style={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                    formatter={v => `₹${(v / 100000).toFixed(1)}L`}
                  />
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="section-label">Participation Rate by Scheme</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={l2Promo} margin={{ top: 24, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...xAxisProps} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                <YAxis domain={[0, 100]} {...yAxisProps} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`${v}%`, 'Participation']} />
                <ReferenceLine y={60} stroke="var(--success)" strokeDasharray="4 3" label={{ value: 'Target 60%', position: 'insideTopRight', fill: 'var(--success)', fontSize: 10 }} />
                <Bar dataKey="participation_rate" radius={6} maxBarSize={40}>
                  {l2Promo.map((d, i) => (
                    <Cell key={i} fill={d.participation_rate < 35 ? 'var(--critical)' : d.participation_rate < 50 ? 'var(--warning)' : 'var(--success)'} />
                  ))}
                  <LabelList dataKey="participation_rate" position="top" style={{ fill: 'var(--text-secondary)', fontSize: 10 }} formatter={v => `${v}%`} />
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
