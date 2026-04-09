import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export default function ContextMenu({ x, y, label, onDrillDown, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 210);
  const adjustedY = Math.min(y, window.innerHeight - 120);

  return (
    <div
      ref={ref}
      className="fixed z-[9999] rounded-xl py-1.5 min-w-[200px]"
      style={{
        left: adjustedX,
        top: adjustedY,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)',
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="px-3 pb-1 pt-0.5 text-[9px] font-bold uppercase tracking-[0.8px]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="mx-1.5 my-1 border-t" style={{ borderColor: 'var(--border)' }} />
      <button
        onClick={() => { onDrillDown(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-semibold text-left transition-colors rounded-md mx-0"
        style={{ color: 'var(--accent)', background: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,191,36,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <Sparkles size={13} />
        AI Drill Down
        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>AI</span>
      </button>
    </div>
  );
}
