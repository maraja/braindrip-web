import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEConfidenceIntervalsForAgentMetrics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a weather forecast that says "tomorrow\'s temperature will be 68 degrees." Now imagine one that says "68 degrees, give or take 3 degrees." The second forecast is far more useful because it communicates uncertainty.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest approach uses the Central Limit Theorem:  [equation]  where &#123;p&#125; is the observed success rate and n is the number of trials. For &#123;p&#125; = 0.72 and n = 200:  [equation]  This gives a 95% CI of [0.658, 0.782].' },
    { emoji: '🔍', label: 'In Detail', text: 'A confidence interval (CI) provides a range of plausible values for the true performance metric, given the observed data. A 95% CI means that if you repeated the entire evaluation procedure many times, 95% of the resulting intervals would contain the true parameter.' },
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
