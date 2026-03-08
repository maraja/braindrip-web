import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACTrajectoryEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two students taking a math exam. Both get the right answer: 42. But Student A showed clean, logical work with correct intermediate steps. Student B made three errors that happened to cancel each other out, arriving at 42 by accident. Traditional evaluation (grade the final answer) gives both an A.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Each step in the trajectory is evaluated independently. For tool calls: was the right tool selected, were the parameters correct, was the call necessary? For reasoning steps: was the reasoning logically sound, did it correctly interpret previous observations, did it identify relevant information?' },
    { emoji: '🔍', label: 'In Detail', text: 'An agent\'s trajectory is the complete sequence of reasoning steps, tool calls, observations, and decisions from the start of a task to its completion. A typical trajectory might include: analyze the task, search for relevant information, read search results, identify a promising approach, execute the approach, encounter an error, diagnose the.' },
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
