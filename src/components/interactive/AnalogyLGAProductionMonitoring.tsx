import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAProductionMonitoring() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of production monitoring as the vital signs monitor in a hospital. A patient might look fine from the outside, but the monitor tracks heart rate, blood pressure, and oxygen levels continuously, sounding an alarm the moment something drifts out of range.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LangSmith automatically aggregates production traces into dashboard views:' },
    { emoji: '🔍', label: 'In Detail', text: 'Development and evaluation give you confidence that an agent works well on test cases. Production monitoring tells you whether it continues to work well on real traffic. Models degrade silently when providers change behavior, query patterns shift, or data sources go stale. Without monitoring, these problems accumulate undetected.' },
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
