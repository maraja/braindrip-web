import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCHog() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how a caricature artist captures a person\'s likeness -- they emphasize the dominant outlines and proportions, ignoring color and fine texture. HOG does something analogous: it discards raw pixel values and instead encodes the distribution of gradient directions within small spatial regions.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Apply simple centered difference filters [-1, 0, 1] horizontally and vertically to compute gradient magnitude M and orientation  at every pixel:  [equation]  Use unsigned gradients (0--180^) for most applications, since the sign of the contrast is less informative for shape.' },
    { emoji: '🔍', label: 'In Detail', text: 'Dalal and Triggs (2005) introduced HOG for pedestrian detection at CVPR 2005, achieving results that immediately outperformed all prior methods and launched a decade of sliding-window object detection research.' },
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
