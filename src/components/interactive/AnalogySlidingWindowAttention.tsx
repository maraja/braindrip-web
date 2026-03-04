import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySlidingWindowAttention() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔍', label: 'Magnifying Glass', text: 'Instead of looking at the entire newspaper at once (full attention), you slide a magnifying glass across the page, reading a fixed-size window at a time. Each token only attends to its nearest neighbors. Over multiple layers, information propagates outward — layer 1 sees 512 tokens, layer 2 effectively sees 1024, and so on.' },
    { emoji: '🚂', label: 'Train Windows', text: 'Passengers on a train can only see the landscape through their window — a fixed-width view. As the train moves (layers stack), information from distant scenery gradually reaches you through other passengers relaying what they saw from their windows. Sliding window attention trades global view for massive speed and memory savings.' },
    { emoji: '💬', label: 'Group Chat', text: 'Imagine a group chat where each person can only read the last N messages. They cannot scroll up to the beginning. But because each message was written by someone who read the N messages before it, context still flows forward. Stacking layers expands effective context: local windows, global reach.' },
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
