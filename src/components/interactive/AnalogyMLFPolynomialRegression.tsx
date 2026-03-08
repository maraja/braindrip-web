import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFPolynomialRegression() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Suppose you are studying how a car\'s fuel efficiency changes with engine RPM. At low RPMs efficiency climbs, peaks in a mid-range, and then drops at high RPMs -- a clear curve, not a line. Polynomial regression captures such curvature by adding powers of the predictor as new features.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given the original feature matrix X  &#123;R&#125;^&#123;n x p&#125;, we construct an expanded matrix  that includes all polynomial terms up to degree d. For a single feature, the mapping is:  [equation]  For multiple features x_1, x_2, a degree-2 expansion includes:  [equation]  The number of features in a full degree-d expansion of p variables is &#123;p + d&#125;&#123;d&#125; - 1,.' },
    { emoji: '🔍', label: 'In Detail', text: 'For a single predictor x and degree d, the polynomial regression model is:' },
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
