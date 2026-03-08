import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCCameraCalibrationAndGeometry() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'A camera is a measurement device, but out of the box you do not know its ruler. You see that a building appears 200 pixels tall in the image, but how tall is it in meters? Camera calibration answers this by recovering the mathematical relationship between 3D world coordinates and 2D pixel coordinates.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The idealized pinhole model projects a 3D point P_w = (X, Y, Z)^T in world coordinates to a 2D pixel (u, v) through:  [equation]  where s is a scale factor and:  Intrinsic matrix K:  [equation]  f_x, f_y: focal lengths in pixel units (typically 500--2000 for standard lenses) (c_x, c_y): principal point, ideally the image center : skew coefficient,.' },
    { emoji: '🔍', label: 'In Detail', text: 'The calibration process determines two sets of parameters: intrinsic parameters (properties of the camera itself, like focal length and lens distortion) and extrinsic parameters (the camera\'s position and orientation in the world).' },
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
