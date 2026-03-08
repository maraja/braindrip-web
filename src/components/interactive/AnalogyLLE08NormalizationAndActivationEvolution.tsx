import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE08NormalizationAndActivationEvolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are mixing concrete. The normalization step is like ensuring your mix of cement, sand, and water has consistent proportions before you pour it — without this, some sections will be too wet and others too dry, and the structure will be unstable.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LayerNorm (Ba, Kiros, & Hinton, 2016) was the normalization method used in the original Transformer. For each token\'s representation, LayerNorm computes the mean and variance across all features, subtracts the mean (centering), and divides by the standard deviation (scaling).' },
    { emoji: '🔍', label: 'In Detail', text: 'In a transformer, these two operations appear in every layer, applied hundreds or thousands of times as a signal passes through the network. Normalization keeps the signal magnitudes stable so training does not diverge. Activation functions in the feed-forward network introduce the nonlinearity that gives the model its expressive power.' },
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
