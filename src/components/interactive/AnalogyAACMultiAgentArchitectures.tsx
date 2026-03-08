import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACMultiAgentArchitectures() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how different organizations structure their teams. A factory assembly line passes work sequentially from station to station (pipeline). A courtroom has prosecution and defense arguing before a judge (debate). A corporation has executives directing managers who direct individual contributors (hierarchy).' },
    { emoji: '⚙️', label: 'How It Works', text: 'Agents process work in a fixed sequence, each receiving the output of the previous agent and producing input for the next. Agent A drafts content, Agent B reviews it, Agent C formats it, Agent D publishes it. This is the simplest multi-agent pattern and works well when tasks have clear, non-overlapping stages.' },
    { emoji: '🔍', label: 'In Detail', text: 'Multi-agent architectures apply these same organizational patterns to AI agents. Instead of relying on a single monolithic agent to handle everything, the system distributes work across multiple specialized agents that interact through defined patterns.' },
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
