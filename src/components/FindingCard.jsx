import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Share2, CheckCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { screenDefinitions } from '../data/mockData';
import { useApp } from '../context/AppContext';

const severityStyles = {
  critical: { border: 'border-l-[var(--critical)]', badge: 'bg-[var(--critical-bg)] text-[var(--critical)]' },
  warning:  { border: 'border-l-[var(--warning)]',  badge: 'bg-[var(--warning-bg)] text-[var(--warning)]' },
  info:     { border: 'border-l-[var(--info)]',     badge: 'bg-[var(--info-bg)] text-[var(--info)]' },
};

const statusStyles = {
  new:       'bg-[var(--info-bg)] text-[var(--info)]',
  viewed:    'bg-[var(--warning-bg)] text-[var(--warning)]',
  discussed: 'bg-[var(--accent-light)] text-[var(--accent)]',
  resolved:  'bg-[var(--success-bg,#dcfce7)] text-[var(--success)]',
  escalated: 'bg-[var(--critical-bg)] text-[var(--critical)]',
};

const lifecycleLabels = {
  viewed: 'Mark Viewed',
  discussed: 'Discussed',
  resolved: 'Resolve',
  escalated: 'Escalate to War Room',
};

const lifecycleIcons = {
  viewed:    <CheckCircle className="w-3 h-3" />,
  discussed: <MessageSquare className="w-3 h-3" />,
  resolved:  <CheckCircle className="w-3 h-3" />,
  escalated: <AlertTriangle className="w-3 h-3" />,
};

export default function FindingCard({ finding, showDrill = false }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const { trackScreenVisit, findingStatuses, updateFindingStatus, getTransitions, warRoomQueue } = useApp();

  const screen = screenDefinitions[finding.target_screen];
  const sev = severityStyles[finding.severity] || severityStyles.info;
  const currentStatus = findingStatuses[finding.finding_id] || finding.status;
  const transitions = getTransitions(finding.finding_id);
  const isInWarRoom = warRoomQueue.has(finding.finding_id);

  const driftColor =
    finding.drift_direction === 'down' || finding.drift_direction === 'widening'
      ? 'var(--critical)'
      : finding.drift_direction === 'up' ? 'var(--warning)'
      : 'var(--info)';

  const handleNavigate = (e) => {
    if (e.target.closest('[data-no-nav]')) return;
    if (screen) { trackScreenVisit(screen.id); navigate(screen.path); }
  };

  const handleExportPng = async (e) => {
    e.stopPropagation();
    if (!cardRef.current || exporting) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${finding.rule_id}_${finding.geo_id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`bg-[var(--bg-card)] border border-[var(--border)] border-l-[3px] ${sev.border} rounded-xl px-[18px] py-[15px] mb-2 cursor-pointer transition-[border-color,background,transform,box-shadow] hover:bg-[var(--bg-hover)] hover:border-[var(--border-light)] hover:-translate-y-px animate-in`}
      style={{ boxShadow: 'var(--card-shadow)' }}
      onClick={handleNavigate}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className={`text-[9px] font-bold px-[7px] py-0.5 rounded-[3px] uppercase tracking-[0.8px] ${sev.badge}`}>
          {finding.severity}
        </span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] ${finding.category === 'A' ? 'bg-[var(--critical-bg)] text-[var(--critical)]' : 'bg-[var(--info-bg)] text-[var(--info)]'}`}>
          Cat {finding.category}
        </span>
        <span className="text-[13px] font-bold text-[var(--text-primary)] tracking-[-0.1px]">
          {finding.rule_name}
        </span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] ${statusStyles[currentStatus] || statusStyles.new}`}>
          {currentStatus}
        </span>
        {isInWarRoom && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] bg-[var(--critical-bg)] text-[var(--critical)] uppercase tracking-wide">
            War Room
          </span>
        )}
        <span className="text-[11px] text-[var(--text-muted)] ml-auto">
          {finding.geo_id} · {finding.rule_id}
        </span>
      </div>

      {/* Summary */}
      <div className="text-[12.5px] text-[var(--text-secondary)] leading-[1.55] mt-0.5">
        {finding.summary_text}
      </div>

      {/* Metric row */}
      <div className="flex items-center gap-3 mt-2 text-[12px]">
        <span>
          <strong className="text-[var(--text-primary)] font-semibold">{finding.metric_name}:</strong>{' '}
          {finding.current_value}
          {typeof finding.current_value === 'number' &&
            (finding.metric_name.includes('%') || finding.metric_name.includes('Rate') ||
             finding.metric_name.includes('ND') || finding.metric_name.includes('Share') ||
             finding.metric_name.includes('MAU')) ? '%' : ''}
        </span>
        <span className="text-[var(--text-muted)]">vs {finding.comparison_value}</span>
        <span style={{ color: driftColor, fontWeight: 600 }}>
          {finding.drift_magnitude > 0 ? '+' : ''}{finding.drift_magnitude}
          {finding.metric_name.includes('Ratio') ? '' : finding.drift_direction === 'gap' ? 'pp gap' : 'pp'}
        </span>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 mt-[11px] flex-wrap" data-no-nav="true">
        {/* Lifecycle transitions */}
        {transitions.map(t => (
          <button
            key={t}
            data-no-nav="true"
            onClick={(e) => { e.stopPropagation(); updateFindingStatus(finding.finding_id, t); }}
            className={[
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors',
              t === 'escalated'
                ? 'border-[var(--critical)] text-[var(--critical)] hover:bg-[var(--critical-bg)]'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]',
            ].join(' ')}
          >
            {lifecycleIcons[t]}
            {lifecycleLabels[t]}
          </button>
        ))}

        {/* PNG export */}
        <button
          data-no-nav="true"
          onClick={handleExportPng}
          disabled={exporting}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50"
          title="Export as PNG for WhatsApp"
        >
          {exporting ? (
            <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
          ) : (
            <Share2 className="w-3 h-3" />
          )}
          {exporting ? 'Exporting…' : 'Share PNG'}
        </button>

        {/* Drill-down */}
        {showDrill && screen && (
          <div className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-md text-[10.5px] font-semibold text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors tracking-[0.1px]">
            {screen.name} <ArrowRight size={12} />
          </div>
        )}
      </div>
    </div>
  );
}
