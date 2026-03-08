import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPCrossLingualWordEmbeddings() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two cities that evolved independently, each with its own street grid, naming conventions, and landmarks. Now imagine you discover that both cities have the same underlying geography -- the same rivers, hills, and coastline.' },
    { emoji: '⚙️', label: 'How It Works', text: '(2013) made the foundational observation that monolingual word embedding spaces exhibit similar geometric structures across languages. They proposed learning a linear mapping W from source to target space using a seed bilingual dictionary of n word pairs &#123;(x_i, y_i)&#125;:  where X is the d x n matrix of source embeddings and Y is the corresponding.' },
    { emoji: '🔍', label: 'In Detail', text: 'More formally, given monolingual embedding spaces X (source language) and Y (target language), cross-lingual word embedding methods learn a mapping W such that WX approximates Y for translation pairs.' },
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
