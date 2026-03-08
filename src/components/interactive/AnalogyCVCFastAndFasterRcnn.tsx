import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCFastAndFasterRcnn() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'R-CNN is like sending a separate photographer to every suspicious area in a city. Fast R-CNN is like mounting one camera on a helicopter, taking a single panoramic photo, then cropping and zooming into each area of interest digitally -- same analysis quality, vastly less work.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Shared feature map: The entire image is passed through a CNN backbone (e.g., VGG-16) to produce a convolutional feature map. RoI Pooling: For each proposal (still from Selective Search), project its coordinates onto the feature map and divide the region into a fixed H x W grid (e.g., 7 x 7).' },
    { emoji: '🔍', label: 'In Detail', text: 'Fast R-CNN (Girshick, 2015) processes the entire image through a CNN once, extracts fixed-size features for each proposal via RoI pooling, and jointly trains classification and bounding box regression in a single network. Faster R-CNN (Ren et al.' },
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
