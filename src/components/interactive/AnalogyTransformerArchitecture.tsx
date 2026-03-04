import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyTransformerArchitecture() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏭', label: 'Assembly Line', text: 'A transformer is like a factory assembly line where each station (layer) refines the product. Raw materials (tokens) enter, and at each station workers (attention + feed-forward) inspect every piece in relation to every other piece, gradually assembling meaning until a finished product (prediction) rolls off the end.' },
    { emoji: '🏛', label: 'Parliament', text: 'Imagine a parliament where every member (token) can hear and respond to every other member simultaneously. Each round of debate (layer) lets members update their positions based on what everyone else said. After many rounds, a consensus (output) emerges that accounts for all perspectives.' },
    { emoji: '📬', label: 'Post Office', text: 'Think of a giant post office where every letter (token) gets routed through sorting rooms (layers). In each room, every letter checks its address against all other letters to figure out which ones are related, then updates its routing label. By the final room, each letter knows exactly where it belongs.' },
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
