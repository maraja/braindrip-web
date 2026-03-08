import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLReturnAndDiscountFactor() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are offered two deals: 100 today, or 100 one year from now. Most people prefer the money today -- not just because of inflation, but because the future is uncertain and immediate rewards can be reinvested. RL agents face the same tradeoff.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest aggregation of rewards is the undiscounted return -- the sum of all future rewards from timestep t:  [equation]  This works for episodic tasks with a finite horizon T (e.g., a game that always ends). But for continuing tasks where T = , this sum can diverge to infinity, making comparison between policies meaningless.' },
    { emoji: '🔍', label: 'In Detail', text: 'The return is the single number that an RL agent is trying to maximize. It transforms a stream of individual rewards into one scalar objective, making it possible to compare different policies and define what "optimal" means.' },
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
