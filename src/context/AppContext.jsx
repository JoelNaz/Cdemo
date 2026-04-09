import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { currentUser } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user] = useState(currentUser);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('S-00');
  const [conversationCharts, setConversationCharts] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('clarynt-theme') || 'light');

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
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
