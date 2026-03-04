import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyRewardModeling() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '⭐', label: 'Movie Critic AI', text: 'Reward modeling is like training an AI movie critic from audience preferences. You show pairs of movies and people say which is better. From thousands of such comparisons, the critic learns to predict a "quality score" for any movie. The reward model does the same for LLM outputs: trained on human comparisons (A > B), it learns to score any response, enabling RL optimization without querying humans every time.' },
    { emoji: '🏆', label: 'Judge Training', text: 'Training judges for a cooking competition: they taste many pairs of dishes and learn which qualities (flavor, presentation, creativity) humans value. The reward model is this trained judge. It takes a prompt and response and outputs a scalar score representing "how much would a human prefer this?" The model captures implicit human preferences that are hard to write as explicit rules.' },
    { emoji: '🧭', label: 'Compass', text: 'A reward model is a compass for the RL optimization process. Instead of wandering randomly (generating arbitrary responses), the model follows the compass heading toward higher-reward territory. The compass is calibrated using human preferences (Bradley-Terry model: P(A>B) = sigmoid(r(A) - r(B))). A well-calibrated compass leads to helpful, harmless outputs; a miscalibrated one causes reward hacking.' },
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
