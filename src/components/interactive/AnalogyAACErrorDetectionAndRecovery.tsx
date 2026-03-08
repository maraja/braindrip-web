import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACErrorDetectionAndRecovery() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a pilot flying a commercial aircraft. They do not assume every system will work perfectly. They are trained to detect anomalies (an unusual engine reading, unexpected weather ahead, a failed instrument), classify the severity (minor annoyance vs critical emergency), and apply the appropriate recovery procedure (switch to backup system,.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Explicit error signals: Tool calls return error codes or exception messages. API responses include HTTP status codes (4xx, 5xx). File operations raise exceptions (file not found, permission denied).' },
    { emoji: '🔍', label: 'In Detail', text: 'For AI agents, error detection and recovery is the capability to identify when something has gone wrong during task execution, diagnose the nature of the failure, and take corrective action. This is not optional: in any sufficiently complex task, things will go wrong.' },
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
