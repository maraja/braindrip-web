import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPositionalEncoding() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '💺', label: 'Seat Numbers', text: 'Attention treats input like a bag of words — it has no built-in sense of order. Positional encoding is like assigning seat numbers in a theater. Without them, "dog bites man" and "man bites dog" look identical. By adding a unique positional signal to each token\'s embedding, the model knows that "dog" is in seat 1 and "man" is in seat 3, preserving word order.' },
    { emoji: '🕰', label: 'Timestamps', text: 'Imagine receiving all emails at once with no timestamps. You could not tell which came first. Positional encoding adds timestamps to tokens. The original transformer used sine/cosine waves at different frequencies — like a clock with many hands of different speeds — to give each position a unique, recognizable signature that the model can use to understand sequence order.' },
    { emoji: '📐', label: 'Ruler Markings', text: 'Positional encoding is like the numbered markings on a ruler. The ruler (sequence) needs marks to distinguish positions. Absolute encodings stamp a fixed mark at each position. Relative encodings measure the distance between any two marks. Without these marks, the transformer — which processes all tokens in parallel — would have no way to tell position 1 from position 100.' },
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
