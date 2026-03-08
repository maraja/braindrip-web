import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCMorphologicalOperations() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have a rubber stamp and an ink pad. If you press the stamp at every foreground pixel of a binary image, the ink it deposits expands the shape outward -- this is dilation.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The structuring element defines the "shape of the probe." Common choices:  Structuring element size matters: a larger element produces more aggressive erosion/dilation. The choice of shape (rectangle vs. cross) affects directional sensitivity; elliptical elements produce more isotropic results.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, morphological operations are defined using set theory. Given a binary image A (the set of foreground pixel coordinates) and a structuring element B (a small set of relative coordinates):' },
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
