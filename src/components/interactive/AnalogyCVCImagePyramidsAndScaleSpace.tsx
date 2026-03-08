import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCImagePyramidsAndScaleSpace() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine looking at a forest from different distances. From a satellite, you see the shape of the entire forest. From a hilltop, you distinguish individual tree clusters. Up close, you notice individual leaves and bark texture. The physical scene is the same, but the details you perceive depend entirely on your scale of observation.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A Gaussian pyramid is a discrete multi-resolution representation built by repeated smooth-then-subsample steps:  Start with the original image at level 0. Convolve with a Gaussian kernel (typically  = 1.0). Downsample by a factor of 2 (discard every other row and column).' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, the linear scale-space representation of an image I(x, y) is defined as the family of images obtained by convolution with Gaussians of increasing variance:' },
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
