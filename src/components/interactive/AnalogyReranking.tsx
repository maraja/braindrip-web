import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyReranking() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏆', label: 'Audition Callbacks', text: 'First auditions screen hundreds of actors quickly (bi-encoder retrieval). Callbacks bring back the top 20 for detailed evaluation with the director (cross-encoder reranking). The cross-encoder reads the query and each document together, enabling deep interaction between them — much more accurate than independent embeddings. It\'s too slow for searching millions of documents, but perfect for reranking the top-k candidates.' },
    { emoji: '🔬', label: 'Two-Stage Filter', text: 'Water purification uses a coarse filter first (removes large debris quickly) then a fine filter (removes microscopic contaminants slowly). Reranking is the fine filter: the initial retrieval (coarse filter) quickly pulls 50-100 candidates from millions of documents, then a cross-encoder (fine filter) carefully evaluates each one by reading the query and document together, producing a much more accurate ranking.' },
    { emoji: '📋', label: 'Resume Screening', text: 'HR does keyword screening on 1000 resumes (fast but rough), then a hiring manager carefully reads the top 30 (slow but accurate). Cross-encoder reranking is the hiring manager: it takes the top candidates from initial retrieval and deeply evaluates each one by processing the query-document pair together through a transformer. This typically boosts retrieval precision by 5-15% for negligible extra cost.' },
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
