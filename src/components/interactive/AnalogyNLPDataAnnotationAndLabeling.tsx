import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPDataAnnotationAndLabeling() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine teaching a child to recognize animals by showing them thousands of photographs, each carefully labeled: "dog," "cat," "horse." The quality of the child\'s learning depends entirely on the quality and consistency of those labels.' },
    { emoji: '⚙️', label: 'How It Works', text: '#### Sequence Labeling: BIO and IOB2  For tasks like NER (see named-entity-recognition.md) and chunking, the BIO (Beginning-Inside-Outside) scheme encodes entity boundaries at the token level:  B-X: Beginning of an entity of type X I-X: Inside (continuation) of entity X O: Outside any entity  The IOB2 variant (Ratinov and Roth, 2009) is now the de.' },
    { emoji: '🔍', label: 'In Detail', text: 'This is the most labor-intensive, expensive, and error-prone step in the supervised NLP pipeline. A single NER dataset like CoNLL-2003 required annotators to label 301,418 tokens; the Penn Treebank required over 4.5 years of annotator effort to tag and parse 1 million words.' },
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
