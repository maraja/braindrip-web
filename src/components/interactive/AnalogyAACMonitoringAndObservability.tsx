import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACMonitoringAndObservability() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine operating a nuclear power plant with no instrument panel -- no temperature gauges, no pressure readings, no radiation monitors. You would have no idea whether the plant was operating normally or heading toward a meltdown until it was too late.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Each agent request generates a trace -- a hierarchical record of every operation the agent performed. The trace starts with the user request and branches into child spans for each agent step: LLM calls (with prompt, completion, model, tokens used), tool invocations (with parameters, results, duration), retrieval operations (with queries, results,.' },
    { emoji: '🔍', label: 'In Detail', text: 'When an agent runs in production, it makes dozens of decisions, executes multiple tool calls, processes retrieved documents, and generates responses -- all within seconds. Without observability, operators have no visibility into this process. They see only the final output and whether the user was satisfied.' },
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
