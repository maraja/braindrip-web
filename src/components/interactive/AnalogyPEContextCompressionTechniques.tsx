import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEContextCompressionTechniques() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of packing cubes that compress clothes to fit more in a suitcase. Without compression, you might fit five outfits. With compression, the same suitcase holds eight outfits — the clothes are the same, they just take up less space.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most flexible compression technique uses an LLM to summarize content. Feed the full text to a model with instructions like "Summarize the following document, preserving key facts, figures, and conclusions. Target length: 200 words." The summary replaces the original text in the context.' },
    { emoji: '🔍', label: 'In Detail', text: 'Context compression is not about removing information — it is about representing the same information more efficiently. A 2,000-token document that answers a question in one paragraph contains 1,800 tokens of setup, context, and tangential detail.' },
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
