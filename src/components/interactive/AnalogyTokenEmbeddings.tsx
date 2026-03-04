import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyTokenEmbeddings() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🗺', label: 'Meaning Map', text: 'Token embeddings place each word on a vast map of meaning. "King" and "queen" are neighbors, far from "bicycle." Each token ID is converted into a dense vector (like GPS coordinates in meaning-space). The embedding table is a giant lookup: token 4523 maps to a vector of 4096 numbers that encode everything the model has learned about that token\'s meaning, usage, and associations.' },
    { emoji: '🎵', label: 'Musical Notes', text: 'Each token becomes a unique chord — a combination of many frequencies (dimensions). "Happy" might be high on the positivity dimension, medium on the intensity dimension. The embedding converts a flat integer ID into a rich, multi-dimensional signal the model can process. Similar words produce similar chords, and the model learns these representations during training.' },
    { emoji: '🧬', label: 'DNA Encoding', text: 'DNA encodes organisms using just 4 base letters, but the combinations create infinite diversity. Token embeddings similarly encode discrete symbols as continuous vectors. The integer ID "42" is meaningless, but its embedding [0.23, -0.87, 0.14, ...] captures semantic DNA — hundreds of dimensions encoding syntax, meaning, sentiment, and domain. This continuous representation is what the transformer actually processes.' },
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
