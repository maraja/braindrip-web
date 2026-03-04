import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyTestTimeCompute() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🤔', label: 'Thinking Longer', text: 'On an easy question, you answer instantly. On a hard one, you think for minutes, try different approaches, and double-check. Test-time compute lets models do the same: spend more computation on harder problems by generating longer chains of thought, exploring multiple solution paths, or verifying answers. Instead of always using the same compute per token, the model allocates thinking time based on difficulty.' },
    { emoji: '📝', label: 'Draft & Revise', text: 'A writer produces a better essay by writing multiple drafts and revising. Test-time compute lets models write multiple "drafts" — generating several candidate answers, scoring them, and selecting or synthesizing the best one. Techniques include best-of-N sampling, self-verification, and iterative refinement. More compute at inference = better answers, trading speed for quality on demand.' },
    { emoji: '⚖️', label: 'Train vs Think Budget', text: 'You can invest in education (training compute) or take more time on the exam (test-time compute). Recent research shows these are partly substitutable: a smaller model with more thinking time can match a larger model that answers quickly. This reshapes the scaling paradigm — instead of only making models bigger, we can make them "think harder" on problems that need it, allocating compute where it matters most.' },
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
