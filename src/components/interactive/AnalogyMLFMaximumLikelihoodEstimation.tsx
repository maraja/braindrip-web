import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFMaximumLikelihoodEstimation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Suppose you flip a coin 100 times and observe 73 heads. What is the most reasonable estimate of the coin\'s bias p? Intuitively, &#123;p&#125; = 0.73 -- the value that makes the observed outcome most probable. This intuition is Maximum Likelihood Estimation (MLE): choose the parameter values that maximize the probability of the data you actually observed.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The likelihood function &#123;L&#125;() is the joint probability of the observed data, viewed as a function of the parameters:  [equation]  The product arises from assuming the observations are independent and identically distributed (i.i.d.).' },
    { emoji: '🔍', label: 'In Detail', text: 'More formally, given observed data D = \\&#123;x_1, x_2, , x_n\\&#125; assumed to be generated from a distribution p(x|), MLE finds:' },
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
