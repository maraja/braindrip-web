import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPTextNormalization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a library where the same book is filed under three different spellings of its author\'s name -- "Tolkien," "TOLKIEN," and "tolkien." A librarian who normalizes the catalog ensures every card points to the same shelf.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Case folding maps all characters to a single case -- typically lowercase. In Python, str.lower() handles ASCII, while str.casefold() follows the Unicode Case Folding specification (Section 3.13 of the Unicode Standard), which collapses locale-sensitive cases such as the German sharp-s: "Stra00dfe".casefold() yields "strasse".' },
    { emoji: '🔍', label: 'In Detail', text: 'More precisely, text normalization is a family of transformations applied to raw text before any statistical or neural processing. These transformations include case folding ("Apple" to "apple"), Unicode canonical equivalence resolution, accent and diacritics removal, whitespace standardization, number and date format unification, and abbreviation.' },
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
