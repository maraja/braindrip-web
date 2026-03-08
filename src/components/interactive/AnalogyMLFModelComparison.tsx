import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFModelComparison() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two weather forecasting systems. System A achieves 85.2% accuracy and System B achieves 84.7% accuracy on the same test set. Is A genuinely better, or is the difference just a lucky draw of test examples?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Suppose 5-fold CV produces accuracy estimates for two models:  Mean: A = 0.850, B = 0.850. Yet looking fold-by-fold, sometimes A wins, sometimes B wins. Even with different means, the variability of the estimates determines whether the difference is significant.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given two models f_A and f_B evaluated on the same data, we test the null hypothesis H_0: E[L_A] = E[L_B] (the models have equal expected performance) against the alternative H_1: E[L_A]  E[L_B].' },
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
