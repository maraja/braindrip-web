import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFPrincipalComponentAnalysis() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine photographing a three-dimensional sculpture. Each photograph is a 2D projection that captures some but not all of the object\'s shape. PCA finds the "camera angles" that capture the most information -- specifically, the directions along which the data varies the most.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Center the data: subtract the mean &#123;x&#125; from each observation. Compute the covariance matrix:  = &#123;1&#125;&#123;n-1&#125; X^T X. Compute eigenvalues _1  _2    _d and corresponding eigenvectors v_1, v_2, , v_d of .' },
    { emoji: '🔍', label: 'In Detail', text: 'The method was introduced by Karl Pearson in 1901 and independently by Harold Hotelling in 1933. It remains the most widely used dimensionality reduction technique more than a century later.' },
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
