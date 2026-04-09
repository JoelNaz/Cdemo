import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import KpiStrip from '../components/KpiStrip';
import FindingCard from '../components/FindingCard';
import { kpiSummary, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';

const mtdData = [
  { month: 'Oct', value: 9.2 }, { month: 'Nov', value: 8.8 }, { month: 'Dec', value: 8.1 },
  { month: 'Jan', value: 7.9 }, { month: 'Feb', value: 7.4 }, { month: 'Mar', value: 6.8 },
];

const kpis = [
  { label: 'Total Revenue', value: kpiSummary.totalRevenue.value, delta: kpiSummary.totalRevenue.delta, deltaUnit: '% vs SPLY', comparison: `SPLY: ₹${(kpiSummary.totalRevenue.sply / 10000000).toFixed(1)}Cr`, mtdCompletion: kpiSummary.totalRevenue.mtdCompletion },
  { label: 'ND%', value: kpiSummary.nd.value, format: 'pct', delta: kpiSummary.nd.delta, deltaUnit: 'pp vs SPLY', comparison: `SPLY: ${kpiSummary.nd.sply}%` },
  { label: 'WD%', value: kpiSummary.wd.value, format: 'pct', delta: kpiSummary.wd.delta, deltaUnit: 'pp', comparison: `SPLY: ${kpiSummary.wd.sply}%` },
  { label: 'Sec:Pri Ratio', value: kpiSummary.pipelineRatio.value, format: 'ratio', delta: kpiSummary.pipelineRatio.delta, deltaUnit: '% vs SPLY', comparison: `SPLY: ${kpiSummary.pipelineRatio.sply}` },
  { label: 'Collection Rate', value: kpiSummary.collectionRate.value, format: 'pct', delta: kpiSummary.collectionRate.delta, deltaUnit: 'pp', comparison: `SPLY: ${kpiSummary.collectionRate.sply}%` },
  { label: 'SFA MAU', value: kpiSummary.mau.value, format: 'pct', delta: kpiSummary.mau.delta, deltaUnit: 'pp', comparison: `SPLY: ${kpiSummary.mau.sply}%` },
];

const criticalFindings = driftFindings.filter(f => f.severity === 'critical');
const warningFindings = driftFindings.filter(f => f.severity === 'warning');
const infoFindings = driftFindings.filter(f => f.severity === 'info' || f.category === 'B');

const ttStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 };

export default function S00Landing() {
  const { trackScreenVisit, setChatOpen } = useApp();
  useEffect(() => { trackScreenVisit('S-00'); }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-id">S-00</div>
          <h2 className="screen-title">Growth Command Centre</h2>
          <div className="screen-subtitle">North-2 Region · March 2026 · MTD 58% complete</div>
        </div>
        <button className="ask-ai-btn" onClick={() => setChatOpen(true)}>Ask AI</button>
      </div>

      <KpiStrip kpis={kpis} />

      {/* MTD bar */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-[18px] py-3 mb-[22px] flex items-center gap-4" style={{ boxShadow: 'var(--card-shadow)' }}>
        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1px] whitespace-nowrap">MTD Completion</div>
        <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full relative overflow-visible">
          <div className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-500" style={{ width: '58%' }} />
          <div className="absolute top-[-22px] text-[10px] font-bold text-[var(--accent)]" style={{ left: '58%', transform: 'translateX(-50%)' }}>58%</div>
        </div>
        <div className="text-[10.5px] text-[var(--text-muted)] whitespace-nowrap font-medium">42% remaining</div>
      </div>

      <div className="two-col">
        <div>
          <div className="section-label">Revenue Trend — 6 Months</div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-[18px]" style={{ height: 200, boxShadow: 'var(--card-shadow)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mtdData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ttStyle} formatter={v => [`₹${v}Cr`, 'Revenue']} />
                <ReferenceLine y={8.5} stroke="var(--border-light)" strokeDasharray="3 3" label={{ value: 'SPLY avg', position: 'right', fill: 'var(--text-muted)', fontSize: 10 }} />
                <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="section-label">Findings Summary</div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Critical', count: criticalFindings.length, color: 'var(--critical)', borderColor: 'border-l-[var(--critical)]' },
              { label: 'Warning', count: warningFindings.length, color: 'var(--warning)', borderColor: 'border-l-[var(--warning)]' },
              { label: 'Info / Cat B', count: infoFindings.length, color: 'var(--info)', borderColor: 'border-l-[var(--info)]' },
              { label: 'Total Active', count: driftFindings.length, color: 'var(--text-primary)', borderColor: '' },
            ].map(({ label, count, color, borderColor }) => (
              <div
                key={label}
                className={`bg-[var(--bg-card)] border border-[var(--border)] border-l-[3px] ${borderColor} rounded-xl p-4 text-center transition-transform hover:-translate-y-0.5`}
                style={{ boxShadow: 'var(--card-shadow)' }}
              >
                <div className="text-[34px] font-extrabold leading-none tracking-[-1.5px] [font-variant-numeric:tabular-nums]" style={{ color }}>{count}</div>
                <div className="text-[9.5px] font-bold text-[var(--text-muted)] uppercase tracking-[0.9px] mt-1.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>
        Active Drift Findings — Ranked by Severity
        <span className="section-hint">Click any finding to drill down</span>
      </div>
      <div className="flex flex-col gap-2">
        {criticalFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
        {warningFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
        {infoFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
      </div>
    </div>
  );
}
