import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEVarianceDecomposition() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are trying to measure how fast a runner completes a mile, but your measurements are noisy. The noise could come from the stopwatch (measurement error), wind conditions (environment), the runner\'s daily form (subject variability), or track quality (context).' },
    { emoji: '⚙️', label: 'How It Works', text: 'Model agent evaluation results as a linear random-effects model. Let Y_&#123;ijkl&#125; be the outcome for model run l, evaluated by judge k, on task j, in environment instance i:  [equation]  where:  = grand mean (true agent performance) _i  N(0, ^2_&#123;env&#125;) = environment variance _j  N(0, ^2_&#123;task&#125;) = task difficulty variance _k  N(0, ^2_&#123;judge&#125;) =.' },
    { emoji: '🔍', label: 'In Detail', text: 'In agent evaluation, observed variance in performance metrics is a mixture of several sources: the randomness inherent in LLM sampling (temperature, nucleus sampling), the instability of external environments (API timeouts, web page changes), the spread of task difficulty within the evaluation suite, and the inconsistency of the evaluation method.' },
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
