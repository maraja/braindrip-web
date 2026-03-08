import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPSystemPromptEngineering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Writing a system prompt for an agent is like writing a job description combined with an employee handbook. The job description tells the agent what it is, what it does, and what success looks like. The handbook tells it how to behave, what rules to follow, and how to handle edge cases.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every effective agent system prompt contains these components, roughly in this order:  Ordering matters. Models attend to the beginning and end of the system prompt more strongly than the middle. Place the role definition and critical constraints at the top.' },
    { emoji: '🔍', label: 'In Detail', text: 'Unlike prompting a one-shot LLM call, agent system prompts must govern behavior across multiple turns, tool calls, and unpredictable user inputs. The prompt must be precise enough to constrain harmful behavior, flexible enough to handle varied inputs, and concise enough to fit within your token budget alongside the conversation history and tool.' },
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
