import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySparseAttention() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '✈️', label: 'Flight Routes', text: 'Full attention is like having direct flights between every pair of cities — expensive and redundant. Sparse attention is a hub-and-spoke airline network: most cities connect through hubs, not directly. By attending only to strategically chosen positions (local neighbors + periodic global tokens), you cover the whole "map" with far fewer connections.' },
    { emoji: '📊', label: 'Sampling Survey', text: 'Surveying every person in a city is exhaustive (full attention). Sparse attention is like a well-designed statistical sample: you talk to local neighbors plus a random or structured subset of the population. You get nearly the same quality of insight at a fraction of the cost — O(n√n) instead of O(n²).' },
    { emoji: '🕸', label: 'Social Network', text: 'You do not personally know everyone on Earth, but through a few key connections (hubs), you can reach anyone within six degrees. Sparse attention patterns mimic this small-world network: local connections for nearby context, plus long-range "shortcut" connections that let information flow globally without every token talking to every other.' },
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
