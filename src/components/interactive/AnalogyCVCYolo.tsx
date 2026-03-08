import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCYolo() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine glancing at a photograph and instantly knowing where every person, car, and dog is located -- no need to methodically scan each region. That is YOLO\'s approach: instead of examining thousands of candidate regions, it looks at the whole image once, divides it into a grid, and simultaneously predicts what objects exist and where they are in.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The image is divided into a 7 x 7 grid. Each cell predicts: B = 2 bounding boxes, each with 5 values: (x, y, w, h, confidence) C = 20 class probabilities (PASCAL VOC)  Total output tensor: 7 x 7 x (2 x 5 + 20) = 7 x 7 x 30  Confidence is defined as: [equation]  The loss function combines localization, confidence, and classification.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, YOLO (Redmon et al., 2016) divides the input image into an S x S grid. Each grid cell predicts B bounding boxes (each with coordinates and a confidence score) and C class probabilities. Detection is accomplished in a single forward pass, making YOLO extremely fast.' },
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
