import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAgentStateManagement() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Picture a detective working a complex case over several weeks. Their desk is covered with organized materials: a case file with all evidence collected so far, a whiteboard with the current theory and connections, sticky notes with immediate next steps, and a filing cabinet with background research.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Conversation History (Message Log) The primary state container is the ordered list of messages exchanged between the user, the LLM, and tools. Each message has a role (user, assistant, tool) and content. This history grows monotonically — every turn adds messages but none are removed (until context management intervenes).' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent state management exists because of a fundamental architectural fact: the LLM is stateless. Each time the agent loop calls the LLM, the model starts from scratch. It has no memory of previous calls. Everything the agent "remembers" must be explicitly represented in the context sent to the LLM on each call.' },
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
