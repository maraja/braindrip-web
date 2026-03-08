import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLSarsa() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a cautious hiker planning a mountain trail. Rather than evaluating each route based on ideal conditions (what Q-learning does), this hiker evaluates routes based on how they actually hike -- including their tendency to occasionally stumble on loose rocks.' },
    { emoji: '⚙️', label: 'How It Works', text: 'After taking action A_t in state S_t, observing reward R_&#123;t+1&#125; and next state S_&#123;t+1&#125;, the agent selects its next action A_&#123;t+1&#125; according to the current policy, then updates:  [equation]  The key difference from Q-learning: the target uses Q(S_&#123;t+1&#125;, A_&#123;t+1&#125;) -- the Q-value of the action actually selected by the behavior policy -- rather than _a.' },
    { emoji: '🔍', label: 'In Detail', text: 'SARSA (State-Action-Reward-State-Action) is an on-policy TD control algorithm. Its name comes from the quintuple (S_t, A_t, R_&#123;t+1&#125;, S_&#123;t+1&#125;, A_&#123;t+1&#125;) used in each update. Unlike Q-learning, which evaluates the hypothetical greedy action, SARSA evaluates the action the agent will actually take next.' },
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
