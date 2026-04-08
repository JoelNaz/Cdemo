import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageSquare, Download, ChevronRight, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { questionnaireTree } from '../data/questionnaire';
import { screenDefinitions } from '../data/mockData';
import { generatePDF } from '../utils/pdfExport';

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/```([\s\S]*?)```/g, '<pre class="chat-code">$1</pre>');
}

function ChatMessage({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`chat-message ${isBot ? 'bot' : 'user'}`}>
      {isBot && <div className="chat-avatar">AI</div>}
      <div className="chat-bubble">
        {isBot
          ? <div dangerouslySetInnerHTML={{ __html: '<p>' + renderMarkdown(msg.content) + '</p>' }} />
          : <div>{msg.content}</div>
        }
        {msg.navigatedTo && (
          <div className="chat-nav-badge">
            Navigated to: {screenDefinitions[msg.navigatedTo]?.name}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const { chatOpen, setChatOpen, currentScreen, chatHistory, addChatMessage, resetChat } = useApp();
  const navigate = useNavigate();
  const [nodeKey, setNodeKey] = useState('entry');
  const [screenKey, setScreenKey] = useState(currentScreen);
  const [expanded, setExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const messagesEndRef = useRef(null);

  // When screen changes externally, reset chatbot to that screen's entry
  useEffect(() => {
    if (currentScreen !== screenKey) {
      setScreenKey(currentScreen);
      setNodeKey('entry');
    }
  }, [currentScreen]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatOpen]);

  // On open: if no history or screen changed, post entry message
  useEffect(() => {
    if (!chatOpen) return;
    const tree = questionnaireTree[screenKey];
    if (!tree) return;
    const node = tree[nodeKey] || tree['entry'];
    if (!node) return;
    // Only auto-post if history is empty or last message is a user message
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
    // Add user message
    addChatMessage({ role: 'user', content: option.label });

    // Navigate if needed
    if (option.navigateTo) {
      const screen = screenDefinitions[option.navigateTo];
      if (screen) {
        setIsNavigating(true);
        setTimeout(() => {
          navigate(screen.path);
          setScreenKey(option.navigateTo);
          setIsNavigating(false);
          // Post entry for new screen
          const newTree = questionnaireTree[option.navigateTo];
          const nextNodeKey = option.next || 'entry';
          const nextNode = newTree ? (newTree[nextNodeKey] || newTree['entry']) : null;
          if (nextNode) {
            setTimeout(() => {
              addChatMessage({ role: 'bot', content: nextNode.message, showChart: nextNode.showChart, navigatedTo: option.navigateTo });
              setNodeKey(nextNodeKey);
            }, 400);
          }
        }, 200);
        return;
      }
    }

    // Stay on current screen, go to next node
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

  const handleReset = () => {
    resetChat();
    setNodeKey('entry');
    setScreenKey(currentScreen);
    // Re-post entry message
    setTimeout(() => {
      const tree = questionnaireTree[currentScreen];
      if (tree && tree['entry']) {
        addChatMessage({ role: 'bot', content: tree['entry'].message });
      }
    }, 100);
  };

  const handleDownloadPDF = () => {
    generatePDF(chatHistory, screenKey);
  };

  const node = currentNode();
  const options = node?.options || [];

  // Switch to a different screen's chat
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

  if (!chatOpen) {
    return (
      <button className="chat-fab" onClick={() => setChatOpen(true)} title="Open AI Analysis">
        <MessageSquare size={20} />
        <span>Ask AI</span>
      </button>
    );
  }

  return (
    <div className={`chatbot-panel ${expanded ? 'expanded' : ''}`}>
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <div className="chatbot-avatar-sm">AI</div>
          <div>
            <div className="chatbot-title">Growth Analyst</div>
            <div className="chatbot-subtitle">
              {screenDefinitions[screenKey]?.name || 'Command Centre'} · Guided Analysis
            </div>
          </div>
        </div>
        <div className="chatbot-header-actions">
          <button onClick={handleDownloadPDF} title="Download PDF Report" className="chat-header-btn">
            <Download size={14} />
          </button>
          <button onClick={handleReset} title="Reset conversation" className="chat-header-btn">
            <RotateCcw size={14} />
          </button>
          <button onClick={() => setExpanded(e => !e)} title={expanded ? 'Minimize' : 'Expand'} className="chat-header-btn">
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={() => setChatOpen(false)} className="chat-header-btn close">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Screen switcher */}
      <div className="chat-screen-switcher">
        {Object.values(screenDefinitions).map(s => (
          <button
            key={s.id}
            className={`screen-chip ${screenKey === s.id ? 'active' : ''}`}
            onClick={() => handleScreenSwitch(s.id)}
          >
            {s.id}
          </button>
        ))}
      </div>

      <div className="chatbot-messages" id="chat-messages-container">
        {chatHistory.map((msg, i) => (
          <ChatMessage key={i} msg={msg} />
        ))}
        {isNavigating && (
          <div className="chat-message bot">
            <div className="chat-avatar">AI</div>
            <div className="chat-bubble"><div className="typing-indicator"><span /><span /><span /></div></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {options.length > 0 && !isNavigating && (
        <div className="chatbot-options">
          <div className="options-label">Choose an area to investigate:</div>
          {options.map((opt, i) => (
            <button key={i} className="option-btn" onClick={() => handleOption(opt)}>
              <span>{opt.label}</span>
              {opt.navigateTo && <ChevronRight size={12} className="option-arrow" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
