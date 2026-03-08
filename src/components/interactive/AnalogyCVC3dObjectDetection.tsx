import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVC3dObjectDetection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'In 2D detection, you draw a rectangle around a car in an image. In 3D detection, you place a box around that car in the real world -- specifying not just where it appears in the image, but its actual position in 3D space, its physical dimensions, and its heading angle.' },
    { emoji: '⚙️', label: 'How It Works', text: 'VoxelNet (Zhou & Tuzel, 2018): Divides the 3D space into voxels, applies a PointNet-like feature extractor within each voxel, then processes the resulting 3D feature grid with sparse 3D convolutions and a 2D detection head. Voxel size is typically (0.1, 0.1, 0.2) m for the KITTI benchmark. SECOND (Yan et al.' },
    { emoji: '🔍', label: 'Camera-Based Methods', text: 'Camera-only 3D detection has gained traction for its lower sensor cost. BEVDet (Huang et al., 2022): Lifts multi-camera 2D features into a 3D voxel space using predicted depth distributions, then collapses to BEV for detection. BEVDet4D adds temporal fusion.' },
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
