import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLRewardModelingForLlms() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are judging a cooking competition but cannot write down a recipe for "delicious." You cannot specify the exact temperature, spice ratios, or plating arrangement that makes a dish great. But you can taste two dishes side by side and say "I prefer this one.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a prompt x and two responses y_w (preferred) and y_l (dispreferred), the Bradley-Terry model assumes the probability that y_w is preferred follows a logistic function of the reward difference:  [equation]  The reward model r_ is trained by maximizing the log-likelihood of observed preferences:  [equation]  Note that only differences in.' },
    { emoji: '🔍', label: 'In Detail', text: 'In the RLHF pipeline, the reward model bridges the gap between human preferences and mathematical optimization. Humans cannot provide reward signals for millions of training examples, so instead they label tens of thousands of pairwise comparisons, and a reward model generalizes from these to score any new response.' },
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
