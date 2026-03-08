import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCDetectionMetrics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you built a model to detect pedestrians in street images. It finds 8 out of 10 actual pedestrians (recall = 80%), but 3 of its 11 detections are false alarms (precision = 73%). Now change the confidence threshold: at a stricter threshold, precision rises to 95% but recall drops to 40%.' },
    { emoji: '⚙️', label: 'How It Works', text: 'IoU measures the spatial overlap between a predicted box B_p and a ground-truth box B_&#123;gt&#125;:  [equation]  IoU ranges from 0 (no overlap) to 1 (perfect overlap). A detection is considered a True Positive if IoU   for some threshold .' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, detection metrics must handle two challenges absent in classification: (1) spatial matching -- a detection is correct only if it sufficiently overlaps the ground truth (measured by IoU), and (2) multiple predictions per image -- duplicates must be penalized.' },
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
