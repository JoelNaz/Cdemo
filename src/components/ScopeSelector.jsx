import { ChevronRight, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { geoHierarchy, dataRefreshLabel } from '../data/mockData';

const SCOPE_ORDER = ['zone', 'region', 'state', 'district', 'micromarket', 'beat'];
const SCOPE_LABELS = { zone: 'Zone', region: 'Region', state: 'State', district: 'District', micromarket: 'Micromarket', beat: 'Beat' };

export default function ScopeSelector() {
  const { scope, drillDown, drillUp, resetScope, user } = useApp();

  const breadcrumbs = SCOPE_ORDER.filter(l => scope[l]);

  const canDrillDown = scope.region && !scope.district;
  const drillOptions = canDrillDown ? (geoHierarchy.districts[scope.region] || []) : [];

  return (
    <div className="flex items-center gap-0 flex-wrap gap-y-1.5">
      {/* Breadcrumb trail */}
      <div className="flex items-center gap-0 flex-wrap">
        {breadcrumbs.map((level, idx) => (
          <div key={level} className="flex items-center">
            {idx > 0 && <ChevronRight className="w-3 h-3 text-[var(--text-muted)] mx-0.5 flex-shrink-0" />}
            <button
              onClick={() => idx < breadcrumbs.length - 1 && drillUp(level)}
              className={[
                'text-[10.5px] font-bold px-2 py-0.5 rounded-md transition-colors',
                idx === breadcrumbs.length - 1
                  ? 'text-[var(--accent)] bg-[var(--accent-light)] cursor-default'
                  : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] cursor-pointer',
              ].join(' ')}
            >
              <span className="text-[9px] text-[var(--text-muted)] font-medium mr-0.5 uppercase tracking-wide">
                {SCOPE_LABELS[level]}
              </span>
              {scope[level]}
            </button>
          </div>
        ))}
      </div>

      {/* Drill-down dropdown */}
      {canDrillDown && drillOptions.length > 0 && (
        <div className="relative ml-1 group">
          <button className="text-[10px] font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] px-2 py-0.5 rounded-md border border-dashed border-[var(--border)] hover:border-[var(--accent)] transition-colors flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            Drill to district
          </button>
          <div className="absolute left-0 top-full mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl z-50 min-w-[160px] py-1.5 hidden group-hover:block">
            {drillOptions.map(district => (
              <button
                key={district}
                onClick={() => drillDown('district', district)}
                className="w-full text-left px-3.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent)] transition-colors"
              >
                {district}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset scope */}
      {Object.keys(scope).length > Object.keys(user.defaultScope).length && (
        <button
          onClick={resetScope}
          className="ml-1 text-[9.5px] font-bold text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-0.5 px-1.5 py-0.5 rounded-md hover:bg-[var(--accent-light)] transition-colors"
          title="Reset to default scope"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          Reset
        </button>
      )}

      {/* Refresh date */}
      <span className="ml-auto text-[9.5px] text-[var(--text-muted)] font-medium hidden sm:block">
        {dataRefreshLabel}
      </span>
    </div>
  );
}
