import { useState } from 'react';

const DETAILS = [
    { label: 'COLMAP MVS', detail: 'Produces point clouds with ~1 mm accuracy for small objects; ~1 cm for rooms. Processing 100 images at 12 MP takes 1--4 hours on a modern GPU.' },
    { label: 'TSDF resolution', detail: 'KinectFusion uses 512^3 voxels for a 3 x 3 x 3 m volume (5.9 mm voxel size). Voxel hashing scales to 50+ m rooms.' },
    { label: 'DeepSDF', detail: '256-dim shape code, 8-layer MLP with 512 hidden units. Reconstructs shapes at sub-millimeter accuracy on ShapeNet.' },
    { label: 'Occupancy Networks', detail: 'IoU of 0.571 on ShapeNet (single-image reconstruction), compared to 0.501 for Pixel2Mesh.' },
    { label: 'NeuS', detail: 'Achieves mean Chamfer distance of 0.83 mm on DTU dataset (15 scenes), outperforming NeRF-based geometry extraction.' },
    { label: 'Marching Cubes', detail: 'O(N^3) time and space for grid resolution N. Output mesh size: a 256^3 grid typically produces 200K--2M triangles.' },
];

export default function ExplorerCVC3dReconstruction() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          3D Reconstruction \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
