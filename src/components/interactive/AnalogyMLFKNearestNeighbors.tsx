import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFKNearestNeighbors() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine moving to a new city and trying to guess whether a neighborhood is expensive. The simplest strategy: look at the K houses closest to the one you are evaluating and take the average of their prices.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Store the entire training set \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^n. Given a query x_q, compute the distance d(x_q, x_i) to every training point. Select the K training points with the smallest distances.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a query point x_q, KNN finds the set N_K(x_q) of the K training points closest to x_q under some distance metric d(x, x\'), then predicts:' },
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
