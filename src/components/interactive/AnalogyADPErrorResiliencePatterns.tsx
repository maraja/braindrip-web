import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPErrorResiliencePatterns() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of designing a building in an earthquake zone. You do not wait for the earthquake to figure out your response plan. Instead, you engineer flexible foundations, redundant load paths, and controlled crumple zones into the structure from the start. The building does not prevent earthquakes -- it survives them by design.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The first line of defense is ensuring the agent\'s outputs are parseable and actionable even when the LLM deviates from instructions. Structured output enforcement constrains the LLM to produce valid JSON, function calls, or other machine-readable formats. Use the model provider\'s native structured output mode (e.g.' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent systems face a uniquely hostile error landscape. Every LLM call can produce malformed output. Every tool invocation can timeout, return unexpected data, or fail silently. Every multi-step plan can go off the rails at step three of twelve. Traditional software handles errors with try-catch blocks and retries.' },
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
