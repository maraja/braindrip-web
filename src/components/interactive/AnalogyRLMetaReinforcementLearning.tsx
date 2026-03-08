import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLMetaReinforcementLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a seasoned chess player who picks up a new board game. They do not start from scratch -- they recognize patterns (control the center, develop pieces early, think ahead), adapt their general strategy to the new rules, and play competently within a few games. They have not just learned chess; they have learned how to learn board games.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Meta-RL assumes a distribution over tasks p(&#123;T&#125;), where each task &#123;T&#125;_i is an MDP with its own reward function R_i and possibly its own transition dynamics T_i. The meta-objective is:  [equation]  where  are the meta-parameters and _i\' are the task-specific adapted parameters.' },
    { emoji: '🔍', label: 'In Detail', text: 'Meta-RL gives agents this same ability. Instead of training on a single task until convergence, the agent trains across a distribution of tasks, each a different MDP. The goal is not to master any one task but to develop internal mechanisms that enable rapid adaptation to any new task drawn from the same distribution.' },
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
