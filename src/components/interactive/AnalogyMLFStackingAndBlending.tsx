import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFStackingAndBlending() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are deciding where to eat dinner. You ask a food critic, a health-conscious friend, and a budget-minded colleague for recommendations. Each brings a different perspective.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The stacking framework consists of two levels:  Level 0 (Base Learners): A set of K diverse models \\&#123;h_1, h_2, , h_K\\&#125; trained on the original features X. These typically span different model families -- for example, a Random Forest, a gradient boosting model, a logistic regression, a k-nearest neighbors classifier, and a neural network.' },
    { emoji: '🔍', label: 'In Detail', text: 'Stacking, formally known as stacked generalization and introduced by David Wolpert in 1992, applies this same principle to machine learning. It trains a collection of diverse base learners (level-0 models), then feeds their predictions into a meta-learner (level-1 model) that learns the optimal way to combine them.' },
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
