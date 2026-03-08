import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFClassificationMetrics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are a doctor screening patients for a rare disease. You could achieve 99% accuracy by simply declaring everyone healthy -- but you would miss every sick patient. Classification metrics are the different lenses through which we evaluate a classifier\'s predictions, and choosing the wrong lens can hide catastrophic failures.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every binary classification metric derives from four counts in the confusion matrix:  All metrics below are functions of TP, FP, TN, and FN.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, classification metrics are scalar functions that map a set of predictions and ground-truth labels to a real number summarizing some aspect of predictive quality.' },
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
