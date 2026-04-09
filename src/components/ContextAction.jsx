import { useState, useEffect, useRef } from 'react';
import {
  X, Zap, ChevronRight, Sparkles, Users, FileText, Mic,
  TrendingDown, TrendingUp, BarChart3, Volume2,
  AlertTriangle, User, MapPin, Target,
} from 'lucide-react';
import {
  driftFindings, screenDefinitions,
  l2Reach, l2Extraction, l2Pipeline, l2ChannelMix,
  l2Territory, l2Promo, l2Outstanding, l2Benchmark, l2Demand,
} from '../data/mockData';

// ─── Panel stack config ───────────────────────────────────────
const MAX_VISIBLE = 3; // max fully-expanded panels at once

const PANEL_CFG = {
  findings: { Icon: AlertTriangle, label: 'Findings'  },
  kpis:     { Icon: BarChart3,    label: 'KPIs'      },
  detail:   { Icon: Users,        label: 'Detail'    },
  person:   { Icon: User,         label: 'Person'    },
  beat:     { Icon: MapPin,       label: 'Beat'      },
  outlet:   { Icon: Target,       label: 'Outlet'    },
};

// ============================================================
// MOCK FIELD DATA
// ============================================================
const mockPeople = {
  'F-001': [
    { name: 'ASM Priya Mehta', role: 'ASM', region: 'Kanpur', status: 'active', lastContact: '2 days ago', avatar: 'PM' },
    { name: 'Amit Kumar', role: 'Salesperson', region: 'BT-001', status: 'active', lastContact: '1 day ago', avatar: 'AK' },
    { name: 'Sanjay Yadav', role: 'Salesperson', region: 'BT-002', status: 'at-risk', lastContact: '5 days ago', avatar: 'SY' },
  ],
  'F-002': [
    { name: 'ASM Rahul Singh', role: 'ASM', region: 'Allahabad', status: 'active', lastContact: '1 day ago', avatar: 'RS' },
    { name: 'Deepak Mishra', role: 'Salesperson', region: 'BT-004', status: 'at-risk', lastContact: '4 days ago', avatar: 'DM' },
  ],
  'F-003': [
    { name: 'RSM Rajesh Sharma', role: 'RSM', region: 'North-2', status: 'active', lastContact: 'Today', avatar: 'RS' },
    { name: 'Gupta Agencies', role: 'Distributor', region: 'Lucknow', status: 'at-risk', lastContact: '3 days ago', avatar: 'GA' },
    { name: 'Verma & Sons', role: 'Distributor', region: 'Kanpur', status: 'at-risk', lastContact: '2 days ago', avatar: 'VS' },
    { name: 'Kumar Enterprises', role: 'Distributor', region: 'Varanasi', status: 'critical', lastContact: '6 days ago', avatar: 'KE' },
  ],
  'F-004': [
    { name: 'ASM Priya Mehta', role: 'ASM', region: 'Lucknow', status: 'active', lastContact: '1 day ago', avatar: 'PM' },
  ],
  'F-005': [
    { name: 'ASM Vikram Patel', role: 'ASM', region: 'Agra', status: 'at-risk', lastContact: '3 days ago', avatar: 'VP' },
    { name: 'Patel Distribution', role: 'Distributor', region: 'Agra', status: 'active', lastContact: '2 days ago', avatar: 'PD' },
  ],
  'F-006': [
    { name: 'ASM Rahul Singh', role: 'ASM', region: 'Varanasi', status: 'at-risk', lastContact: '2 days ago', avatar: 'RS' },
    { name: 'Kumar Enterprises', role: 'Distributor', region: 'Varanasi', status: 'critical', lastContact: '5 days ago', avatar: 'KE' },
    { name: 'Suresh Pandey', role: 'Salesperson', region: 'BT-VNS-06', status: 'active', lastContact: '1 day ago', avatar: 'SP' },
  ],
  'F-007': [{ name: 'RSM Rajesh Sharma', role: 'RSM', region: 'North-2', status: 'active', lastContact: 'Today', avatar: 'RS' }],
  'F-008': [{ name: 'ASM Rahul Singh', role: 'ASM', region: 'Varanasi', status: 'critical', lastContact: '1 day ago', avatar: 'RS' }],
  'F-009': [
    { name: 'Kumar Enterprises', role: 'Distributor', region: 'Varanasi', status: 'critical', lastContact: '6 days ago', avatar: 'KE' },
    { name: 'ASM Rahul Singh', role: 'ASM', region: 'Varanasi', status: 'at-risk', lastContact: '2 days ago', avatar: 'RS' },
  ],
  'F-010': [
    { name: 'ASM Priya Mehta', role: 'ASM', region: 'Kanpur', status: 'at-risk', lastContact: '3 days ago', avatar: 'PM' },
    { name: 'ASM Vikram Patel', role: 'ASM', region: 'Agra', status: 'critical', lastContact: '5 days ago', avatar: 'VP' },
  ],
};

const mockNotes = {
  'F-001': [
    { id: 'n1', author: 'ASM Priya Mehta', timestamp: 'Mar 28, 14:22', text: 'Visited 8 churned outlets in Kanpur FLP belt. Main reason: competitor offering 30-day credit vs our 7-day terms. 3 stores switched to XYZ outright.', pinned: true },
    { id: 'n2', author: 'RSM Rajesh Sharma', timestamp: 'Mar 29, 09:15', text: 'Discussed with ZSM. Credit policy relaxation for top 50 outlets being reviewed. Expect decision by Apr 5.', pinned: false },
    { id: 'n3', author: 'Amit Kumar', timestamp: 'Mar 30, 11:05', text: 'Beat BT-001: 12 of 15 target FLP outlets visited. 4 expressed willingness to return if credit terms improve.', pinned: false },
  ],
  'F-002': [
    { id: 'n1', author: 'ASM Rahul Singh', timestamp: 'Mar 27, 10:30', text: 'Allahabad Hair Care extraction below 50% for 3rd consecutive month. Lines/call declining due to SKU availability gaps at distributor level.', pinned: true },
    { id: 'n2', author: 'RSM Rajesh Sharma', timestamp: 'Mar 28, 16:45', text: 'WSP/outlet gap of ₹1,639 vs median indicates systemic issue, not one-off. Reviewing extraction benchmark report.', pinned: false },
  ],
  'F-003': [
    { id: 'n1', author: 'RSM Rajesh Sharma', timestamp: 'Mar 26, 08:00', text: 'Pipeline stuffing confirmed across 3 distributors. Q4 scheme loading pushing primary without secondary pull. Escalated to ZSM.', pinned: true },
    { id: 'n2', author: 'ZSM Anil Kapoor', timestamp: 'Mar 27, 12:30', text: 'Decision: no further primary push until Sec:Pri >0.80 for Gupta, Verma, Kumar.', pinned: false },
  ],
  'F-006': [
    { id: 'n1', author: 'ASM Rahul Singh', timestamp: 'Mar 28, 09:00', text: 'Rural Penetration Scheme in Varanasi underperforming. Visited 5 non-participating outlets — all unaware of scheme. Communication gap between distributor and outlets.', pinned: true },
    { id: 'n2', author: 'Trade Marketing', timestamp: 'Mar 29, 14:00', text: 'Scheme eligibility criteria under review. Recommendation to relax minimum order quantity from ₹5,000 to ₹3,000 for FLP class.', pinned: false },
  ],
  'F-009': [
    { id: 'n1', author: 'RSM Rajesh Sharma', timestamp: 'Mar 25, 15:00', text: 'Kumar Enterprises outstanding at 50% of primary — highest in region. Collection rate dropped from 72% to 55% in 3 months. Credit limit review needed.', pinned: true },
    { id: 'n2', author: 'Finance Team', timestamp: 'Mar 27, 11:30', text: 'Kumar Enterprises outstanding >30 days: ₹8.8L. Legal notice draft prepared pending RSM approval.', pinned: false },
  ],
};

const mockVoiceNotes = {
  'F-001': [
    { id: 'v1', author: 'ASM Priya Mehta', duration: '1:24', timestamp: 'Mar 28, 16:45', transcription: 'Outlet visit Kanpur FLP belt — 3 stores switched to competitor...' },
    { id: 'v2', author: 'Amit Kumar', duration: '0:52', timestamp: 'Mar 30, 18:10', transcription: 'BT-001 daily update: visited 15 outlets, 4 recovery conversations...' },
  ],
  'F-002': [
    { id: 'v1', author: 'ASM Rahul Singh', duration: '2:10', timestamp: 'Mar 27, 19:00', transcription: 'Allahabad extraction issue — distributor SKU gap confirmed at 6 key products...' },
  ],
  'F-006': [
    { id: 'v1', author: 'ASM Rahul Singh', duration: '1:45', timestamp: 'Mar 28, 17:30', transcription: 'Scheme activation Varanasi — outlet awareness extremely low across all beats...' },
    { id: 'v2', author: 'Suresh Pandey', duration: '0:38', timestamp: 'Mar 30, 20:00', transcription: 'BT-VNS-06 beats — 40% participation achieved this week, best in cluster...' },
  ],
  'F-009': [
    { id: 'v1', author: 'RSM Rajesh Sharma', duration: '3:02', timestamp: 'Mar 25, 16:00', transcription: 'Kumar Enterprises account review — escalation summary for ZSM...' },
  ],
};

// ============================================================
// KPI DATA HELPERS
// ============================================================
const catColor = {
  reach: 'var(--info)', extraction: 'var(--success)', pipeline: 'var(--warning)',
  channel: 'var(--accent)', territory: 'var(--info)', promo: 'var(--success)',
  benchmark: 'var(--critical)', outstanding: 'var(--critical)', demand: 'var(--success)',
  risk: 'var(--critical)', opportunity: 'var(--success)', execution: 'var(--info)',
  info: 'var(--text-muted)', sfa: 'var(--warning)',
};

function getKpisForFinding(finding) {
  const { target_screen, geo_id } = finding;
  switch (target_screen) {
    case 'S-01': {
      const row = l2Reach.find(r => r.district === geo_id) || l2Reach[1];
      return [
        { id: 'nd_pct', label: 'ND%', value: `${row.nd_pct}%`, delta: finding.drift_magnitude, trend: 'down', subtitle: `vs ${finding.comparison_value}% SPLY`, category: 'reach' },
        { id: 'active_outlets', label: 'Active Outlets', value: row.active_outlets.toLocaleString('en-IN'), delta: null, trend: 'down', subtitle: `of ${row.total_viable.toLocaleString('en-IN')} viable`, category: 'reach' },
        { id: 'churn', label: 'Monthly Churn', value: row.outlet_churn, delta: null, trend: 'up', subtitle: `vs ${row.outlet_additions} additions`, category: 'risk' },
        { id: 'coverage_gap', label: 'Coverage Gap', value: `${row.coverage_gap} outlets`, delta: null, trend: 'up', subtitle: 'Outlets not yet reached', category: 'opportunity' },
        { id: 'geo_eco_pct', label: 'GEO ECO%', value: `${row.geo_eco_pct}%`, delta: null, trend: 'down', subtitle: `${row.geo_eco_count} eco-coded outlets`, category: 'reach' },
        { id: 'town_class', label: 'Town Class', value: row.town_class, delta: null, trend: null, subtitle: `District: ${row.district}`, category: 'info' },
      ];
    }
    case 'S-02': {
      const rows = l2Extraction.filter(r => r.district === geo_id);
      const row = rows[0] || l2Extraction[4];
      return [
        { id: 'extraction_rate', label: 'Extraction Rate', value: `${row.extraction_rate}%`, delta: finding.drift_magnitude, trend: 'down', subtitle: `Benchmark: ${row.benchmark_extraction}%`, category: 'extraction' },
        { id: 'wd_pct', label: 'WD%', value: `${row.wd_pct}%`, delta: null, trend: 'down', subtitle: row.category, category: 'extraction' },
        { id: 'wsp', label: 'WSP / Outlet', value: `₹${row.avg_sales_per_outlet.toLocaleString('en-IN')}`, delta: null, trend: 'down', subtitle: 'Avg per active outlet', category: 'extraction' },
        { id: 'lines_per_call', label: 'Lines / Call', value: row.lines_per_call, delta: null, trend: 'down', subtitle: 'Avg SKU depth per visit', category: 'execution' },
        { id: 'uos', label: 'UoS', value: row.uos, delta: null, trend: 'down', subtitle: 'Units of Sale', category: 'execution' },
        { id: 'extraction_gap', label: 'Extraction Gap', value: `${row.extraction_gap}pp`, delta: null, trend: 'up', subtitle: 'vs benchmark', category: 'risk' },
      ];
    }
    case 'S-03': {
      const row = l2Pipeline[1];
      return [
        { id: 'pipeline_ratio', label: 'Sec:Pri Ratio', value: finding.current_value, delta: finding.drift_magnitude, trend: 'down', subtitle: `Target: ${finding.comparison_value}`, category: 'pipeline' },
        { id: 'days_stock', label: 'Days of Stock', value: `${row.days_stock}d`, delta: null, trend: 'up', subtitle: 'At distributor level', category: 'pipeline' },
        { id: 'ofr', label: 'OFR', value: `${row.ofr}%`, delta: null, trend: 'down', subtitle: 'Order fill rate', category: 'pipeline' },
        { id: 'primary_saly', label: 'Primary SALY', value: `+${row.saly_primary}%`, delta: row.saly_primary, trend: 'up', subtitle: 'vs SPLY', category: 'pipeline' },
        { id: 'secondary_saly', label: 'Secondary SALY', value: `${row.saly_secondary}%`, delta: row.saly_secondary, trend: 'down', subtitle: 'vs SPLY', category: 'pipeline' },
        { id: 'billing_freq', label: 'Billing Freq', value: `${row.billing_frequency}/mo`, delta: null, trend: null, subtitle: 'Times billed monthly', category: 'execution' },
      ];
    }
    case 'S-04': {
      const row = l2ChannelMix.find(r => r.district === geo_id) || l2ChannelMix[0];
      return [
        { id: 'gt_share', label: 'GT Share', value: `${row.gt_share}%`, delta: row.gt_share_delta_sply, trend: 'down', subtitle: `Δ SPLY: ${row.gt_share_delta_sply}pp`, category: 'channel' },
        { id: 'mt_share', label: 'MT Share', value: `${row.mt_share}%`, delta: null, trend: 'up', subtitle: 'Growing channel', category: 'channel' },
        { id: 'qc_share', label: 'QC Share', value: `${row.qc_share}%`, delta: null, trend: null, subtitle: 'Quick commerce', category: 'channel' },
        { id: 'ecomm_share', label: 'E-comm Share', value: `${row.ecomm_share}%`, delta: null, trend: null, subtitle: 'E-commerce', category: 'channel' },
        { id: 'structural', label: 'Structural Shift', value: row.structural_shift ? 'Yes' : 'No', delta: null, trend: row.structural_shift ? 'up' : null, subtitle: 'Systemic shift detected', category: 'risk' },
        { id: 'gt_delta', label: 'GT Δ SPLY', value: `${row.gt_share_delta_sply}pp`, delta: row.gt_share_delta_sply, trend: 'down', subtitle: 'GT share change vs SPLY', category: 'risk' },
      ];
    }
    case 'S-05': {
      const row = l2Territory.find(r => r.district === geo_id) || l2Territory[4];
      return [
        { id: 'visit_compliance', label: 'Visit Compliance', value: `${row.visit_compliance}%`, delta: finding.drift_magnitude, trend: 'down', subtitle: `${row.actual_visited}/${row.planned_outlets} outlets`, category: 'territory' },
        { id: 'productive_calls', label: 'Productive Calls', value: `${row.productive_calls}%`, delta: null, trend: 'down', subtitle: 'Effective visit rate', category: 'territory' },
        { id: 'mau', label: 'MAU', value: `${row.mau}%`, delta: null, trend: 'down', subtitle: 'Monthly active users', category: 'sfa' },
        { id: 'pjp_mau', label: 'PJP MAU', value: `${row.pjp_mau}%`, delta: null, trend: 'down', subtitle: 'PJP compliance', category: 'sfa' },
        { id: 'beat_revenue', label: 'Beat Revenue', value: `₹${(row.beat_revenue / 100000).toFixed(1)}L`, delta: null, trend: 'down', subtitle: `vs design: ${row.beat_revenue_vs_design}%`, category: 'territory' },
        { id: 'lines_per_call', label: 'Avg Lines/Call', value: row.avg_lines_per_call, delta: null, trend: 'down', subtitle: 'SKU depth per visit', category: 'execution' },
      ];
    }
    case 'S-06': {
      const row = l2Promo.find(r => r.district === geo_id) || l2Promo[2];
      return [
        { id: 'participation_rate', label: 'Participation Rate', value: `${row.participation_rate}%`, delta: finding.drift_magnitude, trend: 'down', subtitle: `${row.participating_outlets}/${row.eligible_outlets} outlets`, category: 'promo' },
        { id: 'uplift_pct', label: 'Uplift %', value: `${row.uplift_pct}%`, delta: null, trend: 'down', subtitle: 'Target: 15%', category: 'promo' },
        { id: 'roi', label: 'ROI', value: `${row.roi}x`, delta: null, trend: 'down', subtitle: 'Scheme return on investment', category: 'promo' },
        { id: 'uplift_value', label: 'Uplift Value', value: `₹${(row.uplift_value / 100000).toFixed(2)}L`, delta: null, trend: 'down', subtitle: 'Incremental sales value', category: 'promo' },
        { id: 'eligible_outlets', label: 'Eligible Outlets', value: row.eligible_outlets, delta: null, trend: null, subtitle: 'Total scheme eligible', category: 'promo' },
        { id: 'scheme_name', label: 'Scheme', value: row.name.slice(0, 20) + '…', delta: null, trend: null, subtitle: `ID: ${row.scheme_id}`, category: 'info' },
      ];
    }
    case 'S-07': {
      return l2Benchmark.slice(0, 6).map(r => ({
        id: r.metric.toLowerCase().replace(/\W+/g, '_'),
        label: r.metric,
        value: `${r.client_value}${r.metric.includes('%') ? '%' : ''}`,
        delta: r.gap_to_median,
        trend: r.gap_to_median < 0 ? 'down' : 'up',
        subtitle: `P${r.percentile_rank} · Gap: ${r.gap_to_median}`,
        category: 'benchmark',
      }));
    }
    case 'S-08': {
      const row = l2Outstanding.find(r => r.distributor_id === 'DB-006') || l2Outstanding[0];
      return [
        { id: 'outstanding_pct', label: 'Outstanding:Primary', value: `${row.outstanding_vs_primary}%`, delta: finding.drift_magnitude, trend: 'up', subtitle: 'Threshold: 30%', category: 'outstanding' },
        { id: 'collection_rate', label: 'Collection Rate', value: `${row.collection_rate}%`, delta: null, trend: 'down', subtitle: 'Down from 72% in Jan', category: 'outstanding' },
        { id: 'outstanding_gt30', label: '>30d Outstanding', value: `₹${(row.outstanding_gt30d / 100000).toFixed(1)}L`, delta: null, trend: 'up', subtitle: 'Growing month-on-month', category: 'risk' },
        { id: 'total_outstanding', label: 'Total Outstanding', value: `₹${(row.total_outstanding / 100000).toFixed(1)}L`, delta: null, trend: 'up', subtitle: `Distributor: ${row.name}`, category: 'outstanding' },
        { id: 'collection_value', label: 'Collection Value', value: `₹${(row.collection_value / 100000).toFixed(1)}L`, delta: null, trend: 'down', subtitle: 'Actual collections', category: 'outstanding' },
        { id: 'distributor', label: 'Distributor', value: row.name, delta: null, trend: null, subtitle: `${row.district} · ${row.distributor_id}`, category: 'info' },
      ];
    }
    case 'S-09': {
      const row = l2Demand.find(r => r.district === geo_id) || l2Demand[4];
      return [
        { id: 'demand_index', label: 'Demand Index', value: `P${row.demand_index}`, delta: null, trend: 'up', subtitle: `${row.category} · ${row.district}`, category: 'demand' },
        { id: 'demand_dist_gap', label: 'Demand-Dist Gap', value: `${row.demand_vs_distribution_gap}pp`, delta: null, trend: 'up', subtitle: 'Unmet demand potential', category: 'opportunity' },
        { id: 'hotspot_score', label: 'Hotspot Score', value: row.hotspot_score, delta: null, trend: null, subtitle: 'Priority score 0–100', category: 'demand' },
        { id: 'market_share', label: 'Market Share Est.', value: `${row.market_share_estimate}%`, delta: null, trend: 'down', subtitle: 'Current share estimate', category: 'demand' },
        { id: 'nd_pct', label: 'ND%', value: `${finding.current_value}%`, delta: null, trend: 'down', subtitle: 'Current numeric distribution', category: 'reach' },
        { id: 'opportunity', label: 'Potential', value: '₹2.5Cr', delta: null, trend: null, subtitle: 'Estimated unlock value', category: 'opportunity' },
      ];
    }
    default:
      return [];
  }
}

// ============================================================
// AI INSIGHTS (pre-authored per finding)
// ============================================================
const aiInsights = {
  'F-001': '**Reach Erosion — Kanpur** is showing a textbook churn-acceleration pattern. With 65 outlets lost vs only 22 added, the net outlet universe is shrinking at 3.2× the historical rate.\n\n**Primary driver**: FLP and OLP town class churn, concentrated in Beat BT-001 and BT-002 under ASM Priya Mehta.\n\n**Risk forecast**: At current churn velocity, ND% will fall below 45% within 6 weeks — triggering an estimated secondary sales decline of ₹18–22L/month.\n\n**Immediate action**: Launch a 15-day outlet re-activation blitz in Kanpur FLP belt. Target the 42 identifiable churned outlets with ASM-led personal visits and a recovery offer.',
  'F-002': '**Extraction Decay — Allahabad** shows a compounding SKU-depth problem. Lines/call at 2.0 vs regional average of 2.9 indicates severe under-stocking at outlet level.\n\n**Root pattern**: Distributor-level availability gaps are limiting what salesperson Deepak Mishra can offer at point-of-sale — a supply-chain trigger, not a demand issue.\n\n**Benchmark gap**: At 49% extraction vs 88% benchmark, recovering even 20pp would unlock approximately ₹3.8L in additional monthly revenue from this district alone.\n\n**Recommended focus**: Audit stock availability at distributor for the top 12 Hair Care SKUs. Lines/call is the leading indicator — target 2.5 within 4 weeks.',
  'F-003': '**Pipeline Stuffing — North-2** is a Q4 scheme artifact with systemic risk. Primary SALY up 12–25% while secondary is declining 8–18% across 3 distributors signals loading without sell-through.\n\n**Critical risk**: Days of stock at 42–55 days (vs 28-day norm) creates Q1 overhang risk. If secondary doesn\'t recover, 2 of 3 distributors will demand credit correction in April.\n\n**Pattern**: Gupta Agencies, Verma & Sons, and Kumar Enterprises collectively hold ₹14.7Cr in primary inventory the market hasn\'t absorbed.\n\n**Precedent alert**: A similar pattern in North-1 (Q4 FY25) led to a forced returns cycle worth ₹2.1Cr. Immediate Sec:Pri correction required.',
  'F-006': '**Promo Underperformance — Varanasi** reveals a scheme activation failure, not a scheme design failure. 70% of eligible FLP outlets are not participating — but 52% of that gap is simply unawareness.\n\n**Key insight**: Kumar Enterprises has not cascaded scheme communication to outlet level. Beat BT-VNS-01 shows 21% participation vs BT-VNS-06 showing 40% — the gap is 100% correlated with manager engagement.\n\n**Mid-course opportunity**: At 30 days remaining, a targeted activation blitz on 210 non-participating outlets could recover ROI to 1.4×.\n\n**Action urgency**: Every week of delay at current trajectory reduces final ROI by 0.1×.',
  'F-009': '**Outstanding Concentration — Kumar Enterprises** has crossed the point of passive recovery. With >30d outstanding at ₹8.8L and collection rate declining from 72% to 55%, this is now a credit-risk event.\n\n**Pattern**: 3-month consecutive decline in collection rate while primary continued to ship — a control failure in credit monitoring.\n\n**Immediate risk**: If >30d outstanding converts to bad debt, North-2 will take a ₹8.8L one-time hit. Billing frequency has also dropped to 11/month from a historical 16, indicating operational distress at the distributor.\n\n**Recommended**: Pause primary to Kumar Enterprises until outstanding <30d tranche drops below ₹4.5L. Activate legal recovery for >30d portion immediately.',
};

function getAIInsight(finding, kpi) {
  if (aiInsights[finding.finding_id]) return aiInsights[finding.finding_id];
  const { rule_name, geo_id, metric_name, current_value, drift_magnitude, summary_text, causal_dims, consecutive_periods } = finding;
  return `**${rule_name} — ${geo_id}** shows a ${Math.abs(drift_magnitude)}pp ${drift_magnitude < 0 ? 'decline' : 'increase'} in **${metric_name}** (current: ${current_value} vs benchmark: ${finding.comparison_value}).\n\n${summary_text}\n\n**Causal factors**: ${Object.entries(causal_dims || {}).filter(([, v]) => v && typeof v === 'string').map(([k, v]) => `${k}: ${v}`).join(' · ')}\n\n**Trend**: ${consecutive_periods} consecutive periods of drift indicate a structural issue requiring immediate field intervention. ${finding.severity === 'critical' ? 'Escalation to ZSM is recommended.' : 'Review in next weekly planning cycle.'}`;
}

// ============================================================
// SHARED ATOMS
// ============================================================
const sevCfg = {
  critical: { color: 'var(--critical)', bg: 'rgba(239,68,68,0.1)' },
  warning:  { color: 'var(--warning)',  bg: 'rgba(245,158,11,0.1)' },
  info:     { color: 'var(--info)',     bg: 'rgba(59,130,246,0.1)'  },
};

function SevBadge({ severity }) {
  const c = sevCfg[severity] || sevCfg.info;
  return (
    <span className="text-[8.5px] font-bold px-[6px] py-0.5 rounded-[3px] uppercase tracking-[0.6px]"
      style={{ color: c.color, background: c.bg }}>
      {severity}
    </span>
  );
}

function FindingRow({ finding, selected, onClick }) {
  const c = sevCfg[finding.severity] || sevCfg.info;
  return (
    <button onClick={onClick}
      className="w-full text-left px-3 py-2.5 border-l-[3px] transition-all mb-[2px] rounded-r-lg"
      style={{ borderLeftColor: selected ? c.color : 'transparent', background: selected ? c.bg : 'transparent' }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--bg-hover)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
      <div className="flex items-center gap-1.5 mb-1">
        <SevBadge severity={finding.severity} />
        <span className="text-[9px] font-mono font-bold" style={{ color: 'var(--text-muted)' }}>{finding.finding_id}</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: finding.status === 'new' ? 'var(--critical)' : 'var(--border-light)' }} />
      </div>
      <div className="text-[12px] font-semibold leading-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>{finding.rule_name}</div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{finding.geo_id} · {screenDefinitions[finding.target_screen]?.name}</div>
      <div className="text-[10.5px] mt-1 leading-[1.4]" style={{ color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {finding.summary_text}
      </div>
    </button>
  );
}

function KpiCard({ kpi, selected, onClick }) {
  const color = catColor[kpi.category] || 'var(--text-muted)';
  const isBad = kpi.trend === 'down' || (kpi.trend === 'up' && (kpi.category === 'risk' || kpi.category === 'outstanding'));
  return (
    <button onClick={onClick}
      className="text-left p-3 rounded-xl border transition-all"
      style={{
        background: selected ? 'var(--bg-hover)' : 'var(--bg-card)',
        borderColor: selected ? 'var(--accent)' : 'var(--border)',
        boxShadow: selected ? '0 0 0 2px rgba(245,158,11,0.2)' : 'var(--card-shadow)',
      }}>
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="text-[9px] font-bold uppercase tracking-[0.5px]" style={{ color }}>{kpi.category}</span>
        {kpi.trend === 'down' && <TrendingDown size={11} style={{ color: 'var(--critical)', flexShrink: 0 }} />}
        {kpi.trend === 'up' && isBad && <TrendingUp size={11} style={{ color: 'var(--critical)', flexShrink: 0 }} />}
        {kpi.trend === 'up' && !isBad && <TrendingUp size={11} style={{ color: 'var(--success)', flexShrink: 0 }} />}
      </div>
      <div className="text-[20px] font-bold leading-none mb-1" style={{ color: isBad ? 'var(--critical)' : 'var(--text-primary)' }}>
        {String(kpi.value).length > 10 ? String(kpi.value).slice(0, 10) + '…' : kpi.value}
      </div>
      <div className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{kpi.label}</div>
      <div className="text-[9.5px]" style={{ color: 'var(--text-muted)' }}>{kpi.subtitle}</div>
      {kpi.delta !== null && kpi.delta !== undefined && (
        <div className="mt-1.5 text-[9.5px] font-bold" style={{ color: 'var(--critical)' }}>
          {kpi.delta > 0 ? '+' : ''}{kpi.delta}pp drift
        </div>
      )}
    </button>
  );
}

function AIInsightPanel({ text, onClose }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let idx = 0;
    timerRef.current = setInterval(() => {
      if (idx >= text.length) { clearInterval(timerRef.current); setDone(true); return; }
      setDisplayed(prev => prev + text[idx]);
      idx++;
    }, 6);
    return () => clearInterval(timerRef.current);
  }, [text]);

  const html = displayed
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>')
    .replace(/\n/g, '<br/>');

  return (
    <div className="rounded-xl border p-4 mb-4"
      style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.07) 0%,rgba(217,119,6,0.04) 100%)', borderColor: 'rgba(245,158,11,0.3)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={11} style={{ color: 'var(--accent)' }} />
          <span className="text-[9.5px] font-bold uppercase tracking-[0.7px]" style={{ color: 'var(--accent)' }}>AI Insight</span>
          {!done && <span className="w-[3px] h-[14px] rounded-sm inline-block" style={{ background: 'var(--accent)', animation: 'typingBounce 0.8s infinite' }} />}
        </div>
        <button onClick={onClose}
          className="w-5 h-5 flex items-center justify-center rounded opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--text-muted)' }}>
          <X size={10} />
        </button>
      </div>
      <div className="text-[11.5px] leading-[1.7]" style={{ color: 'var(--text-secondary)' }}
        dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function PersonCard({ person, onClick }) {
  const statusColor = { active: 'var(--success)', 'at-risk': 'var(--warning)', critical: 'var(--critical)' };
  return (
    <button onClick={onClick}
      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all mb-1.5"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-black"
        style={{ background: 'var(--accent)' }}>
        {person.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{person.name}</div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{person.role} · {person.region}</div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor[person.status] || 'var(--text-muted)' }} />
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{person.lastContact}</span>
      </div>
      <ChevronRight size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </button>
  );
}

function NoteCard({ note }) {
  const initials = note.author.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div className="px-3 py-2.5 rounded-lg border mb-1.5 relative"
      style={{ background: note.pinned ? 'rgba(245,158,11,0.05)' : 'var(--bg-card)', borderColor: note.pinned ? 'rgba(245,158,11,0.25)' : 'var(--border)' }}>
      {note.pinned && (
        <span className="absolute top-2 right-2.5 text-[8.5px] font-bold" style={{ color: 'var(--accent)' }}>PINNED</span>
      )}
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-black flex-shrink-0"
          style={{ background: 'var(--accent)' }}>
          {initials}
        </div>
        <span className="text-[10.5px] font-semibold" style={{ color: 'var(--text-primary)' }}>{note.author}</span>
        <span className="text-[9px] ml-auto" style={{ color: 'var(--text-muted)' }}>{note.timestamp}</span>
      </div>
      <p className="text-[11px] leading-[1.65]" style={{ color: 'var(--text-secondary)' }}>{note.text}</p>
    </div>
  );
}

function VoiceNoteCard({ vn }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg border mb-1.5"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <button onClick={() => setPlaying(p => !p)}
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{ background: playing ? 'var(--accent)' : 'var(--bg-tertiary)', color: playing ? '#000' : 'var(--text-muted)' }}>
        {playing ? <Volume2 size={12} /> : <Mic size={12} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-[10.5px] font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{vn.author}</div>
        <div className="text-[9.5px] truncate" style={{ color: 'var(--text-muted)' }}>{vn.transcription}</div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{vn.duration}</span>
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{vn.timestamp}</span>
      </div>
    </div>
  );
}

function PersonDetailView({ person, onBack }) {
  const statusColor = { active: 'var(--success)', 'at-risk': 'var(--warning)', critical: 'var(--critical)' };
  const actions = ['Call now', 'Send message', 'Schedule review', 'View beat plan', 'Assign task'];
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 p-4 rounded-xl border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold text-black flex-shrink-0"
          style={{ background: 'var(--accent)' }}>
          {person.avatar}
        </div>
        <div>
          <div className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{person.name}</div>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{person.role} · {person.region}</div>
          <div className="text-[10px] mt-0.5 font-semibold"
            style={{ color: statusColor[person.status] || 'var(--text-muted)' }}>
            ● {person.status.toUpperCase()} · Last contact: {person.lastContact}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          { label: 'Status', value: person.status, color: statusColor[person.status] },
          { label: 'Last Contact', value: person.lastContact, color: 'var(--text-primary)' },
          { label: 'Role', value: person.role, color: 'var(--info)' },
          { label: 'Territory', value: person.region, color: 'var(--text-primary)' },
        ].map(item => (
          <div key={item.label} className="p-2.5 rounded-lg border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="text-[9px] font-bold uppercase tracking-[0.5px] mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
            <div className="text-[11.5px] font-semibold" style={{ color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="text-[9.5px] font-bold uppercase tracking-[0.8px] mb-2" style={{ color: 'var(--text-muted)' }}>Quick Actions</div>
      {actions.map(action => (
        <button key={action}
          className="w-full text-left px-3 py-2 rounded-lg border mb-1.5 flex items-center gap-2 text-[11.5px] font-semibold transition-all"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
          <ChevronRight size={12} />
          {action}
        </button>
      ))}
    </div>
  );
}

// ─── Panel stack helpers ──────────────────────────────────────
function CollapsedStrip({ panel, onClick }) {
  const cfg = PANEL_CFG[panel.type] || PANEL_CFG.findings;
  const { Icon } = cfg;
  const label = panel.type === 'person' ? (panel.person?.name?.split(' ')[0] || 'Person')
    : panel.type === 'beat' ? (panel.beat?.beat_id || 'Beat') : cfg.label;
  return (
    <button onClick={onClick} title={`Back to ${cfg.label}`}
      className="flex-shrink-0 flex flex-col items-center gap-3 py-5 border-r transition-all hover:bg-[var(--bg-hover)]"
      style={{ width: 48, background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <Icon size={13} style={{ color: 'var(--accent)' }} />
      <span style={{ color: 'var(--text-muted)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </span>
    </button>
  );
}
function getPanelStyle(pos, total) {
  if (total === 1) return { flex: '1 1 0%', minWidth: 0 };
  if (pos === 0) return { width: '300px', flexShrink: 0 };
  if (pos === total - 1) return { width: '390px', flexShrink: 0 };
  return { flex: '1 1 0%', minWidth: '280px' };
}
const PANEL_BG = {
  findings:'var(--bg-secondary)', kpis:'var(--bg-primary)',
  detail:'var(--bg-secondary)',  person:'var(--bg-secondary)',
  beat:'var(--bg-primary)',      outlet:'var(--bg-secondary)',
  note:'var(--bg-secondary)',    voicenote:'var(--bg-secondary)',
};

// ============================================================
// MAIN COMPONENT (panel stack — collapses left, pushes right)
// ============================================================
export default function ContextAction() {
  const [open, setOpen] = useState(false);
  const [panelStack, setPanelStack] = useState([{ type: 'findings', id: 'p0' }]);
  const [aiVisible, setAiVisible] = useState(false);
  const [filterSev, setFilterSev] = useState('all');
  const [playingVn, setPlayingVn] = useState(null);

  const MAX_VIS = 3;
  const collapsed = panelStack.slice(0, Math.max(0, panelStack.length - MAX_VIS));
  const visible   = panelStack.slice(Math.max(0, panelStack.length - MAX_VIS));
  const push  = (panel) => setPanelStack(prev => [...prev, { ...panel, id: `${panel.type}_${Date.now()}` }]);
  const popTo = (idx)   => { setPanelStack(prev => prev.slice(0, idx + 1)); setAiVisible(false); };

  const kpPanel = panelStack.find(p => p.type === 'kpis');
  const dtPanel = panelStack.find(p => p.type === 'detail');

  if (!open) return (
    <button onClick={() => setOpen(true)} className="context-action-fab" title="Context Action">
      <Zap size={13} /><span>Context Action</span>
    </button>
  );

  // ── renderPanel switch ──────────────────────────────────────
  const renderPanel = (panel) => {
    const f = panel.finding;
    const aiText = f ? getAIInsight(f, panel.kpi) : '';

    switch (panel.type) {

      // Findings list ─────────────────────────────────────────
      case 'findings': {
        const list = filterSev === 'all' ? driftFindings : driftFindings.filter(x => x.severity === filterSev);
        const selFid = panelStack.find(p => p.type === 'kpis')?.finding?.finding_id;
        return <>
          <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor:'var(--border)' }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.9px]" style={{ color:'var(--text-muted)' }}>Drift Findings</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:'var(--critical-bg)', color:'var(--critical)' }}>{list.length}</span>
            </div>
            <div className="flex gap-1">
              {['all','critical','warning','info'].map(s => (
                <button key={s} onClick={() => setFilterSev(s)}
                  className="text-[8.5px] font-bold px-2 py-1 rounded-md uppercase tracking-[0.4px] transition-all"
                  style={{ background: filterSev===s ? 'var(--accent)' : 'var(--bg-tertiary)', color: filterSev===s ? '#000' : 'var(--text-muted)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {list.map(x => (
              <FindingRow key={x.finding_id} finding={x} selected={selFid===x.finding_id}
                onClick={() => push({ type:'kpis', finding:x })} />
            ))}
          </div>
        </>;
      }

      // KPI cards ─────────────────────────────────────────────
      case 'kpis': {
        const kpis = getKpisForFinding(f);
        const selKid = panelStack.find(p => p.type==='detail')?.kpi?.id;
        return <>
          <div className="px-4 py-3 border-b flex items-start gap-3 flex-shrink-0" style={{ borderColor:'var(--border)', background:'var(--bg-secondary)' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <SevBadge severity={f.severity} />
                <span className="text-[12px] font-bold" style={{ color:'var(--text-primary)' }}>{f.rule_name}</span>
                <span className="text-[9.5px]" style={{ color:'var(--text-muted)' }}>{f.finding_id}·{f.geo_id}</span>
              </div>
              <p className="text-[10.5px] leading-[1.5]" style={{ color:'var(--text-secondary)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{f.summary_text}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[20px] font-bold" style={{ color:'var(--critical)' }}>{f.current_value}{f.metric_name.includes('%')?'%':''}</div>
              <div className="text-[8.5px]" style={{ color:'var(--text-muted)' }}>{f.metric_name}</div>
              <div className="text-[9px] font-bold" style={{ color:'var(--critical)' }}>{f.drift_magnitude>0?'+':''}{f.drift_magnitude}pp</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {aiVisible && <AIInsightPanel key={f.finding_id} text={aiText} onClose={()=>setAiVisible(false)} />}
            <div className="text-[9px] font-bold uppercase tracking-[0.9px] mb-3" style={{ color:'var(--text-muted)' }}>KPIs · click to drill down →</div>
            <div className="grid gap-2.5" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))' }}>
              {kpis.map(kpi => (
                <KpiCard key={kpi.id} kpi={kpi} selected={selKid===kpi.id}
                  onClick={() => push({ type:'detail', finding:f, kpi })} />
              ))}
            </div>
            {f.causal_dims && (
              <div className="mt-5">
                <div className="text-[9px] font-bold uppercase tracking-[0.9px] mb-2" style={{ color:'var(--text-muted)' }}>Causal Dimensions</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(f.causal_dims).filter(([,v])=>v&&typeof v==='string').map(([k,v])=>(
                    <div key={k} className="px-2.5 py-1.5 rounded-lg border" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                      <div className="text-[8px] font-bold uppercase tracking-[0.5px] mb-0.5" style={{ color:'var(--text-muted)' }}>{k.replace(/_/g,' ')}</div>
                      <div className="text-[10.5px] font-semibold" style={{ color:'var(--text-primary)' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>;
      }

      // Detail: people / notes / voice ────────────────────────
      case 'detail': {
        const { kpi } = panel;
        const people  = mockPeople[f.finding_id] || [];
        const notes   = mockNotes[f.finding_id]  || [];
        const vnotes  = mockVoiceNotes[f.finding_id] || [];
        const isBad   = kpi && (kpi.trend==='down'||(kpi.trend==='up'&&(kpi.category==='risk'||kpi.category==='outstanding')));
        return <>
          <div className="px-4 py-2.5 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor:'var(--border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.8px]" style={{ color:'var(--text-muted)' }}>{kpi?.label||'Detail View'}</span>
            <button onClick={()=>setAiVisible(v=>!v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all"
              style={{ background:aiVisible?'var(--accent)':'linear-gradient(135deg,rgba(251,191,36,0.1) 0%,rgba(217,119,6,0.06) 100%)', color:aiVisible?'#000':'var(--accent)', borderColor:'rgba(245,158,11,0.3)' }}>
              <Sparkles size={9}/>AI Insight
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {aiVisible && <AIInsightPanel key={f.finding_id+(kpi?.id||'')} text={aiText} onClose={()=>setAiVisible(false)} />}
            {kpi && (
              <div className="mb-4 p-3 rounded-xl border" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                <div className="text-[8.5px] font-bold uppercase tracking-[0.5px] mb-1" style={{ color:catColor[kpi.category]||'var(--text-muted)' }}>{kpi.category}</div>
                <div className="text-[24px] font-bold leading-none mb-1" style={{ color:isBad?'var(--critical)':'var(--text-primary)' }}>{kpi.value}</div>
                <div className="text-[11.5px] font-semibold" style={{ color:'var(--text-primary)' }}>{kpi.label}</div>
                <div className="text-[9.5px]" style={{ color:'var(--text-muted)' }}>{kpi.subtitle}</div>
              </div>
            )}
            {people.length>0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2"><Users size={10} style={{ color:'var(--text-muted)' }}/><span className="text-[9.5px] font-bold uppercase tracking-[0.9px]" style={{ color:'var(--text-muted)' }}>Assigned People</span></div>
                {people.map(p=><PersonCard key={p.name} person={p} onClick={()=>push({ type:'person', person:p, finding:f })}/>)}
              </div>
            )}
            {notes.length>0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2"><FileText size={10} style={{ color:'var(--text-muted)' }}/><span className="text-[9.5px] font-bold uppercase tracking-[0.9px]" style={{ color:'var(--text-muted)' }}>Notes</span></div>
                {notes.map(n=>(
                  <div key={n.id} className="cursor-pointer mb-1.5" onClick={()=>push({ type:'note', note:n, finding:f })}>
                    <NoteCard note={n}/>
                  </div>
                ))}
              </div>
            )}
            {vnotes.length>0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2"><Mic size={10} style={{ color:'var(--text-muted)' }}/><span className="text-[9.5px] font-bold uppercase tracking-[0.9px]" style={{ color:'var(--text-muted)' }}>Voice Notes</span></div>
                {vnotes.map(v=>(
                  <div key={v.id} className="cursor-pointer mb-1.5" onClick={()=>push({ type:'voicenote', vn:v })}>
                    <VoiceNoteCard vn={v}/>
                  </div>
                ))}
              </div>
            )}
            {people.length===0&&notes.length===0&&vnotes.length===0&&(
              <div className="flex flex-col items-center gap-2 py-8"><Users size={22} style={{ color:'var(--text-muted)', opacity:0.3 }}/><span className="text-[11px]" style={{ color:'var(--text-muted)' }}>No field data for this finding yet</span></div>
            )}
          </div>
        </>;
      }

      // Person profile ────────────────────────────────────────
      case 'person': {
        const { person } = panel;
        const sc = { active:'var(--success)', 'at-risk':'var(--warning)', critical:'var(--critical)' };
        const beats = l2Territory.filter(r=>r.territory_owner?.includes(person.name.split(' ').slice(-1)[0]));
        const dispBeats = beats.length ? beats : l2Territory.slice(0,2);
        const pNotes = (mockNotes[f?.finding_id]||[]).filter(n=>n.author===person.name);
        return <>
          <div className="px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor:'var(--border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.8px]" style={{ color:'var(--text-muted)' }}>{person.role} Profile</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center gap-3 mb-4 p-4 rounded-xl border" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold text-black flex-shrink-0" style={{ background:'var(--accent)' }}>{person.avatar}</div>
              <div>
                <div className="text-[14px] font-bold" style={{ color:'var(--text-primary)' }}>{person.name}</div>
                <div className="text-[11px]" style={{ color:'var(--text-muted)' }}>{person.role}·{person.region}</div>
                <div className="text-[10px] mt-0.5 font-semibold" style={{ color:sc[person.status]||'var(--text-muted)' }}>●{person.status.toUpperCase()}·{person.lastContact}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[{label:'Status',value:person.status,color:sc[person.status]},{label:'Last Contact',value:person.lastContact,color:'var(--text-primary)'},{label:'Role',value:person.role,color:'var(--info)'},{label:'Territory',value:person.region,color:'var(--text-primary)'}].map(m=>(
                <div key={m.label} className="p-2.5 rounded-lg border" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                  <div className="text-[9px] font-bold uppercase tracking-[0.5px] mb-1" style={{ color:'var(--text-muted)' }}>{m.label}</div>
                  <div className="text-[11px] font-semibold" style={{ color:m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
            {dispBeats.length>0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2"><MapPin size={10} style={{ color:'var(--text-muted)' }}/><span className="text-[9.5px] font-bold uppercase tracking-[0.9px]" style={{ color:'var(--text-muted)' }}>Beat Plans · click to drill →</span></div>
                {dispBeats.map(beat=>(
                  <button key={beat.beat_id} onClick={()=>push({ type:'beat', beat, person, finding:f })}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg border mb-1.5 transition-all"
                    style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11.5px] font-semibold" style={{ color:'var(--text-primary)' }}>{beat.beat_id}</div>
                      <div className="text-[9.5px]" style={{ color:'var(--text-muted)' }}>{beat.district}·{beat.actual_visited}/{beat.planned_outlets} outlets</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[13px] font-bold" style={{ color:beat.visit_compliance<70?'var(--critical)':'var(--success)' }}>{beat.visit_compliance}%</div>
                      <div className="text-[8.5px]" style={{ color:'var(--text-muted)' }}>compliance</div>
                    </div>
                    <ChevronRight size={10} style={{ color:'var(--accent)', flexShrink:0 }}/>
                  </button>
                ))}
              </div>
            )}
            {pNotes.length>0 && (
              <div className="mb-4">
                <div className="text-[9.5px] font-bold uppercase tracking-[0.9px] mb-2" style={{ color:'var(--text-muted)' }}>Their Notes</div>
                {pNotes.map(n=><NoteCard key={n.id} note={n}/>)}
              </div>
            )}
            <div className="text-[9.5px] font-bold uppercase tracking-[0.9px] mb-2" style={{ color:'var(--text-muted)' }}>Quick Actions</div>
            {['Call now','Send message','Schedule review','Assign task'].map(a=>(
              <button key={a} className="w-full text-left px-3 py-2 rounded-lg border mb-1.5 flex items-center gap-2 text-[11px] font-semibold transition-all"
                style={{ background:'var(--bg-card)', borderColor:'var(--border)', color:'var(--text-secondary)' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.color='var(--accent)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-secondary)';}}>
                <ChevronRight size={11}/>{a}
              </button>
            ))}
          </div>
        </>;
      }

      // Beat detail ───────────────────────────────────────────
      case 'beat': {
        const { beat } = panel;
        const outlets = [{id:'OL-001',name:'Shiva General Store',type:'FLP',lastVisit:'Mar 28',lastPurchase:'Mar 15',ok:true},{id:'OL-002',name:'Ram Kirana & Co.',type:'FLP',lastVisit:'Mar 29',lastPurchase:'Mar 22',ok:true},{id:'OL-003',name:'Gupta Provisions',type:'OLP',lastVisit:'Mar 20',lastPurchase:'Dec 20',ok:false},{id:'OL-004',name:'Hanuman Stores',type:'FLP',lastVisit:'Mar 25',lastPurchase:'Mar 10',ok:false},{id:'OL-005',name:'New Rajasthan Mart',type:'TLP',lastVisit:'Mar 30',lastPurchase:'Mar 25',ok:true}];
        return <>
          <div className="px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor:'var(--border)', background:'var(--bg-secondary)' }}>
            <div className="text-[12px] font-bold" style={{ color:'var(--text-primary)' }}>{beat.beat_id}</div>
            <div className="text-[9.5px]" style={{ color:'var(--text-muted)' }}>{beat.district}·{beat.territory_owner}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[{label:'Visit Compliance',value:`${beat.visit_compliance}%`,bad:beat.visit_compliance<70},{label:'Productive Calls',value:`${beat.productive_calls}%`,bad:beat.productive_calls<65},{label:'Outlets Visited',value:`${beat.actual_visited}/${beat.planned_outlets}`,bad:false},{label:'MAU',value:`${beat.mau}%`,bad:beat.mau<75},{label:'PJP MAU',value:`${beat.pjp_mau}%`,bad:beat.pjp_mau<70},{label:'Revenue vs Design',value:`${beat.beat_revenue_vs_design}%`,bad:beat.beat_revenue_vs_design<0}].map(m=>(
                <div key={m.label} className="p-2.5 rounded-lg border" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                  <div className="text-[8.5px] font-bold uppercase tracking-[0.5px] mb-0.5" style={{ color:'var(--text-muted)' }}>{m.label}</div>
                  <div className="text-[14px] font-bold" style={{ color:m.bad?'var(--critical)':'var(--success)' }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.9px] mb-2" style={{ color:'var(--text-muted)' }}>Outlets · click to drill →</div>
            {outlets.map(o=>(
              <button key={o.id} onClick={()=>push({ type:'outlet', outlet:o, beat })}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg border mb-1.5 transition-all"
                style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background:o.ok?'var(--success)':'var(--critical)' }}/>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold" style={{ color:'var(--text-primary)' }}>{o.name}</div>
                  <div className="text-[9.5px]" style={{ color:'var(--text-muted)' }}>{o.type}·Last visit:{o.lastVisit}</div>
                </div>
                <div className="text-right flex-shrink-0 mr-1">
                  <div className="text-[9px]" style={{ color:'var(--text-muted)' }}>Last purchase</div>
                  <div className="text-[10.5px] font-semibold" style={{ color:o.ok?'var(--text-primary)':'var(--critical)' }}>{o.lastPurchase}</div>
                </div>
                <ChevronRight size={10} style={{ color:'var(--accent)', flexShrink:0 }}/>
              </button>
            ))}
          </div>
        </>;
      }

      // Outlet detail ─────────────────────────────────────────
      case 'outlet': {
        const { outlet } = panel;
        const visits=[{date:outlet.lastVisit,min:'8',productive:outlet.ok,skus:outlet.ok?4:0},{date:'Mar 14',min:'6',productive:true,skus:3},{date:'Mar 01',min:'5',productive:true,skus:3}];
        return <>
          <div className="px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor:'var(--border)' }}>
            <div className="text-[12px] font-bold truncate" style={{ color:'var(--text-primary)' }}>{outlet.name}</div>
            <div className="text-[9.5px]" style={{ color:'var(--text-muted)' }}>{outlet.type}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="px-3 py-2.5 rounded-xl border mb-4 flex items-center gap-2" style={{ background:outlet.ok?'rgba(34,197,94,0.06)':'rgba(239,68,68,0.06)', borderColor:outlet.ok?'rgba(34,197,94,0.25)':'rgba(239,68,68,0.25)' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:outlet.ok?'var(--success)':'var(--critical)' }}/>
              <span className="text-[11px] font-semibold" style={{ color:outlet.ok?'var(--success)':'var(--critical)' }}>{outlet.ok?'Active · Scheme participating':'At risk · Not participating'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[{label:'Town Class',value:outlet.type,color:'var(--info)'},{label:'Last Purchase',value:outlet.lastPurchase,color:'var(--text-primary)'},{label:'Last Visit',value:outlet.lastVisit,color:'var(--text-primary)'},{label:'Outlet ID',value:outlet.id,color:'var(--text-muted)'}].map(m=>(
                <div key={m.label} className="p-2.5 rounded-lg border" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                  <div className="text-[8.5px] font-bold uppercase tracking-[0.5px] mb-0.5" style={{ color:'var(--text-muted)' }}>{m.label}</div>
                  <div className="text-[11px] font-semibold" style={{ color:m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.9px] mb-2" style={{ color:'var(--text-muted)' }}>Visit History</div>
            {visits.map((v,i)=>(
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg border mb-1.5" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                <div className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ background:v.productive?'var(--success)':'var(--critical)' }}/>
                <div className="flex-1"><div className="text-[10.5px] font-semibold" style={{ color:'var(--text-primary)' }}>{v.date}</div><div className="text-[9px]" style={{ color:'var(--text-muted)' }}>{v.min}min·{v.productive?`${v.skus} SKUs billed`:'Not productive'}</div></div>
              </div>
            ))}
            <div className="text-[9.5px] font-bold uppercase tracking-[0.9px] mt-4 mb-2" style={{ color:'var(--text-muted)' }}>Last SKU Basket</div>
            {['Clinic Plus 400g','Sunsilk 340ml','Dove Conditioner 180ml'].map(s=>(
              <div key={s} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-1" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:'var(--accent)' }}/><span className="text-[10.5px]" style={{ color:'var(--text-primary)' }}>{s}</span>
              </div>
            ))}
          </div>
        </>;
      }

      // Note thread ───────────────────────────────────────────
      case 'note': {
        const { note } = panel;
        const replies=[{author:'RSM Rajesh Sharma',time:'2h later',text:'Acknowledged. Escalating to ZSM for credit policy decision.'},{author:'ZSM Anil Kapoor',time:'Next day',text:'Review scheduled for Apr 5. Hold further primary push until resolved.'}];
        return <>
          <div className="px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor:'var(--border)' }}><span className="text-[10px] font-bold uppercase tracking-[0.8px]" style={{ color:'var(--text-muted)' }}>Note Thread</span></div>
          <div className="flex-1 overflow-y-auto p-4">
            <NoteCard note={note}/>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.9px] mb-2 ml-4 mt-3" style={{ color:'var(--text-muted)' }}>Replies</div>
            {replies.map((r,i)=>{
              const init=r.author.split(' ').map(w=>w[0]).join('').slice(0,2);
              return(
                <div key={i} className="ml-4 px-3 py-2.5 rounded-xl border mb-2" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-black flex-shrink-0" style={{ background:'var(--accent)' }}>{init}</div>
                    <span className="text-[10px] font-semibold" style={{ color:'var(--text-primary)' }}>{r.author}</span>
                    <span className="text-[9px] ml-auto" style={{ color:'var(--text-muted)' }}>{r.time}</span>
                  </div>
                  <p className="text-[11px] leading-[1.6]" style={{ color:'var(--text-secondary)' }}>{r.text}</p>
                </div>
              );
            })}
            <div className="mt-3 ml-4 px-3 py-2.5 rounded-xl border flex items-center gap-2 opacity-50" style={{ borderColor:'var(--border)', background:'var(--bg-card)' }}>
              <span className="text-[10.5px]" style={{ color:'var(--text-muted)' }}>Add a reply…</span>
            </div>
          </div>
        </>;
      }

      // Voice note player ─────────────────────────────────────
      case 'voicenote': {
        const { vn } = panel;
        const bars=Array.from({length:28},(_,i)=>20+Math.sin(i*0.7)*12+Math.sin(i*1.4)*7);
        return <>
          <div className="px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor:'var(--border)' }}><span className="text-[10px] font-bold uppercase tracking-[0.8px]" style={{ color:'var(--text-muted)' }}>Voice Note</span></div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="p-4 rounded-xl border mb-4" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-black flex-shrink-0" style={{ background:'var(--accent)' }}>{vn.author.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                <div><div className="text-[12px] font-semibold" style={{ color:'var(--text-primary)' }}>{vn.author}</div><div className="text-[9.5px]" style={{ color:'var(--text-muted)' }}>{vn.timestamp}·{vn.duration}</div></div>
              </div>
              <div className="flex items-center gap-[2px] h-10 mb-4">
                {bars.map((h,i)=><div key={i} className="flex-1 rounded-full" style={{ height:`${Math.max(3,h*0.85)}px`, background:i<14?'var(--accent)':'var(--border-light)', opacity:i<14?1:0.5 }}/>)}
              </div>
              <button onClick={()=>setPlayingVn(playingVn===vn.id?null:vn.id)}
                className="w-full py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all"
                style={{ background:playingVn===vn.id?'var(--accent)':'var(--bg-tertiary)', color:playingVn===vn.id?'#000':'var(--text-primary)' }}>
                {playingVn===vn.id?<Volume2 size={12}/>:<Mic size={12}/>}{playingVn===vn.id?'Playing…':'Play Recording'}
              </button>
            </div>
            <div className="text-[9.5px] font-bold uppercase tracking-[0.9px] mb-2" style={{ color:'var(--text-muted)' }}>Transcription</div>
            <div className="px-3 py-3 rounded-xl border" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
              <p className="text-[11.5px] leading-[1.7]" style={{ color:'var(--text-secondary)' }}>{vn.transcription}</p>
            </div>
          </div>
        </>;
      }

      default: return null;
    }
  };

  return (
    <div className="context-action-overlay">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b flex-shrink-0"
        style={{ background:'var(--bg-secondary)', borderColor:'var(--border)', borderTop:'2px solid var(--accent)' }}>
        <Zap size={14} style={{ color:'var(--accent)', flexShrink:0 }} />
        <span className="text-[13.5px] font-bold" style={{ color:'var(--text-primary)' }}>Context Action</span>
        {kpPanel?.finding && <>
          <ChevronRight size={11} style={{ color:'var(--text-muted)' }} />
          <span className="text-[11.5px] font-semibold" style={{ color:'var(--text-secondary)' }}>{kpPanel.finding.rule_name}</span>
          <span className="text-[10px]" style={{ color:'var(--text-muted)' }}>{kpPanel.finding.geo_id}</span>
        </>}
        {dtPanel?.kpi && <>
          <ChevronRight size={11} style={{ color:'var(--text-muted)' }} />
          <span className="text-[10.5px] font-bold" style={{ color:'var(--accent)' }}>{dtPanel.kpi.label}</span>
        </>}
        {panelStack.length > 3 && (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold ml-1" style={{ background:'rgba(245,158,11,0.15)', color:'var(--accent)' }}>
            {panelStack.length - 3} collapsed
          </span>
        )}
        {kpPanel && (
          <button onClick={() => setAiVisible(v => !v)}
            className="ml-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.5px] border transition-all"
            style={{ background:aiVisible?'var(--accent)':'linear-gradient(135deg,rgba(251,191,36,0.1) 0%,rgba(217,119,6,0.06) 100%)', color:aiVisible?'#000':'var(--accent)', borderColor:'rgba(245,158,11,0.3)' }}>
            <Sparkles size={9}/>AI Insight
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9px] opacity-40" style={{ color:'var(--text-muted)' }}>ESC</span>
          <button onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--critical-bg)] transition-colors"
            style={{ color:'var(--text-muted)' }}>
            <X size={14}/>
          </button>
        </div>
      </div>

      {/* Body — collapsed strips (breadcrumbs) + up to 3 visible panels */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {collapsed.map((panel, i) => (
          <CollapsedStrip key={panel.id} panel={panel} onClick={() => popTo(i)} />
        ))}
        {visible.map((panel, i) => (
          <div key={panel.id} className="flex flex-col border-r overflow-hidden"
            style={{ ...getPanelStyle(i, visible.length), background:PANEL_BG[panel.type]||'var(--bg-secondary)', borderColor:'var(--border)' }}>
            {renderPanel(panel)}
          </div>
        ))}
      </div>
    </div>
  );
}
