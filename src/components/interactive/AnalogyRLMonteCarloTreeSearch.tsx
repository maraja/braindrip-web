import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLMonteCarloTreeSearch() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are exploring a massive cave system. You cannot map every tunnel, so you adopt a strategy: you preferentially explore tunnels that have looked promising so far (exploitation), while occasionally venturing down unexplored passages (exploration).' },
    { emoji: '⚙️', label: 'How It Works', text: 'Each iteration of MCTS consists of four phases:  Phase 1 -- Selection: Starting from the root node (current game state), traverse the tree by selecting child nodes according to a tree policy.' },
    { emoji: '🔍', label: 'In Detail', text: 'Monte Carlo Tree Search (MCTS) applies this principle to decision-making in sequential problems. It builds a search tree incrementally, focusing computational effort on the most promising branches.' },
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
