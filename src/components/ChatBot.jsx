import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageSquare, Download, ChevronRight, RotateCcw, Maximize2, Minimize2, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { questionnaireTree } from '../data/questionnaire';
import { screenDefinitions } from '../data/mockData';
import { generatePDF } from '../utils/pdfExport';
import { promoOutlets, promoSalesteam } from '../data/mockData';

function inlineFmt(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
}

function isSep(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

function parseRow(line) {
  return line.split('|').slice(1, -1).map(c => c.trim());
}

function renderTable(lines) {
  const rows = lines.filter(l => !isSep(l));
  if (!rows.length) return '';
  const [hdr, ...body] = rows;
  const headers = parseRow(hdr);
  const dataRows = body.map(parseRow);
  return `<div class="chat-table-wrap"><table><thead><tr>${
    headers.map(h => `<th>${inlineFmt(h)}</th>`).join('')
  }</tr></thead><tbody>${
    dataRows.map(r => `<tr>${r.map(c => `<td>${inlineFmt(c)}</td>`).join('')}</tr>`).join('')
  }</tbody></table></div>`;
}

function renderMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const tr = line.trim();
    // table block
    if (tr.startsWith('|') && tr.endsWith('|')) {
      const block = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) block.push(lines[i++]);
      out.push(renderTable(block));
      continue;
    }
    // headings
    const hm = line.match(/^(#{1,3})\s+(.*)/);
    if (hm) {
      const tag = hm[1].length === 1 ? 'h3' : 'h4';
      out.push(`<${tag} class="chat-heading">${inlineFmt(hm[2])}</${tag}>`);
      i++; continue;
    }
    // unordered list
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i]))
        items.push(`<li>${inlineFmt(lines[i++].replace(/^[-*]\s/, ''))}</li>`);
      out.push(`<ul class="chat-list">${items.join('')}</ul>`);
      continue;
    }
    // ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i]))
        items.push(`<li>${inlineFmt(lines[i++].replace(/^\d+\.\s/, ''))}</li>`);
      out.push(`<ol class="chat-list">${items.join('')}</ol>`);
      continue;
    }
    // empty
    if (!tr) { out.push('<div class="chat-spacer"></div>'); i++; continue; }
    // paragraph
    out.push(`<p>${inlineFmt(line)}</p>`);
    i++;
  }
  return out.join('');
}

// ─── Finding Drill-Down Helpers ────────────────────────────────────────────
function fUnit(finding) {
  const n = finding.metric_name || '';
  return (n.includes('%') || n.includes('Rate') || n.includes('Uplift') ||
    n.includes('Share') || n.includes('ND') || n.includes('MAU') ||
    n.includes('Participation') || n.includes('Churn')) ? '%' : '';
}

function buildFindingIntro(finding) {
  const u = fUnit(finding);
  const focusLine = finding.focusMetric
    ? `\n\nYou right-clicked **${finding.focusMetric}** — I'll use this as the starting point for our analysis.`
    : '';
  const isPromo = finding.rule_id === 'DA-06' || finding.rule_id === 'DB-05' || finding.target_screen === 'S-06';
  const extraCapabilities = isPromo
    ? `\n\nYou can also ask me to show:\n- **Outlets not participating** (with reasons)\n- **Sales managers** assigned to these outlets\n- **Salespeople** and their beat performance\n- **Last purchase dates** and churn risk\n- **Key metrics** summary table`
    : '';
  return `## ${finding.rule_name} — ${finding.geo_id}${focusLine}\n\nI've loaded **${finding.finding_id}** for deep analysis.\n\n**${finding.metric_name}:** ${finding.current_value}${u} vs ${finding.comparison_value}${u} benchmark — **${finding.drift_magnitude > 0 ? '+' : ''}${finding.drift_magnitude}pp drift**\n\n${finding.summary_text}\n\n**Severity:** ${finding.severity} · **Status:** ${finding.status} · **Period:** ${finding.period_start} → ${finding.period_end}\n\nAsk me anything — root cause, actions, business impact, ownership, or benchmark comparison.${extraCapabilities}`;
}

function buildFindingResponse(finding, query) {
  const lq = query.toLowerCase();
  const u = fUnit(finding);
  const causal = finding.causal_dims || {};

  if (/\b(what|explain|describe|tell|summary|about|overview|detail)\b/.test(lq)) {
    return `## Summary: ${finding.rule_name}\n\n**Finding ID:** ${finding.finding_id} · **Rule:** ${finding.rule_id}\n**Geography:** ${finding.geo_id} (${Object.values(finding.geo_ancestors || {}).join(' › ')})\n**Metric:** ${finding.metric_name} = **${finding.current_value}${u}** vs **${finding.comparison_value}${u}**\n\n${finding.summary_text}\n\n**Drift:** ${finding.drift_magnitude > 0 ? '+' : ''}${finding.drift_magnitude}pp · **Direction:** ${finding.drift_direction} · **Consecutive periods:** ${finding.consecutive_periods}`;
  }

  if (/\b(why|cause|reason|root|driver|factor|how did|triggered|behind)\b/.test(lq)) {
    const parts = [];
    if (causal.territory_owner) parts.push(`- **Territory owner:** ${causal.territory_owner}`);
    if (causal.distributor) parts.push(`- **Distributor:** ${causal.distributor}`);
    if (causal.channel) parts.push(`- **Channel:** ${causal.channel}`);
    if (causal.category) parts.push(`- **Category:** ${causal.category}`);
    if (causal.outlet_class) parts.push(`- **Outlet class most affected:** ${causal.outlet_class}`);
    return `## Root Cause Analysis — ${finding.rule_name}\n\nThe **${finding.drift_magnitude > 0 ? '+' : ''}${finding.drift_magnitude}pp** drift in ${finding.metric_name} for **${finding.geo_id}** has persisted for **${finding.consecutive_periods} period(s)** since ${finding.period_start}.\n\n**Key causal dimensions:**\n${parts.join('\n')}\n\n${finding.summary_text}\n\nThis pattern suggests a ${finding.consecutive_periods >= 3 ? '**systemic structural failure**' : '**early-stage execution gap**'} requiring targeted field intervention.`;
  }

  if (/\b(recommend|suggest|action|fix|improve|what should|next step|do|plan|resolve|address|intervention)\b/.test(lq)) {
    const ruleRecs = {
      'DA-06': [
        '**Immediate (0–7 days):** Review participation blockers with ASM Rahul Singh — check outlet awareness of scheme, eligibility criteria, and distributor push',
        '**Activation drive:** Deploy focused scheme activation for the 70% non-participating eligible outlets in Varanasi FLP class',
        '**Distributor engagement:** Work with Kumar Enterprises to identify supply-side and coverage gaps limiting participation',
        '**Incentive review:** Consider relaxing eligibility criteria or increasing per-outlet incentive to bridge 30% → 60% participation',
        '**Scheme ROI:** At 0.7x ROI, evaluate early scheme modification before further sunk investment. Flag to Trade Marketing.',
        '**Weekly tracking:** Set weekly participation rate and uplift review until recovery to ≥12% uplift is confirmed',
      ],
      'DA-01': [
        '**Outlet recovery:** Launch targeted re-activation drive in Kanpur FLP+OLP town classes',
        '**Churn analysis:** Profile churned outlets (65 lost) — identify common factors for win-back strategy',
        '**ASM review:** Weekly beat productivity review with ASM Priya Mehta for affected territories',
        '**Coverage target:** Net additions must exceed 50/month for 2 months to recover ND% to SPLY levels',
      ],
      'DA-03': [
        '**Pipeline audit:** Conduct stock audit for Gupta Agencies, Verma & Sons, Kumar Enterprises',
        '**Billing discipline:** Enforce secondary-first billing cycle correction',
        '**Weekly monitoring:** Implement Sec:Pri ratio dashboard with distributor-level alerts',
        '**Incentive restructure:** Delink primary volume incentives from secondary compliance targets',
      ],
    };
    const recs = ruleRecs[finding.rule_id] || [
      `**Escalate to** ${causal.territory_owner || 'territory ASM'} for immediate review`,
      `**Investigate distributor** ${causal.distributor || 'in scope'} — assess capability and compliance gaps`,
      `**Set weekly review cadence** for ${finding.metric_name} tracking until recovery to target`,
      '**Root cause workshop:** Structured 5-Why analysis with field team',
      `**Update territory action plan** to reflect corrective measures for ${finding.geo_id}`,
    ];
    return `## Recommended Actions — ${finding.rule_name}\n\nAddressing the **${finding.drift_magnitude > 0 ? '+' : ''}${finding.drift_magnitude}pp** drift in **${finding.metric_name}** for ${finding.geo_id}:\n\n${recs.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**Priority:** ${finding.severity === 'critical' ? 'HIGH — requires immediate escalation' : 'MEDIUM — address within current planning cycle'}`;
  }

  if (/\b(impact|effect|consequence|business|revenue|cost|loss|risk|financial)\b/.test(lq)) {
    return `## Business Impact — ${finding.rule_name}\n\n**Geography:** ${finding.geo_id} · **Metric:** ${finding.metric_name}\n\n${finding.summary_text}\n\n**Duration risk:** Persisted for **${finding.consecutive_periods} period(s)** since ${finding.period_start}. Prolonged drift compounds structural cost.\n\n**Severity:** ${finding.severity === 'critical' ? '**Critical** — immediate revenue leakage, requires escalation' : '**Warning** — growing risk if not addressed within current cycle'}\n\n${finding.consecutive_periods >= 3 ? '**Pattern alert:** 3+ consecutive periods indicates systemic failure, not seasonal variance. Recovery effort scales with delay.' : '**Note:** Single-period finding — early intervention can prevent escalation to critical.'}`;
  }

  if (/\b(compare|vs|versus|benchmark|target|peer|cohort|rank|percentile|gap)\b/.test(lq)) {
    return `## Benchmark Comparison — ${finding.rule_name}\n\n| Dimension | Current | Benchmark / Target | Gap |\n|---|---|---|---|\n| ${finding.metric_name} | ${finding.current_value}${u} | ${finding.comparison_value}${u} | ${finding.drift_magnitude > 0 ? '+' : ''}${finding.drift_magnitude}pp |\n\n**Geography:** ${finding.geo_id} vs ${finding.geo_level === 'region' ? 'cohort median / SPLY' : 'target / SPLY'}\n**Drift direction:** ${finding.drift_direction} · **Consecutive periods flagged:** ${finding.consecutive_periods}\n\n${finding.drift_direction === 'widening' ? '**The gap is actively widening** — not just below benchmark but moving further from it each period.' : `The metric is **${finding.drift_magnitude < 0 ? 'below' : 'above'}** target and has been consistently ${finding.drift_direction} for ${finding.consecutive_periods} period(s).`}${causal.distributor ? `\n\n**Distributor context:** ${causal.distributor} is the primary execution lever in this geography.` : ''}`;
  }

  if (/\b(who|owner|asm|responsible|person|contact|distributor|territory|accountab)\b/.test(lq)) {
    const parts = [];
    if (causal.territory_owner) parts.push(`- **Territory Owner:** ${causal.territory_owner}`);
    if (causal.distributor) parts.push(`- **Distributor:** ${causal.distributor}${causal.distributor_id ? ` (${causal.distributor_id})` : ''}`);
    if (causal.channel) parts.push(`- **Channel scope:** ${causal.channel}`);
    if (causal.category) parts.push(`- **Category scope:** ${causal.category}`);
    if (causal.outlet_class) parts.push(`- **Outlet class:** ${causal.outlet_class}`);
    return `## Ownership & Accountability — ${finding.rule_name}\n\n**Finding:** ${finding.finding_id} · ${finding.geo_id}\n\n${parts.join('\n')}\n\nThis finding is currently **${finding.status}** and has been active since **${finding.period_start}**. The territory owner should be engaged immediately for a corrective action plan.`;
  }

  if (/\b(when|period|time|duration|how long|start|since|months|history|trend)\b/.test(lq)) {
    return `## Timeline — ${finding.rule_name}\n\n- **First detected:** ${finding.period_start}\n- **Last observed:** ${finding.period_end}\n- **Consecutive periods flagged:** ${finding.consecutive_periods}\n- **Current status:** ${finding.status}\n\nThe drift has been **${finding.drift_direction === 'down' || finding.drift_direction === 'widening' ? 'worsening' : 'ongoing'}** for ${finding.consecutive_periods} period(s) with no recovery signal in the latest data.\n\n${finding.consecutive_periods >= 3 ? '**3+ consecutive periods indicates a structural trend, not seasonal noise.** Prioritized field intervention required.' : '**Single period finding** — caught early. Immediate action can prevent escalation.'}`;
  }

  // ── Outlet-level drill-down (DA-06 Promo) ────────────────────────────────
  const isPromoFinding = finding.rule_id === 'DA-06' || finding.rule_id === 'DB-05' || finding.target_screen === 'S-06';

  if (isPromoFinding && /outlets?|stores?|shops?|retail|kirana/.test(lq)) {
    const showPart    = /participat/.test(lq) && !/not|non/.test(lq);
    const showAll     = /\ball\b/.test(lq) || !/participat/.test(lq);
    const rows = showPart
      ? promoOutlets.filter(o => o.participated)
      : promoOutlets.filter(o => !o.participated);
    const header = showPart
      ? `## Participating Outlets — SCH-003 · Varanasi · FLP\n\n**${rows.length} of ${promoOutlets.length} eligible outlets** participated.\n\n`
      : `## Non-Participating Outlets — SCH-003 · Varanasi · FLP\n\n**${rows.length} of ${promoOutlets.length} eligible outlets** have NOT participated. Key blockers: Unaware (3), Low visit frequency (3), Eligibility mismatch (2), Stock shortage (2).\n\n`;
    const tableLines = [
      `| # | Outlet | Beat | Salesperson | Last Purchase | ${showPart ? 'Status' : 'Reason'} |`,
      `|---|---|---|---|---|---|`,
      ...rows.map((o, i) => `| ${i + 1} | ${o.name} | ${o.beat} | ${o.salesperson} | ${o.last_purchase} | ${showPart ? '✓ Participated' : o.reason} |`),
    ];
    return header + tableLines.join('\n') + `\n\n*Scheme: SCH-003 Rural Penetration · District: ${rows[0]?.district} · Town class: FLP*`;
  }

  if (isPromoFinding && /managers?|asm|area.?sales|territory.?manager/.test(lq)) {
    const header = `## Sales Managers — SCH-003 · Varanasi · FLP\n\n**Territory Manager:** Rahul Singh owns all 7 beats. Scheme participation performance by beat below:\n\n`;
    const tableLines = [
      `| Beat | Salesperson | Eligible Outlets | Participated | Rate | Visit Compliance |`,
      `|---|---|---|---|---|---|`,
      ...promoSalesteam.map(se => `| ${se.beat} | ${se.name} | ${se.outlets_eligible} | ${se.participated} | ${se.participation_pct}% | ${se.visit_compliance}% |`),
    ];
    const summary = `\n\n**Total eligible:** ${promoSalesteam.reduce((s, e) => s + e.outlets_eligible, 0)} outlets · **Total participated:** ${promoSalesteam.reduce((s, e) => s + e.participated, 0)} · **Avg rate:** ${Math.round(promoSalesteam.reduce((s, e) => s + e.participation_pct, 0) / promoSalesteam.length)}%\n\n> Best performer: **Suresh Pandey** (40% rate, BT-VNS-06) · Worst: **Amit Kumar** (21%, BT-VNS-01)`;
    return header + tableLines.join('\n') + summary;
  }

  if (isPromoFinding && /sales.?(person|people|rep|executive|se\b|team|force)|salesperson|salespeople|field.rep/.test(lq)) {
    const header = `## Salesperson Performance — SCH-003 · Varanasi · FLP\n\n**7 SEs** assigned across ${promoSalesteam.length} beats. Ranked by participation rate:\n\n`;
    const sorted = [...promoSalesteam].sort((a, b) => b.participation_pct - a.participation_pct);
    const tableLines = [
      `| Rank | SE Name | Beat | Assigned | Eligible | Participated | Rate | Last Visit | Compliance |`,
      `|---|---|---|---|---|---|---|---|---|`,
      ...sorted.map((se, i) => `| ${i + 1} | ${se.name} | ${se.beat} | ${se.outlets_assigned} | ${se.outlets_eligible} | ${se.participated} | ${se.participation_pct}% | ${se.last_visit} | ${se.visit_compliance}% |`),
    ];
    const low = sorted.filter(s => s.participation_pct < 25);
    const note = low.length ? `\n\n**⚠ Low performers (< 25%):** ${low.map(s => `${s.name} (${s.participation_pct}%)`).join(', ')} — immediate coaching required.` : '';
    return header + tableLines.join('\n') + note;
  }

  if (isPromoFinding && /last.?purchase|purchase.?date|last.?order|last.?(bought|buy|transaction)|inactive|when.*(buy|bought|purchased|ordered)/.test(lq)) {
    const nonPart = promoOutlets.filter(o => !o.participated).sort((a, b) => a.last_purchase.localeCompare(b.last_purchase));
    const today = new Date('2026-03-31');
    const daysSince = (d) => Math.round((today - new Date(d)) / 86400000);
    const header = `## Last Purchase Dates — Non-Participating Outlets · Varanasi · FLP\n\nSorted by oldest purchase. Outlets inactive > 60 days are high-risk for churn.\n\n`;
    const tableLines = [
      `| Outlet | Salesperson | Last Purchase | Days Since | Risk |`,
      `|---|---|---|---|---|`,
      ...nonPart.map(o => {
        const d = daysSince(o.last_purchase);
        const risk = d > 90 ? '🔴 Critical' : d > 60 ? '🟡 High' : d > 30 ? '🟠 Medium' : '🟢 Low';
        return `| ${o.name} | ${o.salesperson} | ${o.last_purchase} | ${d}d | ${risk} |`;
      }),
    ];
    const critical = nonPart.filter(o => daysSince(o.last_purchase) > 60).length;
    return header + tableLines.join('\n') + `\n\n**${critical} outlets** are inactive > 60 days and at high churn risk. Immediate outreach required.`;
  }

  if (isPromoFinding && /metrics?|kpis?|numbers?|stats?|figures?|summary.?table|overview.?table/.test(lq)) {
    return `## Key Metrics — SCH-003 Rural Penetration · Varanasi\n\n| Metric | Current | Target | Gap |\n|---|---|---|---|\n| Promo Uplift | 5% | 15% | -10pp |\n| Participation Rate | 30% | 60% | -30pp |\n| Non-Participating Outlets | 14 / 20 | — | 70% |\n| ROI | 0.7x | >1.5x | -0.8x |\n| Avg Scheme Spend / Outlet | ₹4,167 | — | — |\n| Total Scheme Spend | ₹12.5L | ₹15L budget | -₹2.5L |\n\n**Beat-level participation summary:**\n\n| Beat | SE | Rate | Compliance |\n|---|---|---|---|\n${promoSalesteam.map(s => `| ${s.beat} | ${s.name} | ${s.participation_pct}% | ${s.visit_compliance}% |`).join('\n')}`;
  }

  // ── Fallback ─────────────────────────────────────────────────────────────
  return `Based on the **${finding.rule_name}** finding for **${finding.geo_id}**:\n\n${finding.summary_text}\n\nYou can ask me:\n- **Why** is this happening? (root cause)\n- What **actions** should I take?\n- What is the **business impact**?\n- How does this **compare** to benchmark?\n- **Who** is responsible? (ownership)\n- **When** did this start? (timeline)\n- Show **outlets not participating**\n- Show **sales managers** / **salespeople**\n- Show **last purchase dates**\n- Show **key metrics** table`;
}
// ─────────────────────────────────────────────────────────────────────────────

const DRILL_QUESTIONS_GENERIC = [
  { label: 'Why is this happening?', sub: 'root cause', query: 'Why is this happening? root cause' },
  { label: 'What actions should I take?', sub: 'recommendations', query: 'What actions should I take? recommendations' },
  { label: 'What is the business impact?', sub: 'impact', query: 'What is the business impact?' },
  { label: 'How does this compare to benchmark?', sub: 'comparison', query: 'How does this compare to benchmark?' },
  { label: 'Who is responsible?', sub: 'ownership', query: 'Who is responsible? ownership' },
  { label: 'When did this start?', sub: 'timeline', query: 'When did this start? timeline' },
];

const DRILL_QUESTIONS_PROMO = [
  ...DRILL_QUESTIONS_GENERIC,
  { label: 'Show outlets not participating', sub: 'outlet list', query: 'Show outlets not participating', accent: true },
  { label: 'Show sales managers', sub: 'by beat', query: 'Show sales managers assigned to these outlets', accent: true },
  { label: 'Show salespeople assigned', sub: 'SE performance', query: 'Show salespeople assigned to these outlets', accent: true },
  { label: 'Show last purchase dates', sub: 'churn risk', query: 'Show last purchase dates of these outlets', accent: true },
  { label: 'Show key metrics table', sub: 'summary', query: 'Show key metrics summary table', accent: true },
];

const BotAvatar = ({ size = 28 }) => (
  <div
    className="flex items-center justify-center font-black text-black flex-shrink-0"
    style={{
      width: size, height: size, borderRadius: 8,
      background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      fontSize: size * 0.45, boxShadow: '0 1px 4px rgba(245,158,11,0.35)',
    }}
  >✦</div>
);

function ChatMessage({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-2.5 items-end animate-in ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && <BotAvatar size={28} />}
      <div
        className={[
          'max-w-[86%] text-[12.5px] leading-[1.62]',
          isBot
            ? 'bg-[var(--bg-card)] text-[var(--text-primary)] rounded-[4px_14px_14px_14px] px-[14px] py-[11px]'
            : 'rounded-[14px_4px_14px_14px] px-[14px] py-[10px] font-medium',
        ].join(' ')}
        style={isBot
          ? { boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px var(--border)' }
          : { background: 'var(--accent)', color: '#000' }
        }
      >
        {isBot
          ? <div className="chat-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
          : <div>{msg.content}</div>
        }
        {msg.navigatedTo && (
          <div className="mt-2 pt-2 border-t border-[rgba(0,0,0,0.06)] text-[10px] flex items-center gap-1.5" style={{ color: 'var(--info)' }}>
            <span className="w-1 h-1 rounded-full bg-[var(--success)]" />
            Navigated to {screenDefinitions[msg.navigatedTo]?.name}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const { chatOpen, setChatOpen, currentScreen, chatHistory, addChatMessage, resetChat, activeFinding, setActiveFinding } = useApp();
  const navigate = useNavigate();
  const [nodeKey, setNodeKey] = useState('entry');
  const [screenKey, setScreenKey] = useState(currentScreen);
  const [expanded, setExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigatingViaOption = useRef(false);
  const [inputValue, setInputValue] = useState('');
  const [findingDrillContext, setFindingDrillContext] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (currentScreen !== screenKey) {
      setScreenKey(currentScreen);
      setNodeKey('entry');
    }
  }, [currentScreen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatOpen]);

  useEffect(() => {
    if (!activeFinding) return;
    const f = activeFinding;
    setFindingDrillContext(f);
    setActiveFinding(null);
    setScreenKey(f.target_screen);
    setNodeKey('entry');
    setTimeout(() => {
      addChatMessage({ role: 'bot', content: buildFindingIntro(f) });
    }, 120);
  }, [activeFinding]);

  useEffect(() => {
    if (!chatOpen) return;
    if (findingDrillContext) return;
    if (navigatingViaOption.current) return;
    const tree = questionnaireTree[screenKey];
    if (!tree) return;
    const node = tree[nodeKey] || tree['entry'];
    if (!node) return;
    const lastMsg = chatHistory[chatHistory.length - 1];
    if (!lastMsg || lastMsg.role === 'user') {
      addChatMessage({ role: 'bot', content: node.message, showChart: node.showChart });
    }
  }, [chatOpen, screenKey]);

  const currentNode = () => {
    const tree = questionnaireTree[screenKey];
    if (!tree) return null;
    return tree[nodeKey] || tree['entry'];
  };

  const handleOption = (option) => {
    addChatMessage({ role: 'user', content: option.label });
    if (option.navigateTo) {
      const screen = screenDefinitions[option.navigateTo];
      if (screen) {
        navigatingViaOption.current = true;
        setIsNavigating(true);
        setTimeout(() => {
          navigate(screen.path);
          setScreenKey(option.navigateTo);
          setIsNavigating(false);
          const newTree = questionnaireTree[option.navigateTo];
          const nextNodeKey = option.next || 'entry';
          const nextNode = newTree ? (newTree[nextNodeKey] || newTree['entry']) : null;
          if (nextNode) {
            setTimeout(() => {
              addChatMessage({ role: 'bot', content: nextNode.message, showChart: nextNode.showChart, navigatedTo: option.navigateTo });
              setNodeKey(nextNodeKey);
              navigatingViaOption.current = false;
            }, 400);
          } else {
            navigatingViaOption.current = false;
          }
        }, 200);
        return;
      }
    }
    if (option.next) {
      const tree = questionnaireTree[screenKey];
      if (!tree) return;
      const nextNode = tree[option.next];
      if (nextNode) {
        setTimeout(() => {
          addChatMessage({ role: 'bot', content: nextNode.message, showChart: nextNode.showChart });
          setNodeKey(option.next);
        }, 300);
      }
    }
  };

  const handleFreeInput = (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query || isNavigating) return;
    setInputValue('');
    addChatMessage({ role: 'user', content: query });

    if (findingDrillContext) {
      setTimeout(() => {
        addChatMessage({ role: 'bot', content: buildFindingResponse(findingDrillContext, query) });
      }, 320);
      return;
    }

    // Keyword match across all nodes in current + all screens
    const lq = query.toLowerCase();
    const keywords = lq.split(/\s+/).filter(w => w.length > 2);

    let best = null;
    let bestScore = 0;

    const searchTree = (treeKey, tree) => {
      for (const [nodeId, node] of Object.entries(tree)) {
        for (const opt of (node.options || [])) {
          const score = keywords.filter(k => opt.label.toLowerCase().includes(k)).length;
          if (score > bestScore) { bestScore = score; best = { treeKey, nodeId, node, opt }; }
        }
        const msgScore = keywords.filter(k => (node.message || '').toLowerCase().includes(k)).length;
        if (msgScore > bestScore + 1) { bestScore = msgScore; best = { treeKey, nodeId, node, opt: null }; }
      }
    };

    // Search current screen first, then all others
    const currentTree = questionnaireTree[screenKey];
    if (currentTree) searchTree(screenKey, currentTree);
    if (bestScore < 2) {
      for (const [sk, tree] of Object.entries(questionnaireTree)) {
        if (sk !== screenKey) searchTree(sk, tree);
      }
    }

    setTimeout(() => {
      if (best && bestScore > 0) {
        if (best.opt?.navigateTo) {
          handleOption(best.opt);
        } else if (best.opt?.next) {
          const tree = questionnaireTree[best.treeKey];
          const nextNode = tree?.[best.opt.next];
          if (nextNode) { addChatMessage({ role: 'bot', content: nextNode.message, showChart: nextNode.showChart }); setNodeKey(best.opt.next); }
        } else {
          addChatMessage({ role: 'bot', content: best.node.message, showChart: best.node.showChart });
          if (best.treeKey === screenKey) setNodeKey(best.nodeId);
        }
      } else {
        addChatMessage({
          role: 'bot',
          content: `I don't have specific data on that for **${screenDefinitions[screenKey]?.name}**. Try one of the analysis options below, or switch screens using the tabs above.`,
        });
      }
    }, 320);
  };

  const handleReset = () => {
    resetChat();
    setNodeKey('entry');
    setScreenKey(currentScreen);
    setFindingDrillContext(null);
    setTimeout(() => {
      const tree = questionnaireTree[currentScreen];
      if (tree && tree['entry']) {
        addChatMessage({ role: 'bot', content: tree['entry'].message });
      }
    }, 100);
  };

  const handleScreenSwitch = (sid) => {
    setScreenKey(sid);
    setNodeKey('entry');
    const tree = questionnaireTree[sid];
    if (tree && tree['entry']) {
      addChatMessage({ role: 'bot', content: `Switching to **${screenDefinitions[sid]?.name}** analysis.`, navigatedTo: sid });
      setTimeout(() => {
        navigate(screenDefinitions[sid].path);
        addChatMessage({ role: 'bot', content: tree['entry'].message });
      }, 300);
    }
  };

  const node = currentNode();
  const options = node?.options || [];

  const isPromoDrill = findingDrillContext &&
    (findingDrillContext.rule_id === 'DA-06' || findingDrillContext.rule_id === 'DB-05' || findingDrillContext.target_screen === 'S-06');
  const drillQuestions = findingDrillContext
    ? (isPromoDrill ? DRILL_QUESTIONS_PROMO : DRILL_QUESTIONS_GENERIC)
    : null;

  const handlePresetQuestion = (q) => {
    if (isNavigating) return;
    addChatMessage({ role: 'user', content: q.label });
    setTimeout(() => {
      addChatMessage({ role: 'bot', content: buildFindingResponse(findingDrillContext, q.query) });
    }, 320);
  };

  if (!chatOpen) {
    return (
      <button className="chat-fab" onClick={() => setChatOpen(true)} title="Open AI Analysis">
        <span className="font-black text-[14px]">✦</span>
        <span>Ask AI</span>
      </button>
    );
  }

  return (
    <div className={`chatbot-panel ${expanded ? 'expanded' : ''}`} style={{ borderTop: '2px solid var(--accent)' }}>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-3">
          <BotAvatar size={36} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13.5px] font-bold text-[var(--text-primary)] tracking-[-0.1px]">Growth Analyst</span>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--success)' }} />
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {screenDefinitions[screenKey]?.name || 'Command Centre'} · AI Analysis
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[
            { icon: <Download size={13} />, action: () => generatePDF(chatHistory, screenKey), title: 'Download PDF' },
            { icon: <RotateCcw size={13} />, action: handleReset, title: 'Reset' },
            { icon: expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />, action: () => setExpanded(e => !e), title: 'Expand' },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} title={btn.title}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-muted)' }}>
              {btn.icon}
            </button>
          ))}
          <button onClick={() => setChatOpen(false)}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--critical-bg)]"
            style={{ color: 'var(--text-muted)' }}>
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Finding drill-down context banner */}
      {findingDrillContext && (
        <div className="flex items-center gap-2.5 px-4 py-2 border-b border-[var(--border)] flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, rgba(251,191,36,0.08) 0%, rgba(217,119,6,0.04) 100%)', borderLeft: '3px solid var(--accent)' }}>
          <span className="font-black text-[11px]" style={{ color: 'var(--accent)' }}>✦</span>
          <div className="flex-1 min-w-0">
            <span className="text-[10.5px] font-bold" style={{ color: 'var(--accent)' }}>AI Drill Down</span>
            <span className="text-[10.5px] mx-1.5" style={{ color: 'var(--text-muted)' }}>·</span>
            <span className="text-[10.5px] font-semibold" style={{ color: 'var(--text-primary)' }}>{findingDrillContext.rule_name}</span>
            <span className="text-[10px] ml-1.5" style={{ color: 'var(--text-muted)' }}>{findingDrillContext.geo_id} · {findingDrillContext.finding_id}</span>
          </div>
          <button onClick={() => setFindingDrillContext(null)}
            className="text-[9px] font-bold px-2 py-0.5 rounded border transition-colors"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >EXIT</button>
        </div>
      )}

      {/* Screen switcher */}
      <div className="flex gap-1 px-3.5 py-2 overflow-x-auto border-b border-[var(--border)] flex-shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ background: 'var(--bg-secondary)' }}>
        {Object.values(screenDefinitions).map(s => (
          <button
            key={s.id}
            onClick={() => handleScreenSwitch(s.id)}
            className="whitespace-nowrap cursor-pointer transition-all text-[9px] font-bold tracking-[0.4px] px-2.5 py-1 rounded-md"
            style={screenKey === s.id
              ? { background: 'var(--accent)', color: '#000', fontFamily: "'DM Mono', monospace" }
              : { background: 'transparent', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }
            }
            onMouseEnter={e => { if (screenKey !== s.id) e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { if (screenKey !== s.id) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {s.id}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-4" id="chat-messages-container"
        style={{ background: 'var(--bg-primary)' }}>
        {chatHistory.map((msg, i) => (
          <ChatMessage key={i} msg={msg} />
        ))}
        {isNavigating && (
          <div className="flex gap-2.5 items-end">
            <BotAvatar size={28} />
            <div className="px-4 py-3 rounded-[4px_14px_14px_14px]"
              style={{ background: 'var(--bg-card)', boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px var(--border)' }}>
              <div className="flex gap-1.5 items-center h-4">
                {[0, 0.18, 0.36].map((d, i) => (
                  <span key={i} className="w-[6px] h-[6px] rounded-full" style={{ background: 'var(--text-muted)', animation: `typingBounce 1.3s ${d}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Options — drill-down presets OR normal questionnaire */}
      {!isNavigating && (drillQuestions ? (
        <div className="border-t border-[var(--border)] flex-shrink-0 max-h-[40vh] overflow-y-auto" style={{ background: 'var(--bg-secondary)' }}>
          <div className="px-4 pt-2.5 pb-1 text-[9.5px] font-bold uppercase tracking-[0.8px]" style={{ color: 'var(--text-muted)' }}>
            Suggested questions
          </div>
          <div className="px-3 pb-2 flex flex-col gap-0.5">
            {drillQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handlePresetQuestion(q)}
                className="group flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg font-[inherit] text-[12px] leading-[1.4] transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: q.accent ? 'var(--accent)' : 'var(--text-secondary)' }}
              >
                <span
                  className="w-[5px] h-[5px] rounded-full flex-shrink-0 flex-shrink-0"
                  style={{ background: q.accent ? 'var(--accent)' : 'var(--border-light)', opacity: q.accent ? 0.7 : 1 }}
                />
                <span className="flex-1">{q.label}</span>
                <span className="text-[9px] opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--text-muted)' }}>{q.sub}</span>
              </button>
            ))}
          </div>
        </div>
      ) : options.length > 0 && (
        <div className="border-t border-[var(--border)] flex-shrink-0 max-h-[34vh] overflow-y-auto" style={{ background: 'var(--bg-secondary)' }}>
          <div className="px-4 pt-2.5 pb-1 text-[9.5px] font-bold uppercase tracking-[0.8px]" style={{ color: 'var(--text-muted)' }}>
            Suggested questions
          </div>
          <div className="px-3 pb-2 flex flex-col gap-0.5">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOption(opt)}
                className="group flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg font-[inherit] text-[12px] leading-[1.4] transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="w-[5px] h-[5px] rounded-full flex-shrink-0 transition-colors"
                  style={{ background: 'var(--border-light)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                />
                <span className="flex-1">{opt.label}</span>
                {opt.navigateTo && (
                  <ChevronRight size={11} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Input */}
      <form onSubmit={handleFreeInput}
        className="flex items-center gap-2.5 px-3.5 py-3 border-t border-[var(--border)] flex-shrink-0"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="flex-1 flex items-center gap-2 rounded-full px-4 py-0 border transition-colors focus-within:border-[var(--accent)]"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask anything…"
            className="flex-1 bg-transparent py-[9px] text-[12.5px] outline-none font-[inherit] placeholder:text-[var(--text-muted)]"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
        <button
          type="submit"
          disabled={!inputValue.trim() || isNavigating}
          className="w-9 h-9 rounded-full flex items-center justify-center text-black flex-shrink-0 transition-opacity disabled:opacity-35 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', boxShadow: '0 2px 8px rgba(245,158,11,0.35)' }}
        >
          <Send size={14} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
