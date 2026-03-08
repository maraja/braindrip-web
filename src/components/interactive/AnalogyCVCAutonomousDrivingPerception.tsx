import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCAutonomousDrivingPerception() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine driving through a busy intersection: you simultaneously track pedestrians, predict a cyclist\'s trajectory, read traffic lights, and judge the distance to the car ahead. Autonomous driving perception is the system that replicates this -- transforming raw sensor data (cameras, LiDAR, radar) into a structured understanding of the 3D scene:.' },
    { emoji: '⚙️', label: 'How It Works', text: 'No single sensor is sufficient. Cameras provide rich semantic information but lack direct depth. LiDAR provides precise 3D geometry but is sparse and expensive.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, perception is the module that takes multi-modal sensor inputs and outputs 3D bounding boxes (with velocity), semantic segmentation of the road scene, lane markings, traffic sign classifications, and occupancy grids. It is the foundation on which prediction, planning, and control operate.' },
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
