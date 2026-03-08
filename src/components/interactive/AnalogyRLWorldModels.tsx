import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLWorldModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are planning a road trip. You do not need to physically drive every possible route to decide which one is best. Instead, you have an internal mental model of geography, traffic patterns, and road conditions.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The seminal "World Models" paper proposed a three-component architecture:  Vision Model (VAE): A variational autoencoder compresses each observation o_t (e.g., a 64x64 image) into a low-dimensional latent vector z_t  &#123;R&#125;^&#123;32&#125;:  [equation]  Memory Model (MDN-RNN): A recurrent neural network with a Mixture Density Network output predicts the.' },
    { emoji: '🔍', label: 'In Detail', text: 'A world model in RL is a learned neural network that serves the same function: it captures the dynamics of the environment in a compressed, abstract form and allows the agent to simulate future trajectories in its imagination.' },
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
