import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFActivationFunctions() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a neuron as a judge scoring a performance. The weighted sum of inputs produces a raw score, but the activation function decides how to express that score -- should it be a smooth probability, a sharp yes/no, or a "pass-through only if positive"?' },
    { emoji: '⚙️', label: 'How It Works', text: '[equation]  The sigmoid squashes inputs to (0, 1), making it natural for probabilities. However, it has two critical problems: (1) saturation -- for   0, the derivative \'(z)  0, causing vanishing gradients; and (2) non-zero-centered outputs -- since (z) &gt; 0 always, gradients on weights are always the same sign for a given layer, causing.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a pre-activation z = w^ x + b, the activation function f(z) produces the neuron\'s output h = f(z). Without nonlinear activations, a multilayer network collapses to a single linear transformation, regardless of depth.' },
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
