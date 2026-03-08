import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVC3dReconstruction() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine walking around a sculpture and taking photographs from every angle. 3D reconstruction is the process of turning those flat images back into the full three-dimensional object -- a digital replica you can rotate, measure, 3D-print, or drop into a virtual scene.' },
    { emoji: '⚙️', label: 'How It Works', text: 'MVS estimates dense 3D geometry from multiple calibrated images (camera poses from SfM):  Depth map estimation: For each reference image, compute a depth map by matching against neighboring views. PatchMatch-based methods (COLMAP, OpenMVS) sample depth hypotheses and propagate good matches to neighbors.' },
    { emoji: '🔍', label: 'TSDF (Truncated Signed Distance Function) Fusion', text: 'TSDF fusion (Curless & Levoy, 1996) integrates depth maps from known poses into a voxel grid:  For each voxel at position v, the TSDF value is the (truncated) signed distance to the nearest surface. Positive values are in front of the surface, negative behind. The surface is extracted as the zero-crossing.' },
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
