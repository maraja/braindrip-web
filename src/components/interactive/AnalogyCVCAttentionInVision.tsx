import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCAttentionInVision() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a security guard monitoring a wall of surveillance screens. With a few screens (say 4), the guard can easily compare every pair of feeds to spot coordinated activity. With 100 screens, comparing all pairs becomes overwhelming -- there are 4,950 pairs to track. With 1,000 screens, it\'s 499,500 pairs.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Unlike text, image tokens have spatial structure in two dimensions. Several encoding strategies exist:  Learnable 1D embeddings (ViT): Flatten patches into a 1D sequence and learn a separate embedding for each position. Surprisingly, this works well -- the model learns 2D structure from data.' },
    { emoji: '🔍', label: 'In Detail', text: 'A 224 x 224 image with 16 x 16 patches produces 196 tokens -- manageable. But a 1024 x 1024 medical image with the same patch size yields 4,096 tokens, and attention cost scales as O(N^2). At 2048 x 2048 (common in pathology), the 16,384 tokens make standard attention infeasible.' },
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
