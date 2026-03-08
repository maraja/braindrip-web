import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCNeuralRadianceFields() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you could freeze time and walk around a scene, viewing it from any angle, even positions where no camera was placed. NeRF makes this possible: given a sparse set of photographs with known camera poses (typically 20--100 images), it trains a neural network to memorize the entire scene\'s appearance and geometry.' },
    { emoji: '⚙️', label: 'How It Works', text: 'NeRF models a scene as a function F_:  [equation]  where x = (x, y, z) is the 3D position, d = (, ) is the viewing direction, c = (r, g, b) is the emitted color, and  is the volume density (opacity).' },
    { emoji: '🔍', label: 'Positional Encoding', text: 'MLPs are biased toward learning low-frequency functions. To capture fine details, NeRF applies a positional encoding  that lifts inputs to a higher-dimensional space:  [equation]  For position, L = 10 (mapping 3D to 60D). For direction, L = 4 (mapping 2D to 24D).' },
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
