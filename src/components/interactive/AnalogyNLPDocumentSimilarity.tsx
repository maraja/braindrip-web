import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPDocumentSimilarity() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are an editor who receives a new article and needs to check if something substantially similar has already been published. You might skim both pieces, comparing topics, vocabulary, and arguments.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest set-based measure. Treat each document as a set of words (or n-grams) and compute:  Jaccard similarity ranges from 0 (no overlap) to 1 (identical sets). It ignores word frequency entirely -- a word appearing once counts the same as a word appearing 100 times.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, document similarity is a function sim(d_1, d_2) -&gt; [0, 1] (or sometimes [-1, 1]) that quantifies the resemblance between two documents. The challenge lies in deciding what "similar" means: two documents might share exact words (lexical similarity), discuss the same topic using different words (semantic similarity), have the same.' },
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
