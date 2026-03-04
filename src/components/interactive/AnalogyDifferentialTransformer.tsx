import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyDifferentialTransformer() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎧', label: 'Noise Cancellation', text: 'Noise-canceling headphones use two microphones: one captures signal+noise, the other captures noise alone. Subtracting them isolates the signal. Differential attention does the same: it computes two attention maps and subtracts them, canceling out the noisy, irrelevant attention patterns and amplifying the meaningful ones.' },
    { emoji: '⚖️', label: 'Balance Scale', text: 'A balance scale shows the difference between two weights. Differential transformers place two attention computations on opposite pans. Shared background noise cancels out (equal weight on both sides), while the meaningful signal creates a clear tilt. The result is sharper, more focused attention with less noise.' },
    { emoji: '📸', label: 'Photo Subtraction', text: 'Astronomers find new stars by subtracting two photos of the same sky taken on different nights — only the changes remain. Differential attention subtracts two attention maps computed with different parameters, removing the shared "background haze" of unfocused attention and leaving only the crisp, high-signal relationships.' },
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
