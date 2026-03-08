import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAgentVsWorkflow() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider two approaches to navigating an unfamiliar city. The workflow approach is GPS turn-by-turn navigation: every decision is predetermined, each step follows a fixed rule ("in 200 meters, turn right"), and deviations from the path trigger recalculation using the same deterministic algorithm.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A workflow is structured as a directed graph of steps. Each step performs a specific operation — an LLM call, an API request, a data transformation — and the edges between steps are defined in code. Common patterns include:  Prompt chaining: LLM Call A produces output that feeds into LLM Call B.' },
    { emoji: '🔍', label: 'In Detail', text: 'A workflow is a deterministic sequence of steps where the logic is coded explicitly. Each step may involve an LLM call, but the orchestration — what happens after each step, what branches to take, how errors are handled — is defined in code. A workflow is a program that happens to use LLMs at certain steps.' },
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
