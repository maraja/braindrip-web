import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLEntropyRegularization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a chess player who discovers that a particular opening works well and begins playing it every single game. She stops exploring other openings, never discovers better strategies, and becomes predictable to opponents.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For a discrete policy, the entropy is:  [equation]  For a continuous Gaussian policy _(|s) = &#123;N&#125;(_(s), _(s)^2):  [equation]  The entropy-regularized objective becomes:  [equation]  where  &gt; 0 is the entropy coefficient (also called the temperature parameter).' },
    { emoji: '🔍', label: 'In Detail', text: 'Entropy regularization adds exactly this kind of bonus to the RL objective. The entropy of a policy _(|s) measures how "spread out" or uncertain the action distribution is. A deterministic policy (always choosing one action) has zero entropy. A uniform random policy (equal probability for all actions) has maximum entropy.' },
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
