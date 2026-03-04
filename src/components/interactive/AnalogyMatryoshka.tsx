import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMatryoshka() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🪆', label: 'Nesting Dolls', text: 'Matryoshka dolls contain progressively smaller dolls inside. Matryoshka Representation Learning (MRL) creates embeddings that work at any dimension: the first 64 dimensions are a useful (small) embedding, the first 256 are better, and the full 1024 are best. You can "open" the embedding to use as many dimensions as you need. This lets you trade precision for speed/storage without retraining different models.' },
    { emoji: '📷', label: 'Progressive JPEG', text: 'A progressive JPEG loads a blurry version first, then sharpens progressively. MRL embeddings work the same way: the first few dimensions give a rough representation, and more dimensions add fidelity. You can use 64-dimensional embeddings for fast initial candidate retrieval, then switch to the full 768 dimensions for precise reranking — all from the same model, same embedding, just different prefixes.' },
    { emoji: '🔍', label: 'Zoom Lens', text: 'A zoom lens can be set to wide-angle (captures the big picture, less detail) or telephoto (captures fine detail, narrower view). MRL embeddings are like a zoom lens for semantic similarity: fewer dimensions give you the big picture (broad topic matching), more dimensions give you fine-grained distinctions. You pick the zoom level based on your accuracy needs and compute budget — one model serves all use cases.' },
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
