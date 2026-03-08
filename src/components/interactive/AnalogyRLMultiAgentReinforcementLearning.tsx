import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLMultiAgentReinforcementLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a crowded dance floor. If you are the only dancer, you can plan your moves freely -- the floor is your stage. But add fifty other dancers, each improvising their own routine, and suddenly the environment itself is alive and unpredictable. Your best move depends on what everyone else does, and their best moves depend on you.' },
    { emoji: '⚙️', label: 'How It Works', text: 'MARL extends the MDP to a stochastic game (also called a Markov game), defined by the tuple (N, S, \\&#123;A_i\\&#125;_&#123;i=1&#125;^N, T, \\&#123;R_i\\&#125;_&#123;i=1&#125;^N, ) where N is the number of agents, S is the shared state space, A_i is the action space of agent i, and the transition function depends on the joint action:  [equation]  Each agent i receives its own reward R_i(s,.' },
    { emoji: '🔍', label: 'In Detail', text: 'In MARL, two or more agents interact within a shared environment, each pursuing its own objective. The environment is no longer stationary from any single agent\'s perspective because the other agents are simultaneously learning and changing their policies.' },
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
