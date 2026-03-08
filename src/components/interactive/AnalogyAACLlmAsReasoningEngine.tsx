import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACLlmAsReasoningEngine() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of the LLM as a highly knowledgeable consultant you can call on the phone. Every time you call, you must re-explain the entire situation from scratch — they have no memory of previous calls. They are brilliant at understanding complex situations, making connections, and suggesting next steps.' },
    { emoji: '⚙️', label: 'How It Works', text: 'When an LLM receives a context and generates a response, it is performing several interleaved cognitive operations:  Situation assessment: Understanding the current state — what has been tried, what succeeded, what failed, what the goal is.' },
    { emoji: '🔍', label: 'In Detail', text: 'In agent architecture, the LLM is the component that takes in a context (system prompt, conversation history, recent observations) and produces a decision: what to do next. It does not execute actions, store state, or access external information directly.' },
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
