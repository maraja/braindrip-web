import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyHyDE() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎨', label: 'Police Sketch', text: 'A witness can\'t find the suspect in a database, but they can describe them to a sketch artist. The sketch (even if imperfect) is then used to search the database much more effectively. HyDE works the same way: instead of searching with the raw query, the LLM first generates a hypothetical answer (the "sketch"), and this answer\'s embedding is used for retrieval. Document-to-document similarity often works better than query-to-document similarity.' },
    { emoji: '🔑', label: 'Answer-Shaped Key', text: 'Searching a vector database with a short question is like using a small key — it might not match well. HyDE generates a hypothetical document that answers the question (the key), then uses its embedding to search. This "answer-shaped key" is much more similar to actual answer-containing documents in embedding space, dramatically improving retrieval quality — especially for vague or underspecified queries.' },
    { emoji: '🎣', label: 'Better Bait', text: 'A fisherman who uses the same type of bait as the fish they want to catch is more successful. HyDE creates "bait" that looks like the target: a hypothetical document similar to what you\'re looking for. Even though the hypothetical answer may be factually wrong (the LLM is hallucinating), its embedding will be close to real documents that contain the actual answer. You use fake content to find real content.' },
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
