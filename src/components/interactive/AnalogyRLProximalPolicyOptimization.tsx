import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLProximalPolicyOptimization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine TRPO is a careful surgeon performing a delicate operation with specialized instruments, constant monitoring, and precise measurements at every step. PPO is the experienced field medic who achieves nearly the same outcomes using simple, robust techniques that work reliably under any conditions.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Define the ratio between the new and old policy\'s probability of taking action a_t in state s_t:  [equation]  When  = _old, this ratio equals 1. The standard surrogate objective from TRPO is:  [equation]  Without any constraint, maximizing L^&#123;CPI&#125; can lead to destructively large policy updates when r_t() deviates far from 1.' },
    { emoji: '🔍', label: 'In Detail', text: 'PPO, introduced by Schulman et al. (2017), replaces TRPO\'s computationally expensive constrained optimization (conjugate gradients, line search, Fisher-vector products) with a simple clipped objective function that can be optimized with standard stochastic gradient descent.' },
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
