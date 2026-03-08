import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCOpticalFlow() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Watch a car drive past a window. Your eyes effortlessly track its motion -- every point on the car has an apparent velocity across your visual field. Optical flow is the computational equivalent: a 2D vector field (u, v) assigning a horizontal and vertical displacement to every pixel between two frames, capturing how the scene\'s projection moves.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The core constraint assumes a pixel\'s intensity does not change as it moves:  [equation]  Taking a first-order Taylor expansion and dividing by  t:  [equation]  where I_x, I_y are spatial gradients and I_t is the temporal derivative. This is one equation in two unknowns (the aperture problem), so additional constraints are needed.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, optical flow estimates the displacement field that maps pixel (x, y) at time t to (x + u, y + v) at time t +  t, under the assumption that pixel intensities are approximately conserved over short intervals.' },
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
