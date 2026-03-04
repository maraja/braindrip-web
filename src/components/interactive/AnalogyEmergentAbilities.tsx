import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyEmergentAbilities() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧊', label: 'Phase Transition', text: 'Water at 0.1 degrees C is still liquid. At -0.1 degrees, it is suddenly ice — a phase transition. Emergent abilities appear similarly: a 1B parameter model cannot do multi-step arithmetic at all, then a 10B model suddenly can. The ability seems to "emerge" sharply at a critical scale. Whether this is true emergence or a measurement artifact (threshold metrics) is actively debated.' },
    { emoji: '🧩', label: 'Critical Mass', text: 'Individual puzzle pieces look meaningless. But at some critical mass of assembled pieces, the picture suddenly becomes recognizable. Emergent abilities may work similarly: the model accumulates sub-skills (pattern matching, factual recall, syntactic parsing) that individually are not enough, but when they reach critical mass, they combine into a qualitatively new capability like chain-of-thought reasoning.' },
    { emoji: '🏙', label: 'City Formation', text: 'A few houses are just a settlement. Add more and roads appear. Add more and suddenly you have specialized districts, a metro system, and cultural life. Cities "emerge" from density. Emergent abilities in LLMs may arise similarly: sufficient parameter density enables internal circuits to form that support complex behaviors no individual parameter was designed to produce.' },
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
