import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Target, TrendingUp, GitBranch, PieChart,
  Map, Zap, BarChart3, Wallet, Radar, Sun, Moon,
} from 'lucide-react';
import { screenDefinitions, driftFindings } from '../data/mockData';
import { useApp } from '../context/AppContext';

const iconMap = {
  LayoutDashboard, Target, TrendingUp, GitBranch, PieChart, Map, Zap, BarChart3, Wallet, Radar,
};

const findingsBadge = driftFindings.reduce((acc, f) => {
  const id = f.target_screen;
  if (!acc[id]) acc[id] = { critical: 0, warning: 0 };
  if (f.severity === 'critical') acc[id].critical++;
  else if (f.severity === 'warning') acc[id].warning++;
  return acc;
}, {});

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, trackScreenVisit, theme, toggleTheme } = useApp();

  const screens = Object.values(screenDefinitions);

  const handleNav = (screen) => {
    trackScreenVisit(screen.id);
    navigate(screen.path);
  };

  return (
    <nav
      className="w-[260px] bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col fixed top-0 left-0 bottom-0 z-[100]"
      style={{ boxShadow: 'var(--sidebar-shadow)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-[18px] pb-[14px] border-b border-[var(--border)] flex items-center">
        <h1 className="text-[16px] font-extrabold tracking-[3px] text-[var(--text-primary)] uppercase">
          CLARY<span className="text-[var(--accent)]">NT</span>
        </h1>
      </div>

      {/* Subtitle */}
      <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[2.5px] px-5 pt-[10px] pb-[5px]">
        Command Centre
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-1 px-2">
        {screens.map(s => {
          const Icon = iconMap[s.icon];
          const isActive = location.pathname === s.path;
          return (
            <div
              key={s.id}
              onClick={() => handleNav(s)}
              className={[
                'relative flex items-center gap-2.5 px-3 py-[9px] rounded-lg cursor-pointer transition-colors mb-px text-[12.5px]',
                isActive
                  ? 'bg-[var(--accent-light)] text-[var(--accent)] font-semibold'
                  : 'text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              {isActive && (
                <span className="absolute left-0 top-[7px] bottom-[7px] w-[2.5px] rounded-sm bg-[var(--accent)]" />
              )}
              <span
                className="text-[9px] font-bold text-[var(--text-muted)] min-w-[28px]"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {s.id}
              </span>
              {Icon && <Icon className="w-[18px] h-[18px] flex-shrink-0" />}
              <span className="flex-1">{s.name}</span>
              {findingsBadge[s.id] && (
                <span
                  className="text-[9px] font-extrabold min-w-[17px] h-[17px] flex items-center justify-center rounded-full px-1 flex-shrink-0"
                  style={{
                    background: findingsBadge[s.id].critical > 0 ? 'var(--critical-bg)' : 'var(--warning-bg)',
                    color: findingsBadge[s.id].critical > 0 ? 'var(--critical)' : 'var(--warning)',
                  }}
                >
                  {findingsBadge[s.id].critical + findingsBadge[s.id].warning}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* User footer */}
      <div className="px-3.5 py-3 border-t border-[var(--border)] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center font-extrabold text-[12px] text-black flex-shrink-0 tracking-[0.5px]">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-bold text-[var(--text-primary)] tracking-[0.1px]">{user.name}</div>
          <div className="text-[10.5px] text-[var(--text-muted)] mt-px">{user.role} · {user.region}</div>
        </div>
        <button
          className="theme-switch"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className={`theme-track ${theme}`}>
            <span className="theme-thumb">
              {theme === 'dark' ? <Moon size={10} strokeWidth={2.5} /> : <Sun size={10} strokeWidth={2.5} />}
            </span>
          </span>
        </button>
      </div>
    </nav>
  );
}
