import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCSlam() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine being blindfolded and dropped into an unfamiliar building with only a camera. To navigate, you need to know two things simultaneously: where you are (localization) and what the building looks like (mapping). But you cannot build a map without knowing where you are, and you cannot localize without a map.' },
    { emoji: '⚙️', label: 'How It Works', text: 'At time t, the system state includes the sensor pose x_t = (R_t, t_t) and a map &#123;M&#125; (a set of 3D landmarks \\&#123;m_j\\&#125;). Given sensor observations z_&#123;1:t&#125; and control inputs u_&#123;1:t&#125;, SLAM estimates the joint posterior:  [equation]  This can be solved via filtering (EKF-SLAM, particle filters) or optimization (graph-based SLAM, bundle adjustment).' },
    { emoji: '🔍', label: 'Visual SLAM Pipeline', text: 'A typical visual SLAM system (monocular, stereo, or RGB-D) has four main components:  Frontend -- Tracking: Estimates the camera pose for each new frame. Extract features (ORB, SIFT, or learned features like SuperPoint). Match features to the existing map\'s 3D landmarks.' },
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
