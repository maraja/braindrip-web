import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyChunkingStrategies() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🍕', label: 'Slicing Pizza', text: 'Chunking is how you slice documents for retrieval. Fixed-size chunking cuts equal slices regardless of content (simple but may split a sentence). Semantic chunking cuts at natural boundaries — like slicing between toppings. Recursive chunking tries paragraphs first, then sentences, then characters. The right strategy depends on your document type, just like pizza shape affects slice strategy.' },
    { emoji: '📦', label: 'Moving Boxes', text: 'When moving, you pack related items in the same box and label them. Chunking does the same with text — grouping related content into retrieval units. Too small (one sentence per box) loses context. Too large (whole chapter per box) dilutes relevance. Overlapping chunks are like packing a photo album in two boxes so you can find it from either one. The goal: each chunk should be a self-contained, meaningful unit.' },
    { emoji: '🧩', label: 'Jigsaw Pieces', text: 'Imagine cutting a painting into jigsaw pieces. Cut randomly and each piece is meaningless. Cut along natural boundaries (objects, sections) and each piece tells a small story. Chunking strategies aim for this: splitting documents so each chunk captures a coherent idea that makes sense on its own. Strategies like document-structure-aware chunking use headings, sections, and paragraphs as natural cut points.' },
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
