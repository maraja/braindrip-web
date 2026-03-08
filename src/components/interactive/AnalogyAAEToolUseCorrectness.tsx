import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEToolUseCorrectness() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine watching a home cook in the kitchen. Even if the final dish tastes fine, you can learn a great deal by observing their process. Do they reach for the right knife? Do they set the oven to the correct temperature? When a sauce looks wrong, do they correctly identify whether it needs more acid or more salt?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Selection correctness measures whether the agent chose the appropriate tool for its current subgoal:  A selection is "correct" if the chosen tool is the most appropriate available option for the agent\'s stated or inferred intent. Evaluation requires a mapping from intents to optimal tools, typically defined per-task by domain experts.' },
    { emoji: '🔍', label: 'In Detail', text: 'Tool use correctness is the evaluation of every aspect of how an agent interacts with external tools: selecting the right tool for each situation, providing correct and appropriate parameters, interpreting the results accurately, and composing multiple tool calls into logical sequences.' },
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
