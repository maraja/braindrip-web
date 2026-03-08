import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLNStepMethods() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine predicting the weather. A one-step forecast ("what will tomorrow be like based on today?") is low variance but relies heavily on your current model\'s accuracy. A full-season forecast ("average of all days this season") uses real data but is noisy.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The n-step return from time t is defined as:  [equation]  More compactly:  [equation]  Special cases reveal the unifying nature: n = 1: G_&#123;t:t+1&#125; = R_&#123;t+1&#125; +  V(S_&#123;t+1&#125;) -- the TD(0) target. n = T - t (remaining episode length): G_&#123;t:T&#125; = _&#123;k=0&#125;^&#123;T-t-1&#125; ^k R_&#123;t+k+1&#125; -- the full MC return (with V(S_T) = 0 for terminal states).' },
    { emoji: '🔍', label: 'In Detail', text: 'N-step methods provide a continuous, tunable bridge between TD(0) at one extreme (n = 1) and Monte Carlo at the other (n = ). The parameter n controls the bias-variance trade-off: small n gives low variance but higher bias (from bootstrapping off potentially inaccurate estimates), while large n gives lower bias but higher variance (from.' },
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
