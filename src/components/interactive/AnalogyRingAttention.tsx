import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRingAttention() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '💍', label: 'Ring Ceremony', text: 'Guests sit in a circle, each holding a segment of a long scroll. Instead of everyone reading the entire scroll (impossible), each guest reads their segment while passing their scroll piece clockwise. After N passes around the ring, every guest has read every segment. Ring attention arranges GPUs in a ring, each holding a chunk of the sequence, passing KV blocks around while computing attention locally.' },
    { emoji: '🎠', label: 'Carousel', text: 'A carousel rotates horses past each viewing spot. Ring attention works like a carousel of KV blocks rotating past each GPU. Each GPU holds its own query chunk and computes attention against whatever KV block is currently in front of it. After one full rotation, every GPU has attended to every KV block. The key insight: communication (passing KV blocks) overlaps with computation (attention), hiding latency.' },
    { emoji: '🍽', label: 'Lazy Susan', text: 'At a large round table, dishes rotate on a Lazy Susan. Each diner takes what they need as dishes pass by. Ring attention is a Lazy Susan for KV blocks: each GPU processes its local queries against the KV block currently in front of it, then rotates the KV blocks one step. This enables context windows of millions of tokens by distributing the sequence across many GPUs.' },
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
