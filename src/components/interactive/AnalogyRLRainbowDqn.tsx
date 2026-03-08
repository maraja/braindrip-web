import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLRainbowDqn() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you\'re building a race car. You could add a turbocharger for power, improve the suspension for handling, use lighter materials for speed, upgrade the brakes for control, add better tires for grip, and optimize aerodynamics for drag reduction. Each improvement helps independently, but what happens when you combine all six?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Double Q-Learning (van Hasselt et al., 2016)  Addresses DQN\'s overestimation bias by decoupling action selection from evaluation:  [equation]  The online network  selects the best action, but the target network ^- evaluates it (see double-dqn.md). Prioritized Experience Replay (Schaul et al.' },
    { emoji: '🔍', label: 'In Detail', text: 'Between 2015 and 2017, researchers proposed several independent improvements to the original DQN algorithm: Double Q-learning, Dueling architectures, Prioritized Experience Replay, multi-step returns, distributional RL, and Noisy Networks. Hessel et al.' },
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
