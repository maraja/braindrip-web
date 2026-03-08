import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCClassificationMetrics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a model that screens medical images for cancer. It labels 95% of images correctly, but it misses 40% of actual cancers. Is it a good model? Accuracy says 95% -- sounds great. Recall says 60% -- dangerously low. Classification metrics are different lenses for evaluating the same model, each revealing a different aspect of performance.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For a binary classifier with classes Positive (P) and Negative (N):  For K classes, the confusion matrix is K x K, where entry (i, j) counts samples of true class i predicted as class j.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, classification metrics are scalar summaries computed from the confusion matrix -- a table counting how predictions align with ground truth across all classes. Different metrics prioritize different types of errors (false positives vs. false negatives) and handle class imbalance differently.' },
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
