import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFLossFunctions() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a loss function as a scoring rubric for an exam. Two teachers might grade the same essay differently depending on their rubric -- one penalizes small mistakes lightly, the other harshly. Similarly, the loss function defines how wrong each prediction is.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Mean Squared Error (MSE):  [equation]  MSE penalizes large errors quadratically, making it sensitive to outliers. It corresponds to maximum likelihood estimation under Gaussian noise: if y = f(x) +  with   &#123;N&#125;(0, ^2), then minimizing MSE is equivalent to maximizing the log-likelihood.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a loss function &#123;L&#125;(y, &#123;y&#125;) maps a true value y and a predicted value &#123;y&#125; to a non-negative real number quantifying the prediction\'s cost. The learning algorithm minimizes the aggregate loss over the training set:' },
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
