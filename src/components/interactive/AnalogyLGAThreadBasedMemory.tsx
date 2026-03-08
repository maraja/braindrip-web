import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAThreadBasedMemory() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine calling a customer support line. As long as you stay on the same call, the agent remembers everything you have said. But if you hang up and call back, you get a fresh agent who knows nothing about your previous call. Thread-based memory works exactly like this -- it is the "same call" memory for your LangGraph agent.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Thread-based memory requires two things: a checkpointer and a thread_id. There is no additional configuration:' },
    { emoji: '🔍', label: 'In Detail', text: 'When you attach a checkpointer to your graph and invoke it with a thread_id, every message and state update is automatically saved. The next time you invoke the graph with the same thread_id, the agent picks up with full context of the previous exchange. This is short-term, session-scoped memory -- it lives and dies with the thread.' },
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
