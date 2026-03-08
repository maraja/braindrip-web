import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLStatesActionsRewards() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of learning to cook. Your state is everything you can observe: the ingredients on the counter, what is in the pan, the temperature of the burner, and the timer reading. Your actions are the things you can do: chop, stir, adjust heat, add seasoning.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The state S_t  &#123;S&#125; is the information available to the agent at time t. It should satisfy the Markov property (see markov-decision-processes.md): the state must contain enough information to predict future states and rewards without knowledge of the history. Discrete state spaces.' },
    { emoji: '🔍', label: 'In Detail', text: 'Getting these representations right is arguably the most important design decision in applied RL. A well-chosen state representation, action space, and reward function can make a problem trivially solvable; poor choices can make it impossible.' },
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
