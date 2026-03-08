import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCPointCloudProcessing() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine standing in a room with a laser pointer that fires millions of beams in every direction, each beam recording where it hits a surface. The collection of all those hit points -- each with an (x, y, z) coordinate and possibly color or intensity -- forms a point cloud.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LiDAR (Light Detection and Ranging): Emits laser pulses and measures time-of-flight. Automotive LiDAR (e.g., Velodyne VLP-64) produces ~2.2 million points per second with range up to 120 m. Accuracy is typically 1--3 cm.' },
    { emoji: '🔍', label: 'Core Data Structures', text: 'Voxel grids partition 3D space into regular cubes of side length s. A point (x, y, z) maps to voxel index:  [equation]  Voxel grids enable O(1) neighbor lookups and are used in VoxelNet, SECOND, and 3D convolution methods. The trade-off: memory scales as O(N^3) for resolution N, so sparse voxel representations (e.g.' },
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
