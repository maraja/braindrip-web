import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFGeneralizedLinearModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Ordinary linear regression assumes that the response variable is continuous and normally distributed around its mean. But what if you are predicting whether a customer will churn (binary outcome), how many accidents occur at an intersection per year (count data), or how long until a machine fails (positive continuous)?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every GLM is specified by three components:  Random Component: The response y_i follows a distribution from the exponential family:  [equation]  where _i is the natural (canonical) parameter,  is a dispersion parameter, and b(), a(), c() are known functions defining the specific distribution.' },
    { emoji: '🔍', label: 'In Detail', text: 'Generalized linear models (GLMs) extend linear regression to handle all of these situations within a single unified framework. The key idea is elegant: instead of modeling the response mean directly as a linear function of predictors, GLMs model a transformation of the mean (the link function) as linear, while allowing the response to follow any.' },
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
