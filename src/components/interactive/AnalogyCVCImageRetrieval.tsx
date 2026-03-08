import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCImageRetrieval() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine pointing your phone at a pair of shoes and instantly finding where to buy them online from a catalog of 100 million products. This is image retrieval: given a query image, find the most visually similar images in a large database. Unlike classification (which assigns a label), retrieval ranks all database images by similarity to the query.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A CNN or Vision Transformer backbone (typically ResNet-50, EfficientNet, or ViT-B/16) extracts a feature map, which is pooled into a single vector. Common pooling strategies:  Global Average Pooling (GAP): Simple mean over spatial dimensions. Standard baseline.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, image retrieval maps images to compact embedding vectors in a learned metric space, then uses approximate nearest neighbor (ANN) search to efficiently find the closest database embeddings to the query.' },
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
