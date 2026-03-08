import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFRidgeAndLassoRegression() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Suppose you are predicting a patient\'s blood pressure from 500 genomic markers measured on only 100 patients. OLS fails spectacularly here: with p &gt; n, the system is underdetermined and X^TX is singular. Even when p &lt; n, highly correlated predictors inflate coefficient variance, producing unstable and unreliable estimates.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Ridge regression minimizes the penalized objective:  [equation]  where   0 is the regularization parameter. The closed-form solution is:  [equation]  The addition of  I to X^TX ensures invertibility regardless of multicollinearity. As   0, the solution approaches OLS; as   , all coefficients shrink toward zero (but never reach exactly zero).' },
    { emoji: '🔍', label: 'In Detail', text: 'Ridge and Lasso regression are the two most important regularized regression methods. They differ in the geometry of their penalty, and this geometric difference has profound consequences for the solutions they produce.' },
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
