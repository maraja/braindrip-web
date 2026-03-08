import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACLoggingTracingAndDebugging() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine debugging a car that drove itself across the country and arrived at the wrong destination. You cannot simply check the final position -- you need the complete route log: every turn decision, every GPS reading, every detour. Agent debugging faces the same challenge.' },
    { emoji: '⚙️', label: 'How It Works', text: 'An agent trace is a tree of spans. The root span represents the entire agent invocation. Child spans represent individual steps: LLM calls, tool invocations, retrieval operations.' },
    { emoji: '🔍', label: 'In Detail', text: 'Traditional software logging captures discrete events: "request received," "database query executed," "response sent." Agent tracing captures a richer structure: the chain of thought (what the model was thinking), the action (what tool it decided to call), the observation (what the tool returned), and the decision (what the model concluded from.' },
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
