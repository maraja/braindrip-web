import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLFunctionApproximation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are a real estate appraiser. Early in your career, you memorize the price of every house you have seen -- a mental lookup table. But when you encounter a new house, you are helpless. Eventually, you learn rules: square footage matters, neighborhood matters, number of bedrooms matters.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Instead of maintaining a table V(s) for each state, we learn a parameterized approximation:  [equation]  We update the weight vector w using stochastic gradient descent (SGD) to minimize the mean squared value error:  [equation]  where d_(s) is the on-policy state distribution.' },
    { emoji: '🔍', label: 'In Detail', text: 'In tabular RL, we store one value per state in a table of size $$, enabling generalization to unseen states.' },
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
