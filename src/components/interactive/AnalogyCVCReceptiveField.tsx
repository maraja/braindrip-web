import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCReceptiveField() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine standing at the top of a pyramid of observers. The person at the very bottom can only see a small patch of the ground. The person above them collects reports from several bottom-level observers, so they effectively "see" a wider area.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For a sequential architecture, track two quantities layer by layer -- the receptive field size r and the cumulative stride (called the jump j):  Example: Three stacked 3 x 3 conv layers with stride 1: Layer 1: j=1, r = 1 + 2 x 1 = 3 Layer 2: j=1, r = 3 + 2 x 1 = 5 Layer 3: j=1, r = 5 + 2 x 1 = 7  Three 3 x 3 layers produce a 7 x 7 receptive field.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, the theoretical receptive field (TRF) of a neuron at layer L is the set of input pixels that can affect that neuron\'s value. For a network with L layers, each having kernel size k_l and stride s_l, the receptive field size r_L is computed recursively:' },
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
