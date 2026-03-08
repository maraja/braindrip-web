import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLGrpo() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a teacher grading essays. Traditional PPO is like having two systems: one that grades each essay on an absolute scale (the reward model) and another that predicts what grade each student will typically get (the value function/critic).' },
    { emoji: '⚙️', label: 'How It Works', text: 'For each prompt x_i in a training batch:  Step 1: Group Sampling. Sample a group of G complete responses from the current policy:  [equation]  Typical group sizes are G = 8--64. Step 2: Reward Scoring.' },
    { emoji: '🔍', label: 'In Detail', text: 'GRPO takes a simpler approach: for each prompt, generate a group of essays, score them all, and then rank them relative to each other. No prediction of expected performance is needed -- the group itself provides the baseline. If you wrote five essays and one scored significantly above the group average, that one gets reinforced.' },
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
