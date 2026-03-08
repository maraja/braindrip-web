import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPSemanticSimilarity() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of semantic similarity as measuring the "distance" between ideas. The words "car" and "automobile" are near-synonyms and extremely similar. "Car" and "bicycle" are less similar but still related (both are vehicles). "Car" and "democracy" are semantically distant.' },
    { emoji: '⚙️', label: 'How It Works', text: 'WordNet Path Similarity  WordNet organizes words into a taxonomy where hypernymy ("is-a") links connect specific concepts to general ones. Path similarity measures semantic closeness as the inverse of the shortest path between two synsets in this taxonomy:  For example, "dog" and "cat" are both hyponyms of "carnivore" (path length ~3), yielding.' },
    { emoji: '🔍', label: 'In Detail', text: 'Unlike textual entailment, which asks a directional yes/no question ("does A imply B?"), semantic similarity is symmetric and graded. "A dog is playing in the park" and "A puppy is running in a garden" might receive a similarity score of 4.2 out of 5 -- they convey nearly the same idea without one logically entailing the other.' },
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
