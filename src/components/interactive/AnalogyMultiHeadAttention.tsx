import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMultiHeadAttention() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '👓', label: 'Multiple Lenses', text: 'Multi-head attention is like examining a painting through different colored lenses simultaneously. One lens highlights composition, another color contrast, another brushwork. Each attention head looks at the same words but focuses on different relationships — syntax, semantics, coreference — then combines all perspectives into a richer understanding.' },
    { emoji: '📰', label: 'Newsroom', text: 'Imagine a newsroom where multiple reporters cover the same event. One focuses on who did what (subject-verb), another on where it happened (spatial relations), another on why (causal links). Each reporter (head) writes their angle independently, and the editor (linear projection) merges them into one comprehensive story.' },
    { emoji: '🎵', label: 'Orchestra Sections', text: 'An orchestra has strings, brass, woodwinds, and percussion all playing the same piece but each contributing a different texture. Multi-head attention works similarly: each head is a section of the orchestra capturing a different "frequency" of linguistic relationship. The conductor combines them into a full, rich sound.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
