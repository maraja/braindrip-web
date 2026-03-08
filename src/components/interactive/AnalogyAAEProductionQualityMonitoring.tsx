import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEProductionQualityMonitoring() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a factory quality control line. You cannot inspect every single product -- that would be as expensive as manufacturing itself. Instead, inspectors sample items at strategic intervals, run automated checks, and trigger alarms when defect rates exceed acceptable thresholds.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Not all interactions need evaluation. The art of monitoring is selecting which interactions to score. Random sampling selects a fixed percentage of all interactions uniformly at random.' },
    { emoji: '🔍', label: 'In Detail', text: 'Unlike offline evaluation, which runs against fixed datasets before deployment, production quality monitoring operates on live traffic after the agent is serving users. It answers the question "how is our agent performing right now?" rather than "how will it perform?' },
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
