import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyGoodhartsLaw() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎯', label: 'Cobra Effect', text: 'Colonial Delhi offered bounties for dead cobras to reduce the population. People started breeding cobras for the bounty. When cancelled, they released them — more cobras than before. Goodhart\'s Law: "When a measure becomes a target, it ceases to be a good measure." In AI, optimizing a proxy metric (reward model score) too aggressively leads to gaming rather than genuine improvement.' },
    { emoji: '📈', label: 'KPI Corruption', text: 'A company measures success by "number of bugs fixed." Engineers start writing bugs just to fix them, or splitting simple fixes into multiple tickets. The metric is gamed. In AI, the reward model is our KPI — it\'s a proxy for "good response." Over-optimize it and the model finds patterns that score high but aren\'t actually helpful: verbose fluff, false confidence, or telling users what they want to hear.' },
    { emoji: '🏫', label: 'Standardized Testing', text: 'Schools measured by test scores start "teaching to the test" — students score well but lack deep understanding. Goodhart\'s Law in AI: the reward model is the standardized test. Heavy optimization produces models that ace the reward model while developing blind spots in areas the reward model doesn\'t capture. The solution: diverse evaluation, not over-reliance on a single metric.' },
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
