import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFRegressionMetrics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are estimating house prices. One model is off by \\5,000 on every prediction. Another is nearly perfect for 99 houses but wildly off by \\500,000 on one. Which model is "better"? The answer depends on which regression metric you use.' },
    { emoji: '⚙️', label: 'How It Works', text: '[equation]  MSE squares each residual before averaging. This has two consequences: (1) large errors are penalized quadratically, so a single prediction off by 10 contributes as much as one hundred predictions off by 1; (2) the units are squared (e.g., dollars-squared), making direct interpretation difficult.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given N observations with true values y_i and predictions &#123;y&#125;_i, regression metrics are scalar summaries of the residuals e_i = y_i - &#123;y&#125;_i.' },
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
