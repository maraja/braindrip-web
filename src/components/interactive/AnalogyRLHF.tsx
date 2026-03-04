import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRLHF() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🐕', label: 'Dog Training', text: 'RLHF is like training a dog with treats and corrections. The dog (model) tries behaviors, and the trainer (reward model, learned from human preferences) says "good boy!" or "no." Over time, the dog learns to do more of what gets treats. The PPO algorithm adjusts the model\'s behavior to maximize the reward while not straying too far from its SFT starting point (the KL penalty is the leash).' },
    { emoji: '🍽', label: 'Restaurant Reviews', text: 'A chef (model) cooks dishes and sends them to food critics (human labelers) who rank them: "Dish A is better than Dish B." These rankings train a food critic AI (reward model). Then the chef iterates: cook, get the critic AI\'s score, adjust the recipe. RLHF\'s three stages mirror this: collect preferences, train reward model, optimize policy with RL. The result: food the critics love.' },
    { emoji: '🏫', label: 'Student + Rubric', text: 'After learning the basics (SFT), a student submits essays that are ranked by teachers (human preferences). These rankings create an automated grading rubric (reward model). The student then writes thousands more essays, graded by the rubric, learning to maximize the score. RLHF is this feedback loop: human judgment is distilled into a reward model that guides ongoing optimization via reinforcement learning.' },
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
