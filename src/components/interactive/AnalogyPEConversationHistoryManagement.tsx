import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEConversationHistoryManagement() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of the difference between recording every word of a meeting versus taking meeting notes. A full recording captures everything — the small talk, the tangents, the repeated explanations — but it is hours long and mostly irrelevant when you need to recall a specific decision.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest strategy keeps only the most recent N turns and drops everything older. When the conversation exceeds N turns, the oldest turn is removed before adding the newest one. Implementation: Maintain a list of turns.' },
    { emoji: '🔍', label: 'In Detail', text: 'Conversation history management does the same for multi-turn LLM interactions. Every user message and assistant response in a conversation consumes tokens in the context window. A 20-turn conversation can easily reach 10,000-20,000 tokens, and a 50-turn conversation can exceed the entire context window of smaller models.' },
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
