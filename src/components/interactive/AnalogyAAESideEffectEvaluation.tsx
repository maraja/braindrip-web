import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAESideEffectEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of hiring a plumber to fix a leaking faucet. The faucet gets fixed, but in the process the plumber scratches your countertop, leaves muddy footprints on the floor, and accidentally knocks a picture off the wall. The primary task succeeded, but the side effects may cost more to remediate than the original repair.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Environmental side effects are unintended modifications to the agent\'s operating environment. For a coding agent: files created, modified, or deleted that were not part of the task. Configuration files changed.' },
    { emoji: '🔍', label: 'In Detail', text: 'Every agent action has potential ripple effects beyond its intended purpose. A coding agent fixing a bug might inadvertently break a passing test. A data analysis agent querying a database might trigger expensive index rebuilds. An email agent drafting a reply might include context from a different conversation thread.' },
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
