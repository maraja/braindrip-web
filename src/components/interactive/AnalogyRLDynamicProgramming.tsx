import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLDynamicProgramming() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have a complete map of a city -- every road, every traffic delay, every shortcut. With this map in hand, you don\'t need to wander around discovering routes. You can sit at your desk and compute the best route from any location to any destination by working backward from the goal.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a fixed policy , policy evaluation computes the state-value function V^(s) by iteratively applying the Bellman expectation equation as an update rule:  [equation]  Starting from an arbitrary V_0, each sweep over all states produces a better approximation. The sequence \\&#123;V_k\\&#125; converges to V^ as k  .' },
    { emoji: '🔍', label: 'In Detail', text: 'DP methods are planning algorithms. They require a complete model of the MDP (all transition probabilities and rewards), which makes them impractical for most real-world problems.' },
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
