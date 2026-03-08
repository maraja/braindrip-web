import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLTargetNetworks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to hit a bullseye on a target that moves every time you throw a dart. No matter how good your aim, the constant movement makes consistent improvement nearly impossible. Now imagine the target stays fixed for 100 throws, then moves to a new position. Suddenly, you can actually practice and improve between resets.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Consider the Q-learning update with function approximation. At each step, we minimize:  [equation]  where the target is y = r +  _&#123;a\'&#125; Q(s\', a\'; w). The gradient is:  [equation]  The problem: y itself depends on w.' },
    { emoji: '🔍', label: 'In Detail', text: 'In standard Q-learning with function approximation, the TD target r +  _&#123;a\'&#125; Q(s\', a\'; w) depends on the same weights w being updated. This creates a feedback loop: each weight update changes both the prediction and the target, causing oscillation or divergence.' },
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
