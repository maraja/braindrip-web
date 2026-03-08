import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCVggnet() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are building a wall. You could use a few large bricks, or many small bricks stacked carefully. The small-brick wall takes more layers but gives you finer control over the shape and is structurally more flexible.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The core insight of VGGNet is architectural simplicity through uniformity:  All convolutional layers use 3 x 3 kernels with stride 1 and "same" padding. All max pooling layers use 2 x 2 windows with stride 2. After each pooling layer, the number of channels doubles: 64  128  256  512  512.' },
    { emoji: '🔍', label: 'In Detail', text: 'VGGNet was developed by Karen Simonyan and Andrew Zisserman at the Visual Geometry Group (VGG) at the University of Oxford. It placed second in the ILSVRC-2014 classification task (behind GoogLeNet) but became far more widely used in practice due to its clean, uniform architecture that was easy to understand and modify.' },
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
