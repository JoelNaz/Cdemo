import { useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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
        <button className="ask-ai-btn" onClick={() => setChatOpen(true)}>
          Ask AI
        </button>
      </div>

      <KpiStrip kpis={kpis} />

      <div className="mtd-completion-bar">
        <div className="mtd-label">MTD Completion</div>
        <div className="mtd-track">
          <div className="mtd-fill" style={{ width: '58%' }} />
          <div className="mtd-marker" style={{ left: '58%' }}><span>58%</span></div>
        </div>
        <div className="mtd-hint">42% of month remaining</div>
      </div>

      <div className="two-col">
        <div>
          <div className="section-label">Revenue Trend — 6 Months</div>
          <div className="chart-container" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mtdData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} formatter={(v) => [`₹${v}Cr`, 'Revenue']} />
                <ReferenceLine y={8.5} stroke="var(--border-light)" strokeDasharray="3 3" label={{ value: 'SPLY avg', position: 'right', fill: 'var(--text-muted)', fontSize: 10 }} />
                <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="section-label">Findings Summary</div>
          <div className="findings-summary-grid">
            <div className="findings-count-card critical">
              <div className="count">{criticalFindings.length}</div>
              <div className="label">Critical</div>
            </div>
            <div className="findings-count-card warning">
              <div className="count">{warningFindings.length}</div>
              <div className="label">Warning</div>
            </div>
            <div className="findings-count-card info">
              <div className="count">{infoFindings.length}</div>
              <div className="label">Info / Cat B</div>
            </div>
            <div className="findings-count-card total">
              <div className="count">{driftFindings.length}</div>
              <div className="label">Total Active</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>
        Active Drift Findings — Ranked by Severity
        <span className="section-hint">Click any finding to drill down</span>
      </div>
      <div className="findings-feed">
        {criticalFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
        {warningFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
        {infoFindings.map(f => <FindingCard key={f.finding_id} finding={f} />)}
      </div>
    </div>
  );
}
