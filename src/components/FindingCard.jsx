import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { screenDefinitions } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function FindingCard({ finding }) {
  const navigate = useNavigate();
  const { trackScreenVisit } = useApp();
  const screen = screenDefinitions[finding.target_screen];

  const handleNavigate = () => {
    if (screen) {
      trackScreenVisit(screen.id);
      navigate(screen.path);
    }
  };

  return (
    <div className={`finding-card ${finding.severity} animate-in`} onClick={handleNavigate}>
      <div className="finding-header">
        <span className={`severity-badge ${finding.severity}`}>{finding.severity}</span>
        <span className={`cat-badge ${finding.category === 'A' ? 'cat-a' : 'cat-b'}`}>
          Cat {finding.category}
        </span>
        <span className="finding-rule">{finding.rule_name}</span>
        <span className={`status-badge ${finding.status}`}>{finding.status}</span>
        <span className="finding-geo">{finding.geo_id} &middot; {finding.rule_id}</span>
      </div>
      <div className="finding-summary">{finding.summary_text}</div>
      <div className="finding-metric">
        <span><strong style={{ color: 'var(--text-primary)' }}>{finding.metric_name}:</strong> {finding.current_value}{typeof finding.current_value === 'number' && finding.current_value < 1 && finding.current_value > 0 ? '' : finding.metric_name.includes('%') || finding.metric_name.includes('Rate') || finding.metric_name.includes('ND') || finding.metric_name.includes('Share') || finding.metric_name.includes('MAU') ? '%' : ''}</span>
        <span style={{ color: 'var(--text-muted)' }}>vs {finding.comparison_value}</span>
        <span style={{ color: finding.drift_direction === 'down' || finding.drift_direction === 'widening' ? 'var(--critical)' : finding.drift_direction === 'up' ? 'var(--critical)' : 'var(--info)', fontWeight: 600 }}>
          {finding.drift_magnitude > 0 ? '+' : ''}{finding.drift_magnitude}{finding.metric_name.includes('Ratio') ? '' : finding.drift_direction === 'gap' ? 'pp gap' : 'pp'}
        </span>
      </div>
      {screen && (
        <div className="finding-screen-link">
          Drill down: {screen.name} <ArrowRight size={12} />
        </div>
      )}
    </div>
  );
}
