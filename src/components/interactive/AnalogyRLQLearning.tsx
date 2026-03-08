import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLQLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a new employee who follows their cautious supervisor\'s instructions (the behavior policy) but mentally keeps track of what the best possible action would have been in each situation (the target policy). Over time, this employee builds a mental model of the optimal strategy -- even though they never actually followed it.' },
    { emoji: '⚙️', label: 'How It Works', text: 'After taking action A_t in state S_t, observing reward R_&#123;t+1&#125; and next state S_&#123;t+1&#125;, Q-learning updates:  [equation]  The critical term is _a Q(S_&#123;t+1&#125;, a). Rather than using the Q-value of whatever action was actually selected next, Q-learning uses the Q-value of the best action.' },
    { emoji: '🔍', label: 'In Detail', text: 'Q-learning, introduced by Chris Watkins in his 1989 PhD thesis, was the first RL algorithm proven to converge to the optimal policy without requiring a model of the environment. It remains one of the most important algorithms in all of RL -- the direct ancestor of Deep Q-Networks (DQN) that launched the deep RL revolution.' },
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
