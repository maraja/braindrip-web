import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyColBERT() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🤝', label: 'Speed Dating', text: 'Bi-encoders are like matching by profile photos alone (one vector per document) — fast but coarse. Cross-encoders are like full conversations (read query + doc together) — accurate but slow. ColBERT is speed dating: each person brings a set of "conversation cards" (per-token embeddings), and compatibility is scored by finding the best card match for each topic. It\'s the sweet spot between speed and accuracy.' },
    { emoji: '🧩', label: 'Detailed Fingerprints', text: 'Single-vector embeddings compress a whole document into one point — like identifying someone by height alone. ColBERT keeps per-token embeddings — like a full fingerprint with many comparison points. At search time, each query token finds its best match among the document tokens (MaxSim). This late interaction preserves fine-grained details while document embeddings can still be precomputed for fast retrieval.' },
    { emoji: '🎯', label: 'Targeted Matching', text: 'A single embedding asks "are these globally similar?" ColBERT asks "for each query concept, what\'s the best matching concept in the document?" If you search "climate change economic impact," it separately matches "climate change" and "economic impact" to different parts of the document. This token-level matching catches relevant documents that a single-vector approach might miss because the concepts appear in different locations.' },
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
