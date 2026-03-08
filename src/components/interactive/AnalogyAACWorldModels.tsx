import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACWorldModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of an experienced chess player who can "see" the board several moves ahead without physically moving any pieces. They maintain a mental model of the board state: where every piece is, which squares are controlled, what captures are available.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The world model maintains a structured representation of relevant environment state. For different agent domains:  Coding agent world model:  Research agent world model:  The state representation does not need to be literally stored as a JSON object.' },
    { emoji: '🔍', label: 'In Detail', text: 'For AI agents, a world model is an internal representation of the environment\'s current state and the rules governing how actions change that state. When a coding agent operates on a repository, its world model includes knowledge of which files exist, what they contain, what has been modified during the session, what tests are expected to pass,.' },
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
