import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCSegmentationMetrics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine coloring every pixel in a photo -- sky blue, road gray, car red, person green. Now compare your coloring to the answer key. Segmentation metrics quantify how well your pixel-level coloring matches the ground truth.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest metric: fraction of correctly classified pixels. [equation]  where n_&#123;ii&#125; is the number of pixels of class i correctly predicted, and t_i is the total number of pixels of class i. Limitation: Dominated by large classes.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, segmentation metrics operate on prediction masks and ground-truth masks. The choice of metric depends on the segmentation task: semantic (per-pixel class labels), instance (separate mask per object), or panoptic (unified stuff + things).' },
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
