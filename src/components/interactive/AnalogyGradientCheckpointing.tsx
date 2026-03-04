import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyGradientCheckpointing() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '💾', label: 'Save Points', text: 'In a video game, you can either save at every room (high memory) or only at key checkpoints and replay sections when needed (less memory). Gradient checkpointing saves activations only at selected layers during the forward pass. During backpropagation, it recomputes the in-between activations from the nearest checkpoint. This trades ~30% extra compute for ~60% less memory.' },
    { emoji: '📝', label: 'Partial Notes', text: 'A student can take detailed notes on every lecture slide (full activation storage) or only note key section headers and reconstruct the details when studying (checkpointing). During the backward pass, the model recomputes the activations between checkpoints. This is essential for training large models: without it, storing all activations for a 96-layer model would exceed GPU memory.' },
    { emoji: '🗺', label: 'Trail Markers', text: 'A hiker marking every tree (full memory) would run out of ribbons. Instead, they mark trees at trail junctions (checkpoints) and retrace their steps between markers when needed. Gradient checkpointing selectively stores activations at chosen layers and recomputes the rest during backward pass. The memory savings allow training models 3-4x larger on the same hardware.' },
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
