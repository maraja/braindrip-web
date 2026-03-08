import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPOpenInformationExtraction() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Traditional information extraction requires a predefined schema: you decide in advance that you want to extract (company, acquired, company) relations and train a model specifically for that. But what if you want to extract every relationship mentioned in a billion web pages without knowing what those relationships will be?' },
    { emoji: '⚙️', label: 'How It Works', text: 'The key insight driving Open IE is that syntactic patterns can reliably signal semantic relations without domain knowledge. A verb connecting two noun phrases almost always expresses a relationship between them. Open IE systems exploit this by:  Identifying candidate argument pairs (noun phrases).' },
    { emoji: '🔍', label: 'In Detail', text: 'Open Information Extraction (Open IE) solves this by extracting relation triples in the form (subject, relation, object) without requiring any predefined relation types, training data, or domain-specific engineering.' },
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
