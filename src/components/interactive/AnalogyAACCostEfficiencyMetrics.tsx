import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACCostEfficiencyMetrics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two moving companies. Company A uses a single large truck and completes the move in one trip for 500. Company B uses a small van, making three trips, and charges 300 total. The outcome is identical -- your stuff is moved -- but the cost-efficiency is very different.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The fundamental metric is cost per successful task completion. This is calculated as: total cost of all attempts (including failures) divided by the number of successful completions. If an agent costs 0.10 per attempt and succeeds 80% of the time, the cost per success is 0.10 / 0.80 = $0.125.' },
    { emoji: '🔍', label: 'In Detail', text: 'In the AI agent world, the "moving companies" are different agent configurations: models, prompting strategies, tool setups, and retry policies. A GPT-4-based agent might solve a task in one attempt for 0.50. A GPT-3.5-based agent might fail on the first attempt but succeed on the third for 0.15 total.' },
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
