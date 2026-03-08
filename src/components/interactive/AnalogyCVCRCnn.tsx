import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCRCnn() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of R-CNN like a museum security system that first identifies ~2,000 suspicious zones in a surveillance frame using motion detection (region proposals), then sends a high-resolution camera feed of each zone to a trained analyst (CNN) who decides what is in that zone.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Selective Search produces ~2,000 candidate bounding boxes per image. Each box is warped (with 16 pixels of context padding) to 227 x 227 pixels regardless of aspect ratio.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, R-CNN (Girshick et al., 2014) is a three-stage pipeline: (1) generate ~2,000 class-agnostic region proposals via Selective Search, (2) extract a fixed-size CNN feature vector from each proposal by warping it to 227 x 227 and running it through AlexNet or VGG-16, and (3) classify each feature vector with per-class linear SVMs and.' },
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
