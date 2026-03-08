import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLRewardShaping() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine teaching a dog to fetch a ball from across a large field. If you only reward the dog when it returns the ball to your hand, it may wander aimlessly for hours before stumbling onto the right behavior. But if you give small treats for looking at the ball, walking toward it, picking it up, and turning back, learning is dramatically faster.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest approach adds a hand-designed bonus F(s, a, s\') to the environment reward:  [equation]  But this changes the MDP, and the optimal policy under R\' may differ from the optimal policy under R.' },
    { emoji: '🔍', label: 'In Detail', text: 'Reward shaping applies the same principle to RL agents. Real-world tasks often have sparse rewards -- the agent receives signal only upon task completion. A robot stacking blocks gets reward only when the tower is complete. A game-playing agent gets reward only at win or loss.' },
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
