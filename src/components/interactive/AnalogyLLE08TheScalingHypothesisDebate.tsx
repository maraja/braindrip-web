import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE08TheScalingHypothesisDebate() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are watching a child learn to read. At first, they recognize individual letters. Then words. Then sentences. Then stories. Each stage seems qualitatively different — understanding a story is not just "more" letter recognition — and yet it emerges from the same underlying process of pattern learning, applied at increasing scale and.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The case for the scaling hypothesis rests on several pillars:  Kaplan\'s scaling laws (January 2020) showed that language model loss decreases as a smooth power law with model size, dataset size, and compute, with no sign of diminishing returns across seven orders of magnitude.' },
    { emoji: '🔍', label: 'In Detail', text: 'The scaling hypothesis is not a formal conjecture with a precise mathematical statement. It is more of a worldview — a belief about the nature of intelligence and the path to achieving it artificially. In its strongest form, it claims that the architectures we already have (Transformers) are sufficient, and the only missing ingredient is scale.' },
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
