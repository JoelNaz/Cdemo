import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageSquare, Download, ChevronRight, RotateCcw, Maximize2, Minimize2, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { questionnaireTree } from '../data/questionnaire';
import { screenDefinitions } from '../data/mockData';
import { generatePDF } from '../utils/pdfExport';

function inlineFmt(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
}

function isSep(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

function parseRow(line) {
  return line.split('|').slice(1, -1).map(c => c.trim());
}

function renderTable(lines) {
  const rows = lines.filter(l => !isSep(l));
  if (!rows.length) return '';
  const [hdr, ...body] = rows;
  const headers = parseRow(hdr);
  const dataRows = body.map(parseRow);
  return `<div class="chat-table-wrap"><table><thead><tr>${
    headers.map(h => `<th>${inlineFmt(h)}</th>`).join('')
  }</tr></thead><tbody>${
    dataRows.map(r => `<tr>${r.map(c => `<td>${inlineFmt(c)}</td>`).join('')}</tr>`).join('')
  }</tbody></table></div>`;
}

function renderMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const tr = line.trim();
    // table block
    if (tr.startsWith('|') && tr.endsWith('|')) {
      const block = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) block.push(lines[i++]);
      out.push(renderTable(block));
      continue;
    }
    // headings
    const hm = line.match(/^(#{1,3})\s+(.*)/);
    if (hm) {
      const tag = hm[1].length === 1 ? 'h3' : 'h4';
      out.push(`<${tag} class="chat-heading">${inlineFmt(hm[2])}</${tag}>`);
      i++; continue;
    }
    // unordered list
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i]))
        items.push(`<li>${inlineFmt(lines[i++].replace(/^[-*]\s/, ''))}</li>`);
      out.push(`<ul class="chat-list">${items.join('')}</ul>`);
      continue;
    }
    // ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i]))
        items.push(`<li>${inlineFmt(lines[i++].replace(/^\d+\.\s/, ''))}</li>`);
      out.push(`<ol class="chat-list">${items.join('')}</ol>`);
      continue;
    }
    // empty
    if (!tr) { out.push('<div class="chat-spacer"></div>'); i++; continue; }
    // paragraph
    out.push(`<p>${inlineFmt(line)}</p>`);
    i++;
  }
  return out.join('');
}

const BotAvatar = ({ size = 28 }) => (
  <div
    className="flex items-center justify-center font-black text-black flex-shrink-0"
    style={{
      width: size, height: size, borderRadius: 8,
      background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      fontSize: size * 0.45, boxShadow: '0 1px 4px rgba(245,158,11,0.35)',
    }}
  >✦</div>
);

function ChatMessage({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-2.5 items-end animate-in ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && <BotAvatar size={28} />}
      <div
        className={[
          'max-w-[86%] text-[12.5px] leading-[1.62]',
          isBot
            ? 'bg-[var(--bg-card)] text-[var(--text-primary)] rounded-[4px_14px_14px_14px] px-[14px] py-[11px]'
            : 'rounded-[14px_4px_14px_14px] px-[14px] py-[10px] font-medium',
        ].join(' ')}
        style={isBot
          ? { boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px var(--border)' }
          : { background: 'var(--accent)', color: '#000' }
        }
      >
        {isBot
          ? <div className="chat-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
          : <div>{msg.content}</div>
        }
        {msg.navigatedTo && (
          <div className="mt-2 pt-2 border-t border-[rgba(0,0,0,0.06)] text-[10px] flex items-center gap-1.5" style={{ color: 'var(--info)' }}>
            <span className="w-1 h-1 rounded-full bg-[var(--success)]" />
            Navigated to {screenDefinitions[msg.navigatedTo]?.name}
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
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (currentScreen !== screenKey) {
      setScreenKey(currentScreen);
      setNodeKey('entry');
    }
  }, [currentScreen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatOpen]);

  useEffect(() => {
    if (!chatOpen) return;
    const tree = questionnaireTree[screenKey];
    if (!tree) return;
    const node = tree[nodeKey] || tree['entry'];
    if (!node) return;
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
    addChatMessage({ role: 'user', content: option.label });
    if (option.navigateTo) {
      const screen = screenDefinitions[option.navigateTo];
      if (screen) {
        setIsNavigating(true);
        setTimeout(() => {
          navigate(screen.path);
          setScreenKey(option.navigateTo);
          setIsNavigating(false);
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

  const handleFreeInput = (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query || isNavigating) return;
    setInputValue('');
    addChatMessage({ role: 'user', content: query });

    // Keyword match across all nodes in current + all screens
    const lq = query.toLowerCase();
    const keywords = lq.split(/\s+/).filter(w => w.length > 2);

    let best = null;
    let bestScore = 0;

    const searchTree = (treeKey, tree) => {
      for (const [nodeId, node] of Object.entries(tree)) {
        for (const opt of (node.options || [])) {
          const score = keywords.filter(k => opt.label.toLowerCase().includes(k)).length;
          if (score > bestScore) { bestScore = score; best = { treeKey, nodeId, node, opt }; }
        }
        const msgScore = keywords.filter(k => (node.message || '').toLowerCase().includes(k)).length;
        if (msgScore > bestScore + 1) { bestScore = msgScore; best = { treeKey, nodeId, node, opt: null }; }
      }
    };

    // Search current screen first, then all others
    const currentTree = questionnaireTree[screenKey];
    if (currentTree) searchTree(screenKey, currentTree);
    if (bestScore < 2) {
      for (const [sk, tree] of Object.entries(questionnaireTree)) {
        if (sk !== screenKey) searchTree(sk, tree);
      }
    }

    setTimeout(() => {
      if (best && bestScore > 0) {
        if (best.opt?.navigateTo) {
          handleOption(best.opt);
        } else if (best.opt?.next) {
          const tree = questionnaireTree[best.treeKey];
          const nextNode = tree?.[best.opt.next];
          if (nextNode) { addChatMessage({ role: 'bot', content: nextNode.message, showChart: nextNode.showChart }); setNodeKey(best.opt.next); }
        } else {
          addChatMessage({ role: 'bot', content: best.node.message, showChart: best.node.showChart });
          if (best.treeKey === screenKey) setNodeKey(best.nodeId);
        }
      } else {
        addChatMessage({
          role: 'bot',
          content: `I don't have specific data on that for **${screenDefinitions[screenKey]?.name}**. Try one of the analysis options below, or switch screens using the tabs above.`,
        });
      }
    }, 320);
  };

  const handleReset = () => {
    resetChat();
    setNodeKey('entry');
    setScreenKey(currentScreen);
    setTimeout(() => {
      const tree = questionnaireTree[currentScreen];
      if (tree && tree['entry']) {
        addChatMessage({ role: 'bot', content: tree['entry'].message });
      }
    }, 100);
  };

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

  const node = currentNode();
  const options = node?.options || [];

  if (!chatOpen) {
    return (
      <button className="chat-fab" onClick={() => setChatOpen(true)} title="Open AI Analysis">
        <span className="font-black text-[14px]">✦</span>
        <span>Ask AI</span>
      </button>
    );
  }

  return (
    <div className={`chatbot-panel ${expanded ? 'expanded' : ''}`} style={{ borderTop: '2px solid var(--accent)' }}>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-3">
          <BotAvatar size={36} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13.5px] font-bold text-[var(--text-primary)] tracking-[-0.1px]">Growth Analyst</span>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--success)' }} />
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {screenDefinitions[screenKey]?.name || 'Command Centre'} · AI Analysis
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[
            { icon: <Download size={13} />, action: () => generatePDF(chatHistory, screenKey), title: 'Download PDF' },
            { icon: <RotateCcw size={13} />, action: handleReset, title: 'Reset' },
            { icon: expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />, action: () => setExpanded(e => !e), title: 'Expand' },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} title={btn.title}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-muted)' }}>
              {btn.icon}
            </button>
          ))}
          <button onClick={() => setChatOpen(false)}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--critical-bg)]"
            style={{ color: 'var(--text-muted)' }}>
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Screen switcher */}
      <div className="flex gap-1 px-3.5 py-2 overflow-x-auto border-b border-[var(--border)] flex-shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ background: 'var(--bg-secondary)' }}>
        {Object.values(screenDefinitions).map(s => (
          <button
            key={s.id}
            onClick={() => handleScreenSwitch(s.id)}
            className="whitespace-nowrap cursor-pointer transition-all text-[9px] font-bold tracking-[0.4px] px-2.5 py-1 rounded-md"
            style={screenKey === s.id
              ? { background: 'var(--accent)', color: '#000', fontFamily: "'DM Mono', monospace" }
              : { background: 'transparent', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }
            }
            onMouseEnter={e => { if (screenKey !== s.id) e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { if (screenKey !== s.id) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {s.id}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-4" id="chat-messages-container"
        style={{ background: 'var(--bg-primary)' }}>
        {chatHistory.map((msg, i) => (
          <ChatMessage key={i} msg={msg} />
        ))}
        {isNavigating && (
          <div className="flex gap-2.5 items-end">
            <BotAvatar size={28} />
            <div className="px-4 py-3 rounded-[4px_14px_14px_14px]"
              style={{ background: 'var(--bg-card)', boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px var(--border)' }}>
              <div className="flex gap-1.5 items-center h-4">
                {[0, 0.18, 0.36].map((d, i) => (
                  <span key={i} className="w-[6px] h-[6px] rounded-full" style={{ background: 'var(--text-muted)', animation: `typingBounce 1.3s ${d}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Options */}
      {options.length > 0 && !isNavigating && (
        <div className="border-t border-[var(--border)] flex-shrink-0 max-h-[34vh] overflow-y-auto" style={{ background: 'var(--bg-secondary)' }}>
          <div className="px-4 pt-2.5 pb-1 text-[9.5px] font-bold uppercase tracking-[0.8px]" style={{ color: 'var(--text-muted)' }}>
            Suggested questions
          </div>
          <div className="px-3 pb-2 flex flex-col gap-0.5">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOption(opt)}
                className="group flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg font-[inherit] text-[12px] leading-[1.4] transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="w-[5px] h-[5px] rounded-full flex-shrink-0 transition-colors"
                  style={{ background: 'var(--border-light)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                />
                <span className="flex-1">{opt.label}</span>
                {opt.navigateTo && (
                  <ChevronRight size={11} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleFreeInput}
        className="flex items-center gap-2.5 px-3.5 py-3 border-t border-[var(--border)] flex-shrink-0"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="flex-1 flex items-center gap-2 rounded-full px-4 py-0 border transition-colors focus-within:border-[var(--accent)]"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask anything…"
            className="flex-1 bg-transparent py-[9px] text-[12.5px] outline-none font-[inherit] placeholder:text-[var(--text-muted)]"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
        <button
          type="submit"
          disabled={!inputValue.trim() || isNavigating}
          className="w-9 h-9 rounded-full flex items-center justify-center text-black flex-shrink-0 transition-opacity disabled:opacity-35 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', boxShadow: '0 2px 8px rgba(245,158,11,0.35)' }}
        >
          <Send size={14} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
