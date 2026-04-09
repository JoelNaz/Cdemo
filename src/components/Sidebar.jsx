import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, TrendingUp, GitBranch, PieChart, Map, Zap, BarChart3, Wallet, Radar, Sun, Moon } from 'lucide-react';
import { screenDefinitions } from '../data/mockData';
import { useApp } from '../context/AppContext';

const iconMap = {
  LayoutDashboard, Target, TrendingUp, GitBranch, PieChart, Map, Zap, BarChart3, Wallet, Radar,
};

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
    <nav className="sidebar">
      <div className="sidebar-logo">
        <h1>CLARY<span>NT</span></h1>
      </div>
      <div className="sidebar-subtitle">Command Centre</div>
      <div className="sidebar-nav">
        {screens.map(s => {
          const Icon = iconMap[s.icon];
          const isActive = location.pathname === s.path;
          return (
            <div
              key={s.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNav(s)}
            >
              <span className="nav-id">{s.id}</span>
              {Icon && <Icon className="nav-icon" />}
              <span>{s.name}</span>
            </div>
          );
        })}
      </div>
      <div className="sidebar-user">
        <div className="user-avatar">{user.name.split(' ').map(n => n[0]).join('')}</div>
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.role} &middot; {user.region}</div>
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
