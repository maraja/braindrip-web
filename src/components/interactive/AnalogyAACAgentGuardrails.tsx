import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAgentGuardrails() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a highway with guardrails. Drivers (agents) have freedom to drive wherever they want within the lanes, but if they veer off course, the guardrails prevent them from going off a cliff. The guardrails do not steer the car -- they establish hard boundaries that cannot be crossed.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Input guards process every message before it reaches the agent\'s reasoning. They perform several checks: prompt injection detection (identifying attempts to override system instructions), content policy enforcement (blocking requests for illegal, harmful, or unethical actions), scope enforcement (rejecting queries outside the agent\'s intended.' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent guardrails are automated safety checks that run at multiple points in the agent\'s execution pipeline. Input guards screen incoming messages for prompt injection, harmful requests, or out-of-scope queries before they reach the agent.' },
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
