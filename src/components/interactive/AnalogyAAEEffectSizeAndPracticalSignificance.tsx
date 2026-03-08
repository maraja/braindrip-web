import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEEffectSizeAndPracticalSignificance() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a pharmaceutical trial finds that a new drug lowers blood pressure by 0.5 mmHg with p &lt; 0.001. The effect is "statistically significant" but clinically meaningless -- no doctor would prescribe it. Conversely, a trial finding a 15 mmHg reduction with p = 0.08 (not significant) should not be dismissed; the sample was probably just too small.' },
    { emoji: '⚙️', label: 'How It Works', text: 'When comparing binary success rates -- the most common agent evaluation setting -- Cohen\'s h measures effect size on the arcsine-transformed scale:  [equation]  This transformation stabilizes variance across the range of proportions. Conventional benchmarks:  For comparing an agent at p_1 = 0.75 and p_2 = 0.' },
    { emoji: '🔍', label: 'In Detail', text: 'In the agent evaluation context, practical significance asks: "Given the costs of deploying this new agent version (re-testing, migration, risk), does the observed improvement justify the effort?" A 2% improvement in benchmark accuracy that is statistically significant (p = 0.03) may not warrant the operational overhead of a deployment.' },
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
