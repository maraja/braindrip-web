import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMemorySystems() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧠', label: 'Human Memory Types', text: 'LLM memory mirrors human memory. Short-term memory is the current context window (like working memory). Long-term memory is a persistent database the agent can read/write (like a journal). Episodic memory stores past interactions. Semantic memory stores facts and knowledge. Without these layers, every conversation starts from zero — like meeting someone with amnesia each time.' },
    { emoji: '📓', label: 'Notebook System', text: 'An agent without memory is like a student who takes no notes. Memory systems give them notebooks: a scratchpad for the current task (working memory), a personal journal to recall past conversations (episodic memory), a knowledge base of learned facts (semantic memory), and a procedures manual for learned skills (procedural memory). The agent reads and writes to these stores across sessions.' },
    { emoji: '🏠', label: 'Smart Home', text: 'A smart home remembers your preferences (thermostat settings, music taste, schedule) across interactions. Agent memory systems work similarly — they persist user preferences, past decisions, learned facts, and conversation summaries beyond the context window. This enables personalization, continuity across sessions, and the ability to learn and improve from experience over time.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
