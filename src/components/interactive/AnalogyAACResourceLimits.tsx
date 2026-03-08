import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACResourceLimits() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a kitchen timer for a meal you are cooking. Without it, you might forget the oven is on and burn the food -- or worse, start a fire. The timer does not cook the food; it prevents unbounded cooking.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Token budgets cap the total number of tokens an agent can consume across all LLM calls during a single task. This includes both input tokens (prompts, context, retrieved documents) and output tokens (reasoning, responses, tool call arguments). A typical budget might be 100,000-500,000 tokens for a complex task.' },
    { emoji: '🔍', label: 'In Detail', text: 'An AI agent without resource limits is genuinely dangerous. Consider a coding agent that encounters a bug it cannot fix. Without limits, it might retry the same approach hundreds of times, each attempt consuming thousands of tokens. A research agent might follow an infinite chain of references, each retrieval spawning more retrievals.' },
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
