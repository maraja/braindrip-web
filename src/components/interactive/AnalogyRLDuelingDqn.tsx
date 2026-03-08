import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLDuelingDqn() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine standing at a crossroads. Before you even think about which direction to turn, you might assess the situation: "Am I in a good neighborhood or a bad one?" That assessment -- the value of being here -- is useful regardless of which direction you choose. Only then do you consider the relative advantage of each direction.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Recall that the advantage function is defined as:  [equation]  The advantage measures how much better action a is compared to the average action under policy . By definition, _a (a|s) A_(s, a) = 0 -- advantages are zero-mean under the policy. The standard DQN architecture outputs Q(s, a; w) directly.' },
    { emoji: '🔍', label: 'In Detail', text: 'Proposed by Wang et al. (2016), the dueling architecture modifies the structure of the DQN network without changing the training algorithm. It introduces an inductive bias that is particularly powerful in states where the choice of action does not matter much -- allowing the agent to learn the state\'s value without needing to evaluate every action.' },
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
