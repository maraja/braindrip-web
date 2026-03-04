import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRoPE() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔄', label: 'Spinning Hands', text: 'RoPE rotates each token\'s query and key vectors by an angle proportional to their position — like clock hands spinning at different speeds for different dimensions. When two tokens compute attention (dot product), the rotation angles cancel in a way that depends only on the relative distance between them, not their absolute positions. This naturally encodes relative position.' },
    { emoji: '💃', label: 'Dance Partners', text: 'Imagine dancers (tokens) arranged in a line, each spinning at a rate proportional to their position. When two dancers face each other (compute attention), how aligned they are depends on the difference in their spins — i.e., their relative distance. RoPE embeds position through rotation, so the model effortlessly learns "3 tokens apart" regardless of where in the sequence those tokens sit.' },
    { emoji: '📻', label: 'Radio Tuning', text: 'Each pair of embedding dimensions is like a radio dial tuned to a different frequency. RoPE rotates each dial by an amount proportional to the token position: high-frequency dials rotate fast (capturing local position), low-frequency dials rotate slowly (capturing global position). The attention score between two tokens naturally depends on their positional difference across all frequencies.' },
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
