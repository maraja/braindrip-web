import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFWeightInitialization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine tuning a chain of amplifiers connected in series. If each amplifier boosts the signal even slightly too much, the output at the end is deafening static. If each attenuates slightly too much, the output is silence.' },
    { emoji: '⚙️', label: 'How It Works', text: 'If all weights are zero (or any identical value), every neuron in a layer computes the same function of the input. During backpropagation, all neurons receive identical gradients and update identically. This symmetry is never broken, so the network effectively has one neuron per layer regardless of width.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, weight initialization is the procedure for setting the initial values of weight matrices W^&#123;(l)&#125; and biases b^&#123;(l)&#125; before training begins. The choice of initialization determines whether activations and gradients maintain reasonable magnitudes through deep networks, which directly affects whether training converges at all and how.' },
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
