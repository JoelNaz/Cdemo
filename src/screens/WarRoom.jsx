import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Siren, Users, Target, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import FindingCard from '../components/FindingCard';
import ScopeSelector from '../components/ScopeSelector';
import { driftFindings, warRoomExercises, dataRefreshLabel } from '../data/mockData';
import { useApp } from '../context/AppContext';

const typeLabels = {
  beat_redesign:      { label: 'Beat Redesign',       color: 'var(--info)',     bg: 'var(--info-bg)' },
  distributor_action: { label: 'Distributor Action',   color: 'var(--warning)', bg: 'var(--warning-bg)' },
  expansion:          { label: 'Expansion Targeting',  color: 'var(--accent)',  bg: 'var(--accent-light)' },
};

const statusStyles = {
  pending:     { label: 'Pending',     color: 'var(--text-muted)', bg: 'var(--bg-tertiary)' },
  in_progress: { label: 'In Progress', color: 'var(--warning)',   bg: 'var(--warning-bg)' },
  resolved:    { label: 'Resolved',    color: 'var(--success)',   bg: 'var(--success-bg,#dcfce7)' },
};

function ExerciseCard({ exercise }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(exercise.status);
  const type = typeLabels[exercise.type] || typeLabels.distributor_action;
  const st = statusStyles[status] || statusStyles.pending;

  const relatedFindings = driftFindings.filter(f => exercise.finding_ids.includes(f.finding_id));

  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl mb-3 overflow-hidden"
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      <div
        className="px-5 py-4 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.7px]"
            style={{ color: type.color, background: type.bg }}>
            {type.label}
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.7px]"
            style={{ color: st.color, background: st.bg }}>
            {st.label}
          </span>
          <span className="text-[13.5px] font-extrabold text-[var(--text-primary)] tracking-[-0.1px] flex-1">
            {exercise.title}
          </span>
          <span className="text-[10.5px] text-[var(--text-muted)] hidden sm:block">
            {exercise.id}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
        </div>

        <div className="flex items-center gap-5 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            {exercise.owner}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <Target className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            Target: {exercise.target_date}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            Created: {exercise.created}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <BarChart3 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            {exercise.finding_ids.length} finding{exercise.finding_ids.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] px-5 py-4">
          <div className="text-[11.5px] text-[var(--text-secondary)] leading-[1.6] mb-4">
            {exercise.notes}
          </div>

          {/* Status controls */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.8px] mr-1">Update Status:</span>
            {Object.entries(statusStyles).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={[
                  'px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors',
                  status === key
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-light)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
                ].join(' ')}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Related findings */}
          {relatedFindings.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.8px] mb-2">
                Related Findings
              </div>
              {relatedFindings.map(f => (
                <FindingCard key={f.finding_id} finding={f} showDrill />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WarRoom() {
  const { trackScreenVisit, warRoomQueue, findingStatuses } = useApp();
  useEffect(() => { trackScreenVisit('WAR-ROOM'); }, []);

  const escalatedFindings = driftFindings.filter(
    f => warRoomQueue.has(f.finding_id) || findingStatuses[f.finding_id] === 'escalated'
  );

  const statCounts = {
    total: escalatedFindings.length + warRoomExercises.length,
    exercises: warRoomExercises.length,
    pending: warRoomExercises.filter(e => e.status === 'pending').length,
    inProgress: warRoomExercises.filter(e => e.status === 'in_progress').length,
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="flex-1">
          <div className="screen-id flex items-center gap-2">
            <Siren className="w-3.5 h-3.5 text-[var(--critical)]" />
            WAR ROOM
          </div>
          <h2 className="screen-title">War Room</h2>
          <div className="screen-subtitle">Escalated findings, strategic exercises, dissemination tracking · March 2026</div>
          <div className="mt-2"><ScopeSelector /></div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {[
          { label: 'Total Items', value: statCounts.total, icon: <AlertTriangle className="w-4 h-4" />, color: 'var(--critical)' },
          { label: 'Exercises', value: statCounts.exercises, icon: <Target className="w-4 h-4" />, color: 'var(--accent)' },
          { label: 'Pending', value: statCounts.pending, icon: <Clock className="w-4 h-4" />, color: 'var(--warning)' },
          { label: 'In Progress', value: statCounts.inProgress, icon: <CheckCircle className="w-4 h-4" />, color: 'var(--success)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-3"
            style={{ boxShadow: 'var(--card-shadow)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}1a`, color }}>
              {icon}
            </div>
            <div>
              <div className="text-[22px] font-extrabold text-[var(--text-primary)] [font-variant-numeric:tabular-nums] leading-none">{value}</div>
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.7px] mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active exercises */}
      <div className="section-label">Strategic Exercises</div>
      {warRoomExercises.map(ex => (
        <ExerciseCard key={ex.id} exercise={ex} />
      ))}

      {/* Escalated findings with no exercise yet */}
      {escalatedFindings.length > 0 && (
        <div className="mt-6">
          <div className="section-label">Escalated Findings — Awaiting Exercise Assignment</div>
          {escalatedFindings.map(f => (
            <FindingCard key={f.finding_id} finding={f} showDrill />
          ))}
        </div>
      )}

      {escalatedFindings.length === 0 && (
        <div className="mt-6 text-center py-12 text-[13px] text-[var(--text-muted)]">
          No findings escalated to the War Room yet. Use the <strong>Escalate to War Room</strong> button on any finding card.
        </div>
      )}

      <div className="mt-6 text-[10px] text-[var(--text-muted)] text-right">{dataRefreshLabel}</div>
    </div>
  );
}
