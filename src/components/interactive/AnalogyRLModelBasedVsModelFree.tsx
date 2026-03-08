import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLModelBasedVsModelFree() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two people learning to cook. The first person reads the recipe, understands the chemistry of how heat transforms proteins, how salt affects osmotic pressure, and mentally simulates what will happen before touching a pan.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Model-free algorithms optimize behavior without learning environment dynamics. Value-based methods learn Q^*(s,a) and derive a policy from it:  [equation]  Examples: Q-learning, DQN, Rainbow. Policy gradient methods directly optimize the parameterized policy _:  [equation]  Examples: REINFORCE, PPO, SAC.' },
    { emoji: '🔍', label: 'In Detail', text: 'In reinforcement learning, a model-free agent learns a policy (as,a) and reward function &#123;R&#125;(s,a) -- and uses this model to plan, simulate, or otherwise reason about consequences before acting.' },
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
