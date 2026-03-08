import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLPlanningWithLearnedModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a chess player who can\'t memorize the rules but can predict what will happen after each move by pattern-matching against thousands of previous games. They think ahead by imagining sequences of moves and counter-moves, evaluating each imagined position, and choosing the path that looks best.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The dynamics model predicts next state and reward given current state and action:  [equation]  Training uses supervised learning on collected transitions (s_t, a_t, s_&#123;t+1&#125;, r_&#123;t+1&#125;):  [equation]  For stochastic environments, the model may predict a distribution: p_(s_&#123;t+1&#125;, r_&#123;t+1&#125; | s_t, a_t), trained via maximum likelihood.' },
    { emoji: '🔍', label: 'In Detail', text: 'Planning with learned models brings this ability to RL agents. Instead of relying on a known simulator or environment model, the agent learns a dynamics model f_(s_t, a_t)  (&#123;s&#125;_&#123;t+1&#125;, &#123;r&#125;_&#123;t+1&#125;) from experience and uses it for lookahead planning, trajectory optimization, or generating synthetic data.' },
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
