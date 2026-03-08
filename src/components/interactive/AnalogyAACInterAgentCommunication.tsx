import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACInterAgentCommunication() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider three different ways a team might coordinate. In a meeting (direct message passing), people talk directly to each other, taking turns and responding to what was just said. On a shared whiteboard (blackboard/shared memory), anyone can write information and anyone can read it — there is no direct conversation, just a shared workspace.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Agents communicate by sending messages directly to specific other agents. This is the most common pattern in current multi-agent frameworks:  Conversational: Agents exchange natural language messages in a turn-based conversation. AutoGen\'s multi-agent chat is a prime example — agents take turns speaking in a group chat or direct message thread.' },
    { emoji: '🔍', label: 'In Detail', text: 'Inter-agent communication is the mechanism by which agents in a multi-agent system share information, coordinate actions, and collaborate toward shared goals. The choice of communication pattern fundamentally shapes how the system behaves: direct messaging creates tight coupling but precise coordination; shared memory enables flexible.' },
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
