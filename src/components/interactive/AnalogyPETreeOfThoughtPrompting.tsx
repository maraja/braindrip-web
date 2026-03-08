import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPETreeOfThoughtPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a chess player considering their next move. They do not commit to the first idea that comes to mind. Instead, they consider several candidate moves, mentally play out each one a few turns ahead, evaluate the resulting positions, prune the unpromising lines, and explore the most promising ones more deeply.' },
    { emoji: '⚙️', label: 'How It Works', text: 'In ToT, each node in the tree represents a partial solution or intermediate reasoning state. From each node, the model generates multiple candidate next steps (branches). Each candidate is evaluated for promise, and the search continues from the most promising nodes.' },
    { emoji: '🔍', label: 'In Detail', text: 'Introduced by Yao et al. (2023), ToT demonstrated dramatic improvements on tasks that require exploration and planning. On the "Game of 24" (combining four numbers with arithmetic to reach 24), standard prompting achieved only 4% success and chain-of-thought reached 4% as well, since the task requires exploring combinatorial possibilities rather.' },
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
