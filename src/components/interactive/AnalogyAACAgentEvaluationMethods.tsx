import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAgentEvaluationMethods() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine evaluating a chef. You could evaluate only the final dish: does it taste good? But this misses important information -- did they waste ingredients, take too long, make a mess of the kitchen, or get lucky with a technique they cannot reproduce? A proper evaluation considers both the final product and the process.' },
    { emoji: '⚙️', label: 'How It Works', text: 'End-to-end evaluation measures whether the agent completed the task successfully, ignoring the process. For a coding agent: did the code compile and pass tests? For a research agent: was the answer factually correct?' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent evaluation is fundamentally harder than LLM evaluation. A standard LLM evaluation compares a single output to a reference answer. An agent evaluation must assess a trajectory -- a sequence of reasoning steps, tool calls, and intermediate results that together produce a final outcome.' },
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
