import { useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, BarChart, Bar, ReferenceLine, LabelList } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2UntappedPotential, l2Demand, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ttStyle, CHART_HEIGHT, gridProps, xAxisProps, yAxisProps, chartCardClass, chartCardStyle } from '../utils/chartUtils';

const kpis = [
  { label: 'Under-Penetrated Towns', value: 23, comparison: 'Demand index >P75, ND% <20%' },
  { label: 'Under-Indexed Markets', value: 11, comparison: 'ND% >60% but extraction low' },
  { label: 'Expansion Potential', value: 25000000, comparison: 'Unlockable ₹2.5Cr GSV' },
  { label: 'Target Outlet Additions', value: 490, comparison: 'For whitespace towns' },
  { label: 'Active Cat B Findings', value: 2, comparison: 'DB-01 + DB-02' },
  { label: 'Top District Gap', value: 'Allahabad', comparison: 'Demand P82, ND% 38.8%' },
];

const relevantFindings = driftFindings.filter(f => ['S-09'].includes(f.target_screen));

const untappedWithDemand = l2UntappedPotential.map(u => {
  const d = l2Demand.find(d => d.district === u.district) || {};
  return {
    ...u,
    demand_index: d.demand_index || '-',
    gsv_potential: d.demand_vs_distribution_gap ? d.demand_vs_distribution_gap * 55000 : 0,
    opportunity: u.nd_pct < 40 ? 'High' : u.nd_pct < 50 ? 'Medium' : 'Low',
  };
});

const tableColumns = [
  { key: 'district', label: 'District/Town' },
  { key: 'demand_index', label: 'Demand Index', format: v => v !== '-' ? `P${v}` : '-' },
  { key: 'nd_pct', label: 'ND%', format: v => `${v}%` },
  { key: 'ideal_outlets', label: 'Ideal Outlets' },
  { key: 'total_outlets', label: 'Current Outlets' },
  { key: 'market_share', label: 'Mkt Share%', format: v => `${v}%` },
  { key: 'infra_count', label: 'Infra Count' },
  { key: 'opportunity', label: 'Opportunity', format: v => (
    <span style={{ color: v === 'High' ? 'var(--success)' : v === 'Medium' ? 'var(--warning)' : 'var(--info)' }}>{v}</span>
  )},
];


export default function S09Untapped() {
  const { trackScreenVisit, setChatOpen } = useApp();
  useEffect(() => { trackScreenVisit('S-09'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-09</div>
          <h2 className="screen-title">Untapped Potential</h2>
          <div className="screen-subtitle">Whitespace towns, under-indexed markets, expansion targeting · North-2 · March 2026</div>
        </div>
        <button className="ask-ai-btn" onClick={() => setChatOpen(true)}>Ask AI</button>
      </div>

      <KpiStrip kpis={kpis} />

      {relevantFindings.length > 0 && (
        <div className="mb-5">
          <div className="section-label">Strategic Findings (Category B — War Room)</div>
          {relevantFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
        </div>
      )}

      <div className="two-col">
        <div>
          <div className="section-label">Market Share × ND% — Untapped Potential Scatter</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" strokeOpacity={0.45} />
                <XAxis dataKey="nd_pct" name="ND%" type="number" domain={[25, 65]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} label={{ value: 'ND% →', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="market_share" name="Market Share" type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} label={{ value: 'Mkt Share% →', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <ReferenceLine x={40} stroke="var(--border-light)" strokeDasharray="4 3" />
                <Tooltip contentStyle={ttStyle} cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const color = d.opportunity === 'High' ? 'var(--success)' : d.opportunity === 'Medium' ? 'var(--warning)' : 'var(--info)';
                    return (
                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--text-primary)', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
                        <div style={{ fontWeight: 700, marginBottom: 6, color }}>{d.district}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>ND%: <strong>{d.nd_pct?.toFixed(1)}%</strong></div>
                        <div style={{ color: 'var(--text-secondary)' }}>Market Share: <strong>{d.market_share}%</strong></div>
                        <div style={{ color: 'var(--text-secondary)' }}>Demand: <strong>P{d.demand_index}</strong></div>
                        <div style={{ color, fontWeight: 600, marginTop: 4 }}>{d.opportunity} Opportunity</div>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Scatter data={untappedWithDemand} shape={(props) => {
                  const { cx, cy, payload } = props;
                  const color = payload.opportunity === 'High' ? 'var(--success)' : payload.opportunity === 'Medium' ? 'var(--warning)' : 'var(--info)';
                  const r = payload.opportunity === 'High' ? 8 : payload.opportunity === 'Medium' ? 6 : 5;
                  return <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.82} stroke={color} strokeWidth={1.5} strokeOpacity={0.35} />;
                }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-5 mt-2 text-[11px]">
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>● High opportunity</span>
            <span style={{ color: 'var(--warning)', fontWeight: 600 }}>● Medium</span>
            <span style={{ color: 'var(--info)', fontWeight: 600 }}>● Low</span>
          </div>
        </div>

        <div>
          <div className="section-label">Expansion Potential by District</div>
          <div className={chartCardClass} style={chartCardStyle(CHART_HEIGHT)}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={untappedWithDemand} layout="vertical" margin={{ top: 5, right: 72, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" strokeOpacity={0.45} horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 10000000).toFixed(1)}Cr`} />
                <YAxis type="category" dataKey="district" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} width={75} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`₹${(v / 10000000).toFixed(2)}Cr`, 'GSV Potential']} />
                <Bar dataKey="gsv_potential" radius={5} maxBarSize={16}>
                  {untappedWithDemand.map((d, i) => (
                    <Cell key={i} fill={d.opportunity === 'High' ? 'var(--success)' : d.opportunity === 'Medium' ? 'var(--warning)' : 'var(--info)'} />
                  ))}
                  <LabelList dataKey="gsv_potential" position="right" style={{ fill: 'var(--text-muted)', fontSize: 10 }} formatter={v => v > 0 ? `₹${(v / 10000000).toFixed(2)}Cr` : ''} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>Town-Level Untapped Detail</div>
      <DataTable columns={tableColumns} data={untappedWithDemand} />
    </div>
  );
}
