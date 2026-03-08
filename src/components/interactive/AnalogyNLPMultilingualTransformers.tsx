import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPMultilingualTransformers() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a translator who learned languages not by studying grammar textbooks but by reading vast libraries in 100 different languages simultaneously. Over time, this translator develops an internal "language of thought" -- abstract representations of meaning that transcend any single language.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The original multilingual BERT was trained on Wikipedia text from the 104 languages with the largest Wikipedias. Key design choices:  Shared WordPiece vocabulary: A single 110K-token vocabulary covering all 104 languages. Tokens are allocated roughly proportional to Wikipedia size, with exponential smoothing (alpha = 0.' },
    { emoji: '🔍', label: 'In Detail', text: 'A multilingual transformer is a transformer-based model (encoder, decoder, or encoder-decoder) pre-trained on text from many languages using a shared vocabulary and shared parameters.' },
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
