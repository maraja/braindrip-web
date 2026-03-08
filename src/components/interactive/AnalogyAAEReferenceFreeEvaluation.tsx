import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEReferenceFreeEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine grading a student\'s creative writing assignment. There is no single "correct" answer to compare against -- you cannot look up the right essay in an answer key. Instead, you evaluate internal qualities: Is the argument logically consistent? Does it meet the assignment constraints (word count, topic, format)?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Run the agent on the same task multiple times (typically 5-10 runs) and measure agreement across outputs. High self-consistency suggests the agent has a reliable process for this task type; low consistency indicates uncertainty or sensitivity to random factors.' },
    { emoji: '🔍', label: 'In Detail', text: 'Reference-free evaluation applies this principle to agent assessment. For many real-world agent tasks, gold-standard answers either do not exist, are prohibitively expensive to create, or are not unique (multiple valid solutions exist). A coding agent asked to "refactor this module for better readability" has no single correct output.' },
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
