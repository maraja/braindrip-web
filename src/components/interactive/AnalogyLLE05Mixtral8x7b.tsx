import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05Mixtral8x7b() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a hospital where, instead of one general practitioner seeing every patient, there are eight specialists sitting behind a reception desk. A triage nurse looks at each patient\'s symptoms and routes them to the two most relevant specialists, who collaborate on the diagnosis. The hospital employs eight doctors, but each patient only sees two.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Mixtral replaces each standard feedforward (FFN) layer in the Transformer with a set of eight expert FFN networks and a gating router. The attention layers are shared across all experts — every token passes through the same self-attention mechanism. Only the feedforward layers are "expert-ified.' },
    { emoji: '🔍', label: 'In Detail', text: 'That is the Mixture of Experts (MoE) approach, and Mixtral 8x7B made it work at open-source scale.' },
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
