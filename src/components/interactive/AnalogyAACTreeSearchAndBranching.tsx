import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACTreeSearchAndBranching() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a chess player analyzing a position. They do not commit to the first move that looks reasonable. Instead, they mentally explore several candidate moves, think through the opponent\'s likely responses to each, evaluate the resulting positions, and only then choose the move that leads to the best projected outcome.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The tree is defined by three components:  Nodes: Each node represents a partial solution state. For a writing task, a node might be a paragraph outline. For a math problem, a node might be an intermediate equation.' },
    { emoji: '🔍', label: 'In Detail', text: 'For AI agents, tree search means generating multiple candidate actions at each decision point, evaluating the consequences of each, and selecting the best path rather than committing to the first plausible action.' },
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
