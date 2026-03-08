import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGATracingAndDebugging() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are a detective investigating a case, and someone hands you a complete timeline of every person involved — where they went, what they said, how long each conversation lasted, and what decisions they made. That is what a LangSmith trace gives you for an agent execution.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A LangSmith trace is a tree of spans. For a LangGraph agent, the hierarchy typically looks like this: the top-level graph run contains child spans for each node execution, and each node span contains child spans for LLM calls, tool invocations, or retriever queries. Every span records its input, output, start time, end time, and metadata.' },
    { emoji: '🔍', label: 'In Detail', text: 'Debugging LLM applications is fundamentally different from debugging traditional software. A conventional bug produces the same wrong output every time for the same input. An agent bug might manifest as the model choosing the wrong tool 30% of the time, or producing subtly incorrect reasoning that looks plausible on the surface.' },
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
