import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCLandmarkDatasets() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'A dataset in computer vision is more than a collection of images -- it is an implicit definition of what the field considers important. When ImageNet chose 1,000 object categories, it defined what "general visual recognition" meant for a decade. When COCO included segmentation masks, it pushed the field toward pixel-level understanding.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Scale: 1,281,167 training images, 50,000 validation images, 1,000 object categories drawn from WordNet. Task: Image classification (single-label, one dominant object per image). Annotation: One class label per image; bounding boxes also available for a subset.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, each landmark dataset specifies a collection of images, annotation types (class labels, bounding boxes, segmentation masks, keypoints), evaluation protocols, and train/val/test splits. The choice of dataset determines which problems get studied, which metrics get optimized, and ultimately which architectures become dominant.' },
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
