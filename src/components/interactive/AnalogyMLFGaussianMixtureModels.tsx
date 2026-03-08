import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFGaussianMixtureModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Suppose you measure the heights of people in a room but do not know who is an adult and who is a teenager. The overall height distribution looks like a bumpy curve -- not a single bell shape. You suspect it is actually two overlapping bell curves (Gaussians) added together.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Direct maximum likelihood optimization of GMM parameters is intractable because the log-likelihood involves a log of sums. The Expectation-Maximization (EM) algorithm resolves this by iterating between two steps:  E-step (Expectation): Compute the responsibility of each component k for each data point x_i:  [equation]  This is the posterior.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a GMM defines the probability density:' },
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
