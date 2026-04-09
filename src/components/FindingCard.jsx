import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { screenDefinitions } from '../data/mockData';
import { useApp } from '../context/AppContext';

const severityStyles = {
  critical: {
    border: 'border-l-[var(--critical)]',
    badge: 'bg-[var(--critical-bg)] text-[var(--critical)]',
  },
  warning: {
    border: 'border-l-[var(--warning)]',
    badge: 'bg-[var(--warning-bg)] text-[var(--warning)]',
  },
  info: {
    border: 'border-l-[var(--info)]',
    badge: 'bg-[var(--info-bg)] text-[var(--info)]',
  },
};

export default function FindingCard({ finding, showDrill = false }) {
  const navigate = useNavigate();
  const { trackScreenVisit } = useApp();
  const screen = screenDefinitions[finding.target_screen];
  const sev = severityStyles[finding.severity] || severityStyles.info;

  const handleNavigate = () => {
    if (screen) {
      trackScreenVisit(screen.id);
      navigate(screen.path);
    }
  };

  const driftColor =
    finding.drift_direction === 'down' || finding.drift_direction === 'widening' || finding.drift_direction === 'up'
      ? 'var(--critical)'
      : 'var(--info)';

  return (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border)] border-l-[3px] ${sev.border} rounded-xl px-[18px] py-[15px] mb-2 cursor-pointer transition-[border-color,background,transform,box-shadow] hover:bg-[var(--bg-hover)] hover:border-[var(--border-light)] hover:-translate-y-px animate-in`}
      style={{ boxShadow: 'var(--card-shadow)' }}
      onClick={handleNavigate}
    >
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
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] ${finding.status === 'new' ? 'bg-[var(--info-bg)] text-[var(--info)]' : 'bg-[var(--warning-bg)] text-[var(--warning)]'}`}>
          {finding.status}
        </span>
        <span className="text-[11px] text-[var(--text-muted)] ml-auto">
          {finding.geo_id} · {finding.rule_id}
        </span>
      </div>

      <div className="text-[12.5px] text-[var(--text-secondary)] leading-[1.55] mt-0.5">
        {finding.summary_text}
      </div>

      <div className="flex items-center gap-3 mt-2 text-[12px]">
        <span>
          <strong className="text-[var(--text-primary)] font-semibold">{finding.metric_name}:</strong>{' '}
          {finding.current_value}
          {typeof finding.current_value === 'number' && (
            finding.metric_name.includes('%') || finding.metric_name.includes('Rate') ||
            finding.metric_name.includes('ND') || finding.metric_name.includes('Share') ||
            finding.metric_name.includes('MAU')
          ) ? '%' : ''}
        </span>
        <span className="text-[var(--text-muted)]">vs {finding.comparison_value}</span>
        <span style={{ color: driftColor, fontWeight: 600 }}>
          {finding.drift_magnitude > 0 ? '+' : ''}{finding.drift_magnitude}
          {finding.metric_name.includes('Ratio') ? '' : finding.drift_direction === 'gap' ? 'pp gap' : 'pp'}
        </span>
      </div>

      {showDrill && screen && (
        <div className="inline-flex items-center gap-1 mt-[9px] px-2.5 py-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-md text-[10.5px] font-semibold text-[var(--text-secondary)] cursor-pointer transition-[border-color,color,background] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] tracking-[0.1px]">
          Drill down: {screen.name} <ArrowRight size={12} />
        </div>
      )}
    </div>
  );
}
