import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPERerankingAndContextSelection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of reranking like shortlisting job candidates from a large applicant pool. The initial resume screen (retrieval) identifies 50 plausible candidates based on keyword matches and general qualifications. But you only have time to interview 5.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Bi-encoder retrieval embeds queries and documents separately, then computes similarity via dot product or cosine distance. This is fast (milliseconds for millions of documents) but imprecise because the query and document never "see" each other during encoding.' },
    { emoji: '🔍', label: 'In Detail', text: 'In RAG systems, the initial retrieval step (whether dense, sparse, or hybrid) returns a ranked list of candidate chunks, typically 10-50. But the language model\'s context window has a limited budget for retrieved content, usually fitting 3-7 chunks depending on chunk size and window capacity.' },
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
