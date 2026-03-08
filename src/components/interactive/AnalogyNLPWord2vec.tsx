import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPWord2vec() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine that every word in a language lives at a specific address in a city. Words with similar meanings live in the same neighborhood: "king" and "queen" are neighbors, "cat" and "dog" live on the same block, and "running" and "jogging" share a street.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Word2Vec operationalizes the distributional hypothesis (Firth, 1957): "You shall know a word by the company it keeps." Words appearing in similar contexts should have similar representations.' },
    { emoji: '🔍', label: 'In Detail', text: 'The famous example: vec("king") - vec("man") + vec("woman") = vec("queen"). This is not magic -- it is the geometry of a well-trained embedding space where gender, royalty, and other semantic relationships are encoded as consistent vector offsets.' },
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
