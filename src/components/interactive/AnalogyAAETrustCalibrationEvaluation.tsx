import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAETrustCalibrationEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine consulting two weather forecasters. One says "it will definitely rain tomorrow" regardless of actual conditions -- sometimes right, sometimes wrong, but always certain. The other says "there is a 70% chance of rain" and is correct about 70% of the time when making such predictions.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Calibration measures the correspondence between expressed confidence and actual accuracy. The core methodology borrows from probability calibration in forecasting and extends it to agent behavior. Confidence extraction is the first challenge.' },
    { emoji: '🔍', label: 'In Detail', text: 'Trust calibration evaluation assesses whether agents function like the second forecaster. When an agent says "I\'m confident this code is correct," is it actually right more often than when it says "I think this might work but I\'m not sure"? When it expresses uncertainty, does that uncertainty reflect genuine knowledge limitations?' },
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
