import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACShortTermContextMemory() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a whiteboard in a meeting room. Everything currently relevant to the discussion is written on it: the agenda, key points raised, decisions made, action items. The whiteboard is immediately visible to everyone -- no one needs to look anything up. But the whiteboard has finite space.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest context memory strategy is a conversation buffer: store all messages in order and include as many as fit in the context window. When the buffer exceeds the token limit, the oldest messages are removed (FIFO -- First In, First Out).' },
    { emoji: '🔍', label: 'In Detail', text: 'For LLM-based agents, the context window IS the working memory. Every token in the context window is "on the whiteboard": directly accessible to the model\'s attention mechanism during generation. This includes the system prompt, the conversation history, recent tool outputs, intermediate reasoning traces, and any retrieved memories.' },
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
