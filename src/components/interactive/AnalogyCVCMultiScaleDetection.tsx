import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCMultiScaleDetection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a wildlife photographer with a single lens. A sparrow one meter away and an eagle three hundred meters away need very different zoom settings. If the photographer can only use one zoom level, they will capture one bird well and miss the other entirely.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest approach: resize the input image to multiple scales and run the detector independently at each scale. Pros: Each scale gets the full representational power of the network. Cons: Computation scales linearly (or worse) with the number of pyramid levels.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, multi-scale detection refers to methods that enable object detectors to locate and classify objects across a wide range of spatial sizes. In COCO, objects range from 10 x 10 pixels (small) to 500 x 500 pixels (large) -- a 50:1 ratio in linear dimension and 2,500:1 in area.' },
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
