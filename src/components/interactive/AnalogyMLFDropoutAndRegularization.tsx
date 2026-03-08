import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFDropoutAndRegularization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a basketball team where one or two star players do everything while the rest stand around. If a star player is injured, the team collapses. Now imagine a coach who randomly benches different players each practice, forcing everyone to contribute. The team becomes more robust because no single player is a single point of failure.' },
    { emoji: '⚙️', label: 'How It Works', text: 'During training, for each neuron with activation h_i in a layer, dropout applies a binary mask:  [equation]  where p is the dropout rate (probability of being dropped). At each training step, a new random mask is sampled, so the network effectively trains a different sub-architecture every step.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, dropout (Srivastava et al., 2014; Hinton et al., 2012) randomly sets each neuron\'s activation to zero with probability p during training. At test time, all neurons are active but their outputs are scaled to maintain expected values. This simple stochastic technique is one of the most effective regularizers in deep learning.' },
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
