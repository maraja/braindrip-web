import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyCausalAttention() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📚', label: 'Reading Order', text: 'Causal attention is like reading a mystery novel where you can only use clues from pages you have already read. Each word can only attend to words that came before it, never peeking ahead. This mask ensures the model generates text left-to-right, just as you would write a sentence one word at a time without knowing the ending.' },
    { emoji: '🧱', label: 'Brick Wall', text: 'Building a brick wall from left to right: each new brick can only rest on bricks already placed. It cannot lean on bricks that have not been laid yet. The causal mask is like gravity — it enforces a strict order, ensuring each prediction depends only on the past, never the future.' },
    { emoji: '🎙', label: 'Live Interview', text: 'In a live radio interview, the host can only react to what has already been said. They cannot reference answers the guest has not given yet. Causal attention enforces this same rule: at each position, the model only sees the conversation so far, preventing information from leaking backward from the future.' },
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
