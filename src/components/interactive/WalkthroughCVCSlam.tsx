import { useState } from 'react';

const STEPS = [
    { title: '1. The SLAM Problem Formulation', desc: 'At time t, the system state includes the sensor pose x_t = (R_t, t_t) and a map &#123;M&#125; (a set of 3D landmarks \\&#123;m_j\\&#125;). Given sensor observations z_&#123;1:t&#125; and control inputs u_&#123;1:t&#125;, SLAM estimates the joint posterior:  [equation]  This can be solved via filtering (EKF-SLAM, particle filters) or.' },
    { title: '2. Visual SLAM Pipeline', desc: 'A typical visual SLAM system (monocular, stereo, or RGB-D) has four main components:  Frontend -- Tracking: Estimates the camera pose for each new frame. Extract features (ORB, SIFT, or learned features like SuperPoint).' },
    { title: '3. ORB-SLAM (Mur-Artal et al., 2015, 2017)', desc: 'ORB-SLAM is the most widely cited visual SLAM system:  Uses ORB features (fast binary descriptor, rotation invariant). Three parallel threads: tracking, local mapping, loop closing.' },
    { title: '4. Visual-Inertial SLAM', desc: 'Fusing camera data with an IMU (Inertial Measurement Unit) provides: Metric scale recovery (monocular SLAM is scale-ambiguous; IMU gives absolute scale). Robust tracking during fast motion and visual degradation.' },
    { title: '5. LiDAR SLAM', desc: 'LiDAR-based SLAM (LOAM, LeGO-LOAM, LIO-SAM) uses point cloud registration instead of feature matching:  Extract edge and planar features from LiDAR scans. Register consecutive scans using point-to-edge and point-to-plane ICP variants.' },
    { title: '6. Dense and Neural SLAM', desc: 'Recent systems build dense maps rather than sparse landmark maps:  DTAM (2011): Dense tracking and mapping using photometric alignment on every pixel. KinectFusion (2011): Real-time dense reconstruction using TSDF fusion from depth cameras.' },
];

export default function WalkthroughCVCSlam() {
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
          SLAM (Simultaneous Localization and Mapping) \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how slam (simultaneous localization and mapping) works, one stage at a time.
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
