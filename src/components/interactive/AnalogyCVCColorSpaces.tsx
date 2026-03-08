import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCColorSpaces() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of describing a location in a city. You could use street addresses, GPS coordinates, or directions relative to a landmark. Each system describes the same physical location, but some are more convenient for navigation, others for surveying, and others for casual conversation.' },
    { emoji: '⚙️', label: 'How It Works', text: 'RGB is an additive model matching the trichromatic nature of human vision and the physics of emissive displays. Each pixel stores three values, typically in [0, 255] for 8-bit:  [equation]  sRGB is the dominant standard for consumer imaging.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a color space is a specific organization of colors defined by a color model (the abstract mathematical structure, e.g., three additive primaries) plus a reference mapping to absolute colorimetry (e.g., the sRGB specification ties R, G, B primaries to exact CIE chromaticity coordinates and a D65 white point).' },
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
