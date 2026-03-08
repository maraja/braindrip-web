import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAELatencyAwareEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two plumbers arriving to fix a leak. One diagnoses the problem in 5 minutes and fixes it in 15. The other spends 2 hours carefully inspecting every pipe before performing a slightly more thorough repair. For an actively flooding kitchen, the first plumber is clearly better -- even if the second one\'s work is marginally superior.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Latency-aware evaluation requires multiple time metrics, each capturing a different aspect of the user experience:  Time-to-first-action (TTFA): How long before the agent begins doing something visible to the user. For a coding agent, this is the time from receiving a task to making the first file edit or running the first command.' },
    { emoji: '🔍', label: 'In Detail', text: 'Traditional agent benchmarks report accuracy as a single number, collapsing time into a binary "completed/not completed" judgment. But in production, time is a first-class quality dimension. A coding agent that takes 45 minutes to resolve an issue competes directly with a human developer who might solve it in 30 minutes.' },
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
