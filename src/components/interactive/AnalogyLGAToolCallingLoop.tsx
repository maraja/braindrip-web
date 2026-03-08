import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAToolCallingLoop() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a researcher working at a desk. They read the question, decide they need a specific fact, walk to the library to look it up, return to their desk with the answer, reconsider the question with this new information, and decide whether they need another trip to the library or can write their final answer.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LLM receives messages and tool schemas -- the conversation history plus a JSON description of each available tool (name, description, parameters) is sent to the model. LLM generates a response with tool calls -- instead of (or in addition to) text, the model returns structured tool_calls, each specifying a tool name and arguments.' },
    { emoji: '🔍', label: 'In Detail', text: 'In LLM-powered agents, this loop is the engine that transforms a passive text generator into an active problem solver. The model does not execute code or query databases directly -- it generates structured requests (tool calls) that a runtime executes on its behalf. The results come back as messages, and the model decides what to do next.' },
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
