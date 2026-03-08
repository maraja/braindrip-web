import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCImageSuperResolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine zooming into a small, blurry photograph and having the computer fill in crisp details -- sharpening facial features, revealing text, reconstructing textures. Image super-resolution (SR) is the task of estimating a high-resolution (HR) image from a low-resolution (LR) input, typically at 2x, 4x, or 8x magnification.' },
    { emoji: '⚙️', label: 'How It Works', text: '(2014) introduced the first deep learning SR method. SRCNN is a shallow 3-layer CNN applied to a bicubic-upsampled input:  Patch extraction: 9 x 9 conv, 64 filters Nonlinear mapping: 1 x 1 conv, 32 filters Reconstruction: 5 x 5 conv, 1 filter (or 3 for RGB)  Trained with MSE loss: &#123;L&#125; = \\^2  Despite only ~57K parameters, SRCNN outperformed all.' },
    { emoji: '🔍', label: 'In Detail', text: 'The field has progressed from pixel-accuracy-focused methods that produce smooth but blurry outputs to perception-focused methods that synthesize realistic textures at the cost of exact pixel fidelity.' },
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
