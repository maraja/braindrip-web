import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFKernelMethods() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to separate red and blue coins on a table with a straight line -- impossible if they are arranged in concentric circles. But if you could lift the coins into three dimensions, placing red coins high and blue coins low, a flat plane could separate them easily.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Consider input x = (x_1, x_2)  &#123;R&#125;^2 and the polynomial mapping:  [equation]  The inner product in feature space is:  [equation]  So K(x, x\') = (x^T x\')^2 computes the inner product in the 3D feature space using only operations in the original 2D space.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a feature mapping : &#123;R&#125;^d  &#123;H&#125; takes input data into a (potentially infinite-dimensional) feature space &#123;H&#125;. A kernel function computes the inner product in that space directly:' },
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
