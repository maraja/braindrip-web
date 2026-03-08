import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFLinearRegression() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are an appraiser estimating house prices. You notice that price tends to increase with square footage, number of bedrooms, and neighborhood quality. Linear regression formalizes this intuition: it finds the best-fitting flat surface (a hyperplane) through a cloud of data points so that the overall prediction error is as small as.' },
    { emoji: '⚙️', label: 'How It Works', text: 'We seek &#123;&#125; that minimizes the sum of squared residuals:  [equation]  Taking the gradient with respect to &#123;&#125;, setting it to zero, and solving yields the normal equations:  [equation]  When X^T X is invertible (i.e., no perfect multicollinearity), the closed-form solution is:  [equation]' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, we model the relationship between a response variable y and a vector of p predictors x = (x_1, x_2, , x_p)^T as:' },
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
