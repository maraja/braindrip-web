import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCEdgeDetection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine tracing the outline of objects in a photograph with a pen -- you instinctively follow the places where one surface ends and another begins. Edge detection automates exactly this: it finds pixels where intensity changes abruptly, producing a binary or weighted map of boundary locations.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The Sobel operator convolves the image with two 3 x 3 kernels to estimate horizontal and vertical gradients:  [equation]  The gradient magnitude and direction are then:  [equation]  Sobel is fast (six additions and two multiplications per pixel per kernel) but produces thick edges and is sensitive to noise.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, an edge is a point where the first derivative of image intensity reaches a local extremum, or equivalently, where the second derivative crosses zero. In practice, we approximate these derivatives with discrete convolution kernels applied to the pixel grid.' },
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
