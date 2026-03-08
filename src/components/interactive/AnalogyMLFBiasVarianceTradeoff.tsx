import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFBiasVarianceTradeoff() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine throwing darts at a target. Bias is how far the center of your throws is from the bullseye -- a systematic offset. Variance is how spread out your throws are from each other. A perfect thrower has low bias and low variance.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Consider a regression setting where we want to predict y = f(x) + , with  being noise with &#123;E&#125;[] = 0 and Var() = ^2. Let &#123;f&#125;(x) be the model trained on a particular training set &#123;D&#125;.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, the bias-variance tradeoff decomposes the expected prediction error of a model into three irreducible components, revealing the fundamental tension that governs all learning algorithms.' },
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
