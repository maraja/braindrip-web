import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFGradientBoosting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a sculptor starting with a rough block of marble. The first pass removes large chunks to establish a coarse shape. Each subsequent pass focuses on finer details -- smoothing surfaces, refining edges, adding texture. The sculptor never starts over; each pass corrects the remaining imperfections from the previous one.' },
    { emoji: '⚙️', label: 'How It Works', text: 'We seek a function F(x) that minimizes a loss L(y, F(x)) over the training data. Gradient Boosting builds F as an additive expansion:  [equation]  where F_0(x) is an initial estimate (e.g., the mean of y for squared error loss), h_t are base learners (typically small decision trees), and   (0, 1] is the learning rate (shrinkage parameter).' },
    { emoji: '🔍', label: 'In Detail', text: 'Gradient Boosting, formalized by Jerome Friedman in 2001, builds predictive models in exactly this way. It constructs an ensemble by sequentially adding models that correct the errors of the current ensemble. Each new model is fit not to the original targets but to the negative gradient of the loss function evaluated at the current predictions.' },
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
