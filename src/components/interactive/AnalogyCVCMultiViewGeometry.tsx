import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCMultiViewGeometry() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two people standing at different positions photographing the same building. Each photograph is a 2D projection of the same 3D structure, but from a different viewpoint. Multi-view geometry is the mathematics that connects these views: given a point in one image, it constrains where that point can appear in the other image (a line, not an.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A pinhole camera projects a 3D world point X = (X, Y, Z, 1)^T (homogeneous) to a 2D image point x = (u, v, 1)^T via:  [equation]  where K is the 3 x 3 intrinsic matrix (focal lengths f_x, f_y, principal point c_x, c_y), R is the 3 x 3 rotation, t is the translation, and P is the 3 x 4 projection matrix. The scalar  is the projective depth.' },
    { emoji: '🔍', label: 'Epipolar Geometry', text: 'For two cameras observing the same scene, epipolar geometry constrains the relationship between corresponding points. If x and x\' are corresponding points in images 1 and 2:  [equation]  where F is the 3 x 3 fundamental matrix (rank 2, 7 degrees of freedom). This equation states that x\' must lie on the epipolar line \' = Fx in the second image.' },
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
