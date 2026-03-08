import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACGenerativeAgents() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine populating a small town with 25 characters, each with a name, a job, relationships, daily routines, and personal goals. Now imagine these characters are not scripted -- they wake up in the morning, decide what to do based on their personality and current circumstances, have conversations with neighbors, form opinions, plan events, and.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The memory stream is the generative agent\'s autobiography. Every experience -- observations, conversations, actions, internal thoughts -- is recorded as a timestamped memory with an importance score.' },
    { emoji: '🔍', label: 'In Detail', text: 'Generative agents differ from task-oriented agents in a fundamental way. A task agent receives an instruction ("book a flight"), executes it, and terminates. A generative agent has no specific task -- it exists continuously, making decisions about what to do based on its personality, current situation, memories, and goals.' },
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
