import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACConversationManagement() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a skilled executive assistant who has been in a long meeting. They do not transcribe every word spoken; instead, they maintain structured notes: who said what on which topic, what decisions were made, what action items were assigned, and what remains unresolved. When a participant asks "What did we decide about the budget?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Modern LLM APIs structure conversations using role-based messages. Understanding and leveraging these roles is fundamental to conversation management:  System message: Sets the agent\'s behavior, personality, and constraints. Persistent across the conversation.' },
    { emoji: '🔍', label: 'In Detail', text: 'Conversation management for agents is this same skill applied to multi-turn dialogue. Every conversation generates a growing stream of messages: user requests, agent responses, tool calls, tool outputs, system instructions, and internal reasoning.' },
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
