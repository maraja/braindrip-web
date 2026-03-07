import { useState } from 'react';

const DETAILS = [
    { label: 'Memory', detail: 'A scene with 2M Gaussians requires ~500 MB of GPU memory (each Gaussian stores ~200 bytes: 3 position + 4 quaternion + 3 scale + 1 opacity + 48 SH = 59 floats).' },
    { label: 'PSNR on Mip-NeRF 360 scenes', detail: '3DGS achieves 27.2 dB average; Mip-NeRF 360 achieves 27.7 dB but renders 1000x slower.' },
    { label: 'Rendering resolution', detail: '1080p at 100--200 FPS, 4K at 30--60 FPS on an RTX 3090.' },
    { label: 'Initialization', detail: 'Gaussians are initialized from a sparse SfM point cloud (COLMAP). Random initialization works but converges slower and to lower quality.' },
    { label: 'Storage', detail: 'Uncompressed, a 2M-Gaussian scene is ~500 MB. Compressed (Compact3D, Lee et al., 2024) reduces this to 10--50 MB with minimal quality loss.' },
    { label: 'SH degree', detail: 'Training starts with SH degree 0 (constant color) and progressively increases to degree 3 every 1000 iterations.' },
];

export default function ExplorerCVC3dGaussianSplatting() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          3D Gaussian Splatting — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of 3d gaussian splatting.
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
