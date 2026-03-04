import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyGRPO() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏅', label: 'Class Ranking', text: 'In GRPO (Group Relative Policy Optimization), the model generates a group of responses to each prompt, then ranks them relative to each other. Instead of an external reward model, the group average serves as the baseline. Responses above average get reinforced; below average get penalized. It is like grading on a curve: your score is relative to your classmates, not an absolute standard.' },
    { emoji: '🏊', label: 'Swim Heat', text: 'In a swim heat, you do not need a stopwatch to know who is fast — just see who finishes first relative to others. GRPO generates multiple responses (swimmers), computes rewards for each, and uses the group\'s mean reward as the baseline. This eliminates the need for a separate critic/value network. DeepSeek-R1 used GRPO to train reasoning capabilities that rival much larger models.' },
    { emoji: '🎪', label: 'Talent Show', text: 'At a talent show, acts are judged relative to each other, not against an external standard. GRPO samples a group of responses per prompt, scores them, and uses group-relative advantages (score minus group mean, normalized by group std). This self-referential grading simplifies the RL pipeline: no critic network, no reward model fine-tuning — just the policy model and a scoring function.' },
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
