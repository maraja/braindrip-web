import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACSelfImprovingAgents() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how a new employee improves. On day one, they follow procedures mechanically. After a week, they start recognizing patterns: "when the client says X, they usually mean Y." After a month, they develop shortcuts and heuristics.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most accessible form of self-improvement: the user tells the agent what it did wrong, and the agent remembers. Implementation: when a user corrects an output ("actually, our company uses British spelling, not American"), the agent stores this as a persistent memory or preference.' },
    { emoji: '🔍', label: 'In Detail', text: 'The challenge is that most AI agents today are static. Deploy an agent on Monday, and it operates identically on Friday, regardless of what it encountered during the week. Every mistake is repeated. Every inefficiency persists. Every user correction is forgotten after the conversation ends.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
