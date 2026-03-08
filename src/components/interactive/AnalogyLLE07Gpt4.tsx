import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE07Gpt4() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine that a company builds the world\'s most powerful telescope. They show you breathtaking images of distant galaxies, prove it can see further than any instrument before it, and let you look through the eyepiece — but they refuse to tell you how the lenses were ground, what materials were used, or even how large the telescope is.' },
    { emoji: '⚙️', label: 'How It Works', text: 'OpenAI disclosed almost nothing about GPT-4\'s architecture. The technical report stated only that it was a "Transformer-style model pre-trained to predict the next token in a document, using both publicly available data and data licensed from third-party providers.' },
    { emoji: '🔍', label: 'In Detail', text: 'Released on March 14, 2023, GPT-4 was described in a 98-page "technical report" that was notable for how little technical detail it contained. OpenAI cited "the competitive landscape and the safety implications of large-scale models" as reasons for not disclosing architecture, model size, training data, or training methodology.' },
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
