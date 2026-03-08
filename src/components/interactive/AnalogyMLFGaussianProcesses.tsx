import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFGaussianProcesses() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are sketching a curve through a handful of data points. There are infinitely many curves that pass through those points. A Gaussian Process (GP) does not commit to a single curve -- instead it maintains a probability distribution over all possible functions, and the data progressively constrain which functions are plausible.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given training data \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^n with observation model y_i = f(x_i) +  where   &#123;N&#125;(0, _n^2), and test inputs X_*, the posterior predictive distribution is:  [equation]  with:  [equation]  [equation]  The posterior mean &#123;f&#125;_* is a weighted combination of observed outputs.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a Gaussian Process is a collection of random variables, any finite number of which have a joint Gaussian distribution. A GP is fully specified by a mean function m(x) and a covariance (kernel) function k(x, x\'):' },
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
