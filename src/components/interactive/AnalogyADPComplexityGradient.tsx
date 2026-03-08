import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPComplexityGradient() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about building a house. You start with the foundation and framing. You do not begin by installing a smart home system and then try to figure out where the walls go. Yet this is exactly what many teams do with LLM applications: they reach for a multi-agent framework on day one, before they have even confirmed that a single prompt can do the.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Each rung is a strict superset of capability. A prompt chain can do everything a single call can do, plus handle multi-step transformations. An agent can do everything a routed workflow can do, plus handle unpredictable branching.' },
    { emoji: '🔍', label: 'In Detail', text: 'The complexity gradient is a design principle: arrange your options from simplest to most complex, start at the bottom, and climb only when you have evidence that the current rung fails. Each rung up the ladder buys you more capability but costs you predictability, debuggability, speed, and money.' },
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
