import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLDynaArchitecture() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a chess novice who plays one game per day against a real opponent but then spends hours replaying positions in their mind, imagining moves and outcomes. Each real game teaches them about the world; each mental simulation extracts additional lessons from that knowledge. They learn far faster than someone who only learns during actual games.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Dyna-Q extends tabular Q-learning with model learning and planning. At each real timestep:  Step 1 -- Act: Select action a in state s using an -greedy policy derived from Q. Step 2 -- Learn from reality: Observe reward r and next state s\'.' },
    { emoji: '🔍', label: 'In Detail', text: 'Dyna, introduced by Richard Sutton in 1991, formalizes this exact idea. The agent maintains three interacting components: (1) a model of the environment learned from real experience, (2) a value function (or policy) updated using both real and simulated experience, and (3) a planning process that generates simulated transitions from the model to.' },
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
