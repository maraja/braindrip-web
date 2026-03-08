import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLDeepQNetworks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to learn chess by playing random games and keeping a notebook with one entry per board position. You would need more notebooks than atoms in the observable universe. Instead, you develop intuition -- pattern recognition that lets you evaluate novel positions you have never seen before.' },
    { emoji: '⚙️', label: 'How It Works', text: 'DQN takes a stack of the last 4 grayscale game frames (84x84 pixels each) as input and outputs a Q-value for each possible action. The architecture for Atari is:  Input: 4 x 84 x 84 preprocessed grayscale frames Conv Layer 1: 32 filters, 8 x 8 kernel, stride 4, ReLU Conv Layer 2: 64 filters, 4 x 4 kernel, stride 2, ReLU Conv Layer 3: 64 filters, 3.' },
    { emoji: '🔍', label: 'In Detail', text: 'DQN, introduced by Mnih et al. at DeepMind, was the first algorithm to successfully combine deep neural networks with reinforcement learning at scale. The 2015 Nature paper demonstrated a single architecture and set of hyperparameters that achieved human-level performance across 49 Atari 2600 games, learning directly from raw 210x160 pixel frames.' },
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
