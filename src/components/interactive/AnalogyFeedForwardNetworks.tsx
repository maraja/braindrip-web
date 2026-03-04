import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyFeedForwardNetworks() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧠', label: 'Memory Bank', text: 'If attention is "thinking about relationships," the feed-forward network (FFN) is "recalling facts." It acts like a vast memory bank where factual knowledge is stored in the weights. When a token passes through, the FFN looks up relevant knowledge — "Paris is the capital of France" — and enriches the representation with stored information.' },
    { emoji: '🔧', label: 'Workshop', text: 'After a team meeting (attention), each person goes back to their private workshop (FFN) to process what they heard. The workshop has specialized tools (learned weights) for transforming raw ideas into refined outputs. Each token is processed independently — the FFN applies the same transformation to every position, one at a time.' },
    { emoji: '🍳', label: 'Kitchen Processing', text: 'Attention gathers all the ingredients from the pantry. The FFN is the actual cooking: it takes each gathered ingredient (enriched representation), expands it into a larger mixing bowl (hidden dimension 4x wider), applies heat (nonlinear activation), then reduces it back to serving size. This expand-activate-compress pattern is where raw material becomes a finished dish.' },
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
