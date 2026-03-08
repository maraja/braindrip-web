import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPHumanEvaluationForNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine tasting wine. A chemical analysis can measure sugar content, acidity, and tannin levels (analogous to automated metrics), but only a human taster can judge whether the wine is actually enjoyable, well-balanced, and worth recommending.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Likert Scales: Annotators rate outputs on a fixed ordinal scale, typically 1--5 or 1--7. For example, a fluency Likert scale might define 1 = "incomprehensible," 3 = "understandable but awkward," 5 = "perfectly natural." Likert scales are simple to implement but suffer from annotator calibration drift -- one person\'s "4" may be another\'s "3.' },
    { emoji: '🔍', label: 'In Detail', text: 'Human evaluation is the process of having people read, compare, or rate NLP system outputs according to defined criteria. It is simultaneously the most trusted form of evaluation and the most expensive, slowest, and hardest to reproduce.' },
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
