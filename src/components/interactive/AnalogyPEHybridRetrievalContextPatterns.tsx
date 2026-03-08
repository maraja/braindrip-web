import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEHybridRetrievalContextPatterns() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of hybrid retrieval like searching for a house. You might use Zillow\'s structured filters (3 bedrooms, under $500K, good school district), Google Maps satellite view to assess the neighborhood visually, and conversations with neighbors to learn things no database captures.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Dense retrieval encodes queries and documents into high-dimensional vectors (embeddings) using neural models, then finds documents whose embeddings are closest to the query embedding (typically by cosine similarity or dot product). Strengths: Captures semantic meaning, synonyms, and paraphrases.' },
    { emoji: '🔍', label: 'In Detail', text: 'Hybrid retrieval combines multiple retrieval methods — typically dense (embedding-based semantic search), sparse (keyword-based methods like BM25), and structured (SQL queries, knowledge graphs, metadata filters) — to produce a more complete and accurate set of candidate documents.' },
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
