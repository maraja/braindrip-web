import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPGlove() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have a massive spreadsheet where every row and every column is a word, and each cell records how often those two words appear near each other across an entire library. This co-occurrence matrix contains a wealth of information about word relationships, but it is enormous and noisy.' },
    { emoji: '⚙️', label: 'How It Works', text: 'First, scan the entire corpus with a symmetric context window of size c (typically 10). For each word pair (i, j) within the window, increment X_ij. Closer words receive higher weight: a word 1 position away contributes 1, a word k positions away contributes 1/k.' },
    { emoji: '🔍', label: 'In Detail', text: 'Developed by Pennington, Socher, and Manning at Stanford in 2014, GloVe explicitly targets a mathematical property: the ratio of co-occurrence probabilities between words should be captured by the difference of their vectors.' },
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
