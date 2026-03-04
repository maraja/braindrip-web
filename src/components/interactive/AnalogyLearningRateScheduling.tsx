import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyLearningRateScheduling() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🚗', label: 'Speed Zones', text: 'Training is like driving through different speed zones. You start slow (warmup) while getting oriented, accelerate to highway speed (peak learning rate) for the long middle stretch, then gradually slow down (cosine decay) as you approach your destination. Starting too fast causes crashes (divergence); staying fast too long causes you to overshoot the optimal point.' },
    { emoji: '🎨', label: 'Painting Stages', text: 'A painter starts with broad brushstrokes (high learning rate) to lay down the composition quickly. As the painting develops, they switch to finer brushes (lower learning rate) for details. The warmup phase is mixing your paints. The cosine decay is switching to ever-finer brushes. Staying with broad strokes forever means you can never paint fine details.' },
    { emoji: '🌡', label: 'Annealing Metal', text: 'In metallurgy, you heat metal to high temperature (high LR) so atoms move freely and find good configurations, then slowly cool it (decay) so they settle into a strong crystal structure. Learning rate scheduling applies this annealing concept: high LR explores the loss landscape broadly, then low LR refines into a precise minimum. The warmup prevents thermal shock (training instability).' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
