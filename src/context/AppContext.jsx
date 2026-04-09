import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { currentUser, driftFindings } from '../data/mockData';

const AppContext = createContext(null);

const LIFECYCLE_TRANSITIONS = {
  new: ['viewed', 'discussed'],
  viewed: ['discussed', 'resolved', 'escalated'],
  discussed: ['resolved', 'escalated'],
  resolved: [],
  escalated: [],
};

const initialFindingStatuses = Object.fromEntries(
  driftFindings.map(f => [f.finding_id, f.status])
);

const initialWarRoom = new Set(
  driftFindings.filter(f => f.status === 'escalated').map(f => f.finding_id)
);

export function AppProvider({ children }) {
  const [user] = useState(currentUser);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('S-00');
  const [conversationCharts, setConversationCharts] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('clarynt-theme') || 'light');

  // ── Scope state ────────────────────────────────────────────────────────────
  const [scope, setScope] = useState(() => ({ ...currentUser.defaultScope }));

  const drillDown = useCallback((level, value) => {
    setScope(prev => ({ ...prev, [level]: value }));
  }, []);

  const drillUp = useCallback((level) => {
    setScope(prev => {
      const next = { ...prev };
      const order = ['micromarket', 'beat', 'district', 'state', 'region', 'zone'];
      const idx = order.indexOf(level);
      order.slice(0, idx + 1).forEach(l => delete next[l]);
      return next;
    });
  }, []);

  const resetScope = useCallback(() => {
    setScope({ ...currentUser.defaultScope });
  }, []);

  // ── Finding lifecycle ──────────────────────────────────────────────────────
  const [findingStatuses, setFindingStatuses] = useState(initialFindingStatuses);
  const [warRoomQueue, setWarRoomQueue] = useState(initialWarRoom);

  const updateFindingStatus = useCallback((findingId, newStatus) => {
    setFindingStatuses(prev => ({ ...prev, [findingId]: newStatus }));
    if (newStatus === 'escalated') {
      setWarRoomQueue(prev => new Set([...prev, findingId]));
    }
  }, []);

  const getTransitions = useCallback((findingId) => {
    const status = findingStatuses[findingId] || 'new';
    return LIFECYCLE_TRANSITIONS[status] || [];
  }, [findingStatuses]);

  // ── Contextual detail panel ────────────────────────────────────────────────
  const [contextPanel, setContextPanel] = useState(null);

  const openContextPanel = useCallback((kpiLabel) => {
    setContextPanel(kpiLabel);
  }, []);

  const closeContextPanel = useCallback(() => {
    setContextPanel(null);
  }, []);

  // ── Theme ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clarynt-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  const addChatMessage = useCallback((msg) => {
    setChatHistory(prev => [...prev, { ...msg, timestamp: new Date().toISOString() }]);
  }, []);

  const trackScreenVisit = useCallback((screenId) => {
    setCurrentScreen(screenId);
  }, []);

  const addConversationChart = useCallback((chart) => {
    setConversationCharts(prev => [...prev, chart]);
  }, []);

  const resetChat = useCallback(() => {
    setChatHistory([]);
    setConversationCharts([]);
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      chatHistory, addChatMessage, resetChat,
      chatOpen, setChatOpen,
      currentScreen, trackScreenVisit,
      conversationCharts, addConversationChart,
      theme, toggleTheme,
      scope, drillDown, drillUp, resetScope,
      findingStatuses, updateFindingStatus, getTransitions,
      warRoomQueue,
      contextPanel, openContextPanel, closeContextPanel,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
