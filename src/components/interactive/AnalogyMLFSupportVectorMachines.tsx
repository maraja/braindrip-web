import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFSupportVectorMachines() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have red and blue marbles on a table and want to place a ruler between them so that it separates the two colors. Many ruler positions work, but which is best? Intuitively, you want the ruler to be as far as possible from the closest marble on either side.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The distance from a point x_i to the hyperplane w^T x + b = 0 is &#123;&#125;. The margin is twice the distance to the closest point:  [equation]  Maximizing &#123;2&#125;&#123;\\^2.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given labeled training data \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^n with y_i  \\&#123;-1, +1\\&#125; and x_i  &#123;R&#125;^d, the SVM finds parameters w and b defining the hyperplane w^T x + b = 0 that maximizes the margin while correctly classifying all training points.' },
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
