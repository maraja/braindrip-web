import { useState } from 'react';

const DETAILS = [
    { label: 'KITTI benchmark (car, moderate)', detail: 'PointPillars 77.3 AP, SECOND 83.3 AP, CenterPoint ~84 AP (3D AP @ IoU 0.7).' },
    { label: 'nuScenes test set', detail: 'CenterPoint 67.3 NDS, BEVFusion 72.9 NDS, TransFusion 71.7 NDS.' },
    { label: 'Latency', detail: 'PointPillars runs at 62 Hz, CenterPoint at ~11 Hz, BEVFormer at ~4 Hz (on an A100).' },
    { label: 'Point cloud range', detail: 'KITTI covers [0, 70.4] x [-40, 40] x [-3, 1] meters; nuScenes uses [-54, 54] x [-54, 54] x [-5, 3] meters.' },
    { label: 'Typical voxel sizes', detail: '(0.05, 0.05, 0.1) m for high-resolution, (0.16, 0.16, 4.0) m for PointPillars pillars.' },
    { label: 'Anchor sizes for cars', detail: '(3.9, 1.6, 1.56) m (length, width, height) on KITTI, matching average sedan dimensions.' },
];

export default function ExplorerCVC3dObjectDetection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          3D Object Detection \u2014 Key Details Explorer
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
