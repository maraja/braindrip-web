import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCAnchorFreeDetection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Anchor-based detectors like Faster R-CNN and SSD tile thousands of predefined boxes across the image and ask, "Is there an object in this box? If so, how should I adjust the box?" Anchor-free detectors take a fundamentally different approach.' },
    { emoji: '⚙️', label: 'How It Works', text: 'FCOS treats every location on the feature map as a potential detection point. Per-pixel prediction: For a location (x, y) on feature map level P_l, if it falls inside a ground-truth box, FCOS predicts: Classification: C-dimensional vector of class scores.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, anchor-free detectors predict object locations without relying on a predefined set of anchor boxes. The two main families are per-pixel prediction (e.g., FCOS, which classifies every feature map location and regresses distances to box edges) and keypoint-based detection (e.g.' },
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
