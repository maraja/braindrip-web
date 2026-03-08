import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLCuriosityDrivenExploration() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'A child does not need a reward to explore a new room. They poke at unfamiliar objects, peek behind curtains, and test what happens when they press buttons -- driven purely by curiosity about the unknown.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The core idea: maintain a predictive model of the environment and define curiosity as the model\'s prediction error. States where the model predicts poorly are novel and worth exploring.' },
    { emoji: '🔍', label: 'In Detail', text: 'Standard RL exploration strategies like -greedy and entropy bonuses are undirected -- they add randomness without prioritizing which unknown states to visit. In environments with sparse or no extrinsic rewards, undirected exploration fails catastrophically.' },
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
