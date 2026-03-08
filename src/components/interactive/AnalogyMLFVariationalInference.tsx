import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFVariationalInference() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you need to describe the shape of a complex, rugged coastline. Drawing it exactly is prohibitively difficult, but you can approximate it with smooth curves that capture the essential bays and peninsulas.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Direct minimization of KL(q \\| p(  D)) is impossible because it requires evaluating p(  D), which is exactly what we cannot compute. However, we can decompose the log-evidence:  [equation]  where the ELBO is:  [equation]  Since  p(D) is a constant with respect to q, minimizing the KL divergence is equivalent to maximizing the ELBO.' },
    { emoji: '🔍', label: 'In Detail', text: 'The key insight is to convert an inference problem (computing a posterior) into an optimization problem (finding the best approximation). This makes VI dramatically faster than MCMC for large-scale problems, at the cost of introducing approximation error.' },
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
