import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMixtureOfDepths() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🛣', label: 'Express Lane', text: 'On a highway, some cars take the express lane (skip processing) while others take the local route (full layer computation). Mixture of Depths lets easy tokens — like "the" or "and" — take the express lane through certain layers, while complex tokens get full processing. This dynamically allocates compute where it matters most.' },
    { emoji: '📝', label: 'Teacher Grading', text: 'A teacher grading essays does not spend equal time on each. Simple, correct answers get a quick checkmark (skip the layer), while complex essays need careful reading (full computation). MoD applies this wisdom: a learned router at each layer decides which tokens need deep processing and which can pass through with just the residual connection.' },
    { emoji: '🏭', label: 'Quality Control', text: 'In a factory, products pass through inspection stations. A quick visual check (router) determines whether an item needs detailed inspection (full layer) or can fast-track ahead (skip). Mixture of Depths applies a compute budget: only the top-k most "interesting" tokens at each layer get processed, making the model faster without losing quality where it counts.' },
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
