import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLDpoAsImplicitRl() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you want to train a dog using treats. The standard RLHF approach (PPO) is like first building a "treat predictor" machine (reward model) that scores every possible behavior, then running the dog through an elaborate training loop where it tries different behaviors, checks the machine, and gradually adjusts.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Standard RLHF optimizes:  [equation]  This seeks a policy that maximizes reward while staying close to the reference policy.' },
    { emoji: '🔍', label: 'In Detail', text: 'Direct Preference Optimization (Rafailov et al., 2023) exploits a mathematical insight: the optimal solution to the KL-constrained RLHF objective can be written in closed form, and this closed-form solution can be rearranged to define a loss function that depends only on the policy, the reference model, and the preference data.' },
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
