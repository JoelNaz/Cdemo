import { useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, BarChart, Bar } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import DataTable from '../components/DataTable';
import { l2UntappedPotential, l2Demand, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';

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

const ttStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 };

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
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 230, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid stroke="var(--border)" strokeOpacity={0.3} />
                <XAxis dataKey="nd_pct" name="ND%" type="number" domain={[25, 65]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} label={{ value: 'ND% →', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="market_share" name="Market Share" type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} label={{ value: 'Mkt Share% →', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--text-primary)' }}>
                        <div style={{ fontWeight: 600 }}>{d.district}</div>
                        <div>ND%: {d.nd_pct?.toFixed(1)}%</div>
                        <div>Market Share: {d.market_share}%</div>
                        <div>Demand: P{d.demand_index}</div>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Scatter data={untappedWithDemand}>
                  {untappedWithDemand.map((d, i) => (
                    <Cell key={i} fill={d.opportunity === 'High' ? 'var(--success)' : d.opportunity === 'Medium' ? 'var(--warning)' : 'var(--info)'} opacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-1 text-[11px] text-[var(--text-muted)]">
            <span style={{ color: 'var(--success)' }}>● High opportunity</span>
            <span style={{ color: 'var(--warning)' }}>● Medium</span>
            <span style={{ color: 'var(--info)' }}>● Low</span>
          </div>
        </div>

        <div>
          <div className="section-label">Expansion Potential by District</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 230, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={untappedWithDemand} layout="vertical" margin={{ top: 5, right: 40, left: 80, bottom: 5 }}>
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 10000000).toFixed(1)}Cr`} />
                <YAxis type="category" dataKey="district" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} width={75} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`₹${(v / 10000000).toFixed(2)}Cr`, 'GSV Potential']} />
                <Bar dataKey="gsv_potential" radius={3}>
                  {untappedWithDemand.map((d, i) => (
                    <Cell key={i} fill={d.opportunity === 'High' ? 'var(--success)' : d.opportunity === 'Medium' ? 'var(--warning)' : 'var(--info)'} />
                  ))}
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
