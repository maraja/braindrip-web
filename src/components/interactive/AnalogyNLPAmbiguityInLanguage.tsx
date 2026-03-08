import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPAmbiguityInLanguage() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'A sentence is ambiguous when it has more than one valid interpretation. This is not a bug in human language -- it is a fundamental design feature. Natural languages are compact, efficient communication systems that routinely reuse sounds, words, and structures to express different meanings, relying on context to disambiguate.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Lexical ambiguity occurs when a single word has multiple meanings. This is the most pervasive type of ambiguity. Homonymy: Unrelated meanings that happen to share a spelling and/or pronunciation.' },
    { emoji: '🔍', label: 'In Detail', text: 'Consider the sentence "I saw her duck." Is "duck" a noun (I saw the duck belonging to her) or a verb (I saw her duck down to avoid something)? Is "saw" a verb of perception (I observed) or a past-tense cutting tool reference (I used a saw on her duck)? Is "her" a possessive (her duck) or an object pronoun (I saw her, who was ducking)?' },
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
