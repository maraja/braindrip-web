import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyCoTTraining() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📝', label: 'Show Your Work', text: 'In math class, teachers insist "show your work" because writing out steps prevents errors and builds understanding. Chain-of-thought training teaches models to show their work: instead of jumping to an answer, they generate explicit reasoning steps. Training on step-by-step solutions — or using RL to discover reasoning chains — dramatically improves accuracy on math, logic, and complex reasoning tasks.' },
    { emoji: '🧗', label: 'Climbing Holds', text: 'A rock climber does not leap to the top — they use holds (intermediate steps) to make the ascent manageable. CoT training adds "reasoning holds" between the question and answer. The model learns to break hard problems into easier sub-problems, solving each step before attempting the next. RL approaches (like DeepSeek-R1) can even discover these reasoning strategies without explicit demonstrations.' },
    { emoji: '💭', label: 'Thinking Out Loud', text: 'When you think out loud while solving a puzzle, you catch mistakes you would miss internally. CoT training gives models this same capability: generating intermediate tokens that serve as "working memory." This is transformative because transformers are constant-depth circuits — without CoT, the model has fixed compute per token. With CoT, harder problems get more compute through longer reasoning chains.' },
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
