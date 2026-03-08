import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE06KvCacheAndServingOptimization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are a librarian. Every visitor to the library opens several books and leaves them spread across a desk — they need to reference earlier pages as they read. With one visitor, this is fine. With a hundred visitors simultaneously, every desk is covered, the library runs out of space, and half the visitors are turned away.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Early serving systems (and many simple implementations today) pre-allocate a contiguous block of GPU memory for each request\'s KV cache, sized for the maximum possible sequence length.' },
    { emoji: '🔍', label: 'In Detail', text: 'When a Transformer generates text, each layer must attend to all previous tokens. Rather than recomputing the Key and Value projections for every past token at every generation step, models cache these tensors — the KV cache.' },
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
