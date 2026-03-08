import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAERubricEngineering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a rubric as the difference between telling a restaurant reviewer "rate this meal" versus handing them a scorecard with specific dimensions (flavor balance, presentation, temperature, portion size) each with concrete anchors ("a 5 means every component is at optimal serving temperature; a 3 means one component is noticeably too hot or.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Identify the independent aspects of quality that matter for your evaluation context. Common dimensions for agent evaluation include:  Correctness: Does the output satisfy the task requirements? Efficiency: Did the agent use a reasonable number of steps and resources?' },
    { emoji: '🔍', label: 'In Detail', text: 'Rubric engineering applies this principle to automated evaluation. When an LLM-as-Judge or Agent-as-Judge evaluates agent output, the rubric determines what gets measured, how each quality level is defined, and what concrete examples anchor the scoring scale.' },
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
