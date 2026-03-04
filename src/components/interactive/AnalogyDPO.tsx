import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyDPO() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔀', label: 'A/B Testing', text: 'DPO is like learning from A/B test results directly, without building a separate preference predictor. Given pairs where humans said "Response A is better than B," DPO adjusts the model to increase the probability of A and decrease B — all in one step. No reward model, no RL training loop. The preference data directly becomes the training signal through a clever mathematical reformulation.' },
    { emoji: '🎯', label: 'Shortcut', text: 'RLHF takes three steps: collect preferences, train reward model, run RL. DPO is a mathematical shortcut that collapses this into one step. It proves that the optimal RLHF policy can be expressed as a simple function of the preference data. Instead of training a reward model and then optimizing against it, DPO directly trains the policy using a binary cross-entropy loss on preferred vs. dispreferred responses.' },
    { emoji: '👔', label: 'Dress Code', text: 'Instead of hiring a fashion consultant (reward model) who tells you what to wear each day, DPO is like having a friend show you outfits and say "this one is better than that one." You directly internalize the preference without an intermediary. The model increases log-probability of preferred responses relative to a reference model, with the beta parameter controlling how strongly preferences override the original behavior.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
