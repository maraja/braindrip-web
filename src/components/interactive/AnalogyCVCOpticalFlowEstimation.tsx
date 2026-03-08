import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCOpticalFlowEstimation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine holding a transparent sheet over a photograph and marking, for every single point, an arrow showing where that point moved in the next photograph. The collection of all these arrows -- one per pixel -- is the optical flow field. It answers the question: "Where did each pixel go?"' },
    { emoji: '⚙️', label: 'How It Works', text: 'Horn-Schunck (1981) minimized a global energy combining the brightness constancy and smoothness:  [equation]  TV-L1 (Zach et al., 2007) replaced the quadratic data term with an L_1 norm for robustness to outliers and the smoothness term with total variation. TV-L1 became the standard for pre-computing flow in action recognition (~0.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, optical flow is a 2D vector field (u, v) defined over the image plane, where (u(x, y), v(x, y)) represents the horizontal and vertical displacement of pixel (x, y) between frame I_t and frame I_&#123;t+1&#125;. The brightness constancy assumption underlying classical methods states:' },
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
