import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFOptimizers() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine hiking down a mountain in dense fog. Vanilla gradient descent tells you to always step in the steepest downhill direction. Momentum is like being a heavy ball that accumulates speed and rolls through small bumps.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest optimizer computes gradients on a mini-batch and updates directly:  [equation]  where  is the learning rate. SGD is noisy due to mini-batch sampling, but this noise can help escape shallow local minima. The learning rate  is the most critical hyperparameter -- too large causes divergence, too small causes painfully slow convergence.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a loss function &#123;L&#125;() and its gradient g_t = _ &#123;L&#125;(_t) at step t, an optimizer defines the update rule _&#123;t+1&#125; = _t + _t. The design of _t determines convergence speed, stability, and the quality of the final solution.' },
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
