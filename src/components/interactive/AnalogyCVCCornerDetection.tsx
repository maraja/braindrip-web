import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCCornerDetection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of standing at a street intersection versus walking along a straight road. On the road, sliding forward or backward looks similar; at the intersection, any direction of movement changes the scene.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For a grayscale image I, compute the gradient components I_x and I_y (e.g., via Sobel). At each pixel, form the 2 x 2 structure tensor (also called the second-moment matrix):  [equation]  where W is a local window and w(x,y) is typically a Gaussian weighting function with  = 1--2 pixels.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, a corner is a location where the local autocorrelation function of the image has high curvature in all directions. This is captured by analyzing the eigenvalues of a structure tensor computed from image gradients.' },
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
