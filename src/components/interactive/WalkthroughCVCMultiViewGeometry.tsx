import { useState } from 'react';

const STEPS = [
    { title: '1. Camera Model', desc: 'A pinhole camera projects a 3D world point X = (X, Y, Z, 1)^T (homogeneous) to a 2D image point x = (u, v, 1)^T via:  [equation]  where K is the 3 x 3 intrinsic matrix (focal lengths f_x, f_y, principal point c_x, c_y), R is the 3 x 3 rotation, t is the translation, and P is the 3 x 4 projection.' },
    { title: '2. Epipolar Geometry', desc: 'For two cameras observing the same scene, epipolar geometry constrains the relationship between corresponding points. If x and x\' are corresponding points in images 1 and 2:  [equation]  where F is the 3 x 3 fundamental matrix (rank 2, 7 degrees of freedom).' },
    { title: '3. The 8-Point Algorithm', desc: 'The fundamental matrix is estimated from point correspondences using the 8-point algorithm (Longuet-Higgins, 1981; Hartley\'s normalized version, 1997):  Normalize: Translate and scale points so their centroid is at the origin and average distance from origin is &#123;2&#125;.' },
    { title: '4. Triangulation', desc: 'Given correspondences and known cameras (P, P\'), triangulation recovers the 3D point. Each correspondence provides two equations per view.' },
    { title: '5. Structure from Motion (SfM)', desc: 'SfM recovers both 3D structure and camera poses from unordered images:  Extract and match features (SIFT, SuperPoint + SuperGlue). Estimate pairwise F or E matrices with RANSAC.' },
    { title: '6. Homography', desc: 'When all points lie on a plane (or the camera undergoes pure rotation), the mapping between views is a homography H (a 3 x 3 invertible matrix with 8 DoF):  [equation]  Estimated from 4+ correspondences via DLT. Used in panorama stitching, planar AR, and as a degeneracy check in SfM.' },
];

export default function WalkthroughCVCMultiViewGeometry() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive Walkthrough</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Multi-View Geometry \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how multi-view geometry works, one stage at a time.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= step ? '#C76B4A' : '#E5DFD3',
            border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#2C3E2D', margin: '0 0 0.4rem 0' }}>
          {current.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: 0 }}>
          {current.desc}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #E5DFD3',
          background: step === 0 ? '#F5F0E8' : '#FDFBF7', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontSize: '0.8rem', cursor: step === 0 ? 'default' : 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          &#8592; Previous
        </button>
        <span style={{ fontSize: '0.75rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>
          {step + 1} / {STEPS.length}
        </span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1} style={{
          padding: '0.4rem 1rem', borderRadius: '6px',
          border: `1px solid ${step === STEPS.length - 1 ? '#E5DFD3' : '#C76B4A'}`,
          background: step === STEPS.length - 1 ? '#F5F0E8' : 'rgba(199, 107, 74, 0.08)',
          color: step === STEPS.length - 1 ? '#B0A898' : '#C76B4A',
          fontSize: '0.8rem', fontWeight: 500, cursor: step === STEPS.length - 1 ? 'default' : 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          Next &#8594;
        </button>
      </div>
    </div>
  );
}
