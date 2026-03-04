import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyWeakToStrong() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '👶', label: 'Child Surpassing Teacher', text: 'A piano teacher with moderate skill can still produce students who become concert pianists — the student internalizes the principles and extrapolates beyond what the teacher demonstrated. Weak-to-strong generalization asks: can a weak supervisor (like a small model or imperfect human feedback) successfully align a strong model that exceeds the supervisor\'s capabilities? Early results suggest yes — strong models can generalize the intent behind imperfect supervision.' },
    { emoji: '📐', label: 'Noisy Blueprint', text: 'An architect working from a slightly smudged blueprint can still build a solid structure by inferring the designer\'s intent. A strong model fine-tuned on weak labels (from a smaller model) can outperform those labels by "reading through the noise" — understanding the underlying pattern the weak supervisor was trying to capture, then executing it more skillfully. The strong model\'s capabilities help it generalize beyond the supervisor\'s limitations.' },
    { emoji: '🧭', label: 'Imperfect Compass', text: 'A compass that\'s slightly off still points you roughly in the right direction, and a skilled navigator can correct for the error. Weak-to-strong generalization works similarly: even imperfect oversight signals give the strong model enough directional information to align well. This is encouraging for alignment — it suggests we don\'t need perfect superhuman oversight to align superhuman AI, just good-enough guidance.' },
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
