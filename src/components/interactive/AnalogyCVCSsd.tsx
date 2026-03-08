import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCSsd() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a security guard monitoring a wall of screens, where each screen shows the same scene at a different zoom level. The guard can spot a person on the wide-angle view, read a license plate on the close-up, and catch a package on the mid-range view -- all simultaneously without switching cameras.' },
    { emoji: '⚙️', label: 'How It Works', text: 'SSD extends VGG-16 (truncated before classification layers) with extra convolutional layers that progressively reduce spatial resolution:  Total: 8,732 default boxes per image (for SSD-300).' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, SSD (Liu et al., 2016) is a single-stage detector that attaches convolutional prediction heads to multiple feature maps from a backbone network (VGG-16) and additional convolutional layers. At each spatial location on each feature map, SSD predicts offsets and class scores for a set of default (anchor) boxes of varying aspect ratios.' },
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
