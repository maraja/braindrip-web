import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFUniversalApproximationTheorem() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have an unlimited supply of adjustable flashlights, each projecting a different shaped beam. By aiming enough of them at a wall and adjusting their intensities, you can create any image you want -- a sunset, a face, a fractal.' },
    { emoji: '⚙️', label: 'How It Works', text: 'George Cybenko proved the first version of the UAT for sigmoid activation functions. The precise statement:  Let  be any continuous sigmoidal function (i.e., (z)  1 as z  + and (z)  0 as z  -).' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, the theorem states that a feedforward network with a single hidden layer containing a finite number of neurons can approximate any continuous function on a compact subset of &#123;R&#125;^n to arbitrary precision, provided the activation function satisfies certain mild conditions.' },
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
