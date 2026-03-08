import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPMultilingualNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are a librarian tasked with organizing books -- but the collection spans every language on Earth, from English bestsellers filling entire wings to languages like Warlpiri or Quechua represented by a single handwritten notebook.' },
    { emoji: '⚙️', label: 'How It Works', text: 'There are approximately 7,168 living languages (Ethnologue, 2024), but the distribution of digital resources is staggeringly unequal. English alone accounts for roughly 60% of web content. The top 10 languages cover over 80% of digital text.' },
    { emoji: '🔍', label: 'In Detail', text: 'Multilingual NLP is the subfield concerned with building natural language processing systems that function across multiple languages, ideally all of them. Rather than engineering a separate pipeline for each language -- separate tokenizers, separate embeddings, separate task models -- multilingual NLP seeks shared architectures and representations.' },
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
