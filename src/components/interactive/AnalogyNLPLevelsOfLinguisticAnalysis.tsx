import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPLevelsOfLinguisticAnalysis() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of language as an onion with six distinct layers. At the outermost layer, you hear raw sounds; peel inward and you find patterns in those sounds, then word-building rules, sentence structures, meaning, and finally the subtle dance of context and social convention.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Phonetics studies the physical properties of speech sounds -- how the vocal tract shapes airflow into distinct acoustic signals. There are roughly 600 consonant sounds and 200 vowel sounds attested across the world\'s languages. Phonology studies the abstract sound patterns that are meaningful within a particular language.' },
    { emoji: '🔍', label: 'In Detail', text: 'Linguists traditionally organize these layers into a hierarchy, from the most concrete physical signals to the most abstract contextual reasoning. NLP systems, whether they realize it or not, must grapple with every level. A speech recognizer handles phonetics and phonology. A tokenizer navigates morphology. A parser tackles syntax.' },
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
