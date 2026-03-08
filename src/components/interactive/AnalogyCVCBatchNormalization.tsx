import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCBatchNormalization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a factory assembly line where each station expects parts within a specific size range. If station 3 suddenly outputs oversized parts, stations 4 through 10 must constantly re-calibrate, slowing the entire line.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For a mini-batch &#123;B&#125; = \\&#123;x_1, , x_m\\&#125; of activations at a given layer:  [equation]  [equation]  [equation]  [equation]  where  (scale) and  (shift) are learned parameters, and   10^&#123;-5&#125; prevents division by zero.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, batch normalization (Ioffe & Szegedy, 2015) normalizes the pre-activation values across the mini-batch dimension, then applies a learned affine transformation to restore representational power.' },
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
