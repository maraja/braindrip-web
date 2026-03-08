import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFMarkovChainMonteCarlo() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you need to explore a vast, mountainous landscape to understand the distribution of altitude. You cannot see the whole terrain at once, and you cannot compute the average altitude analytically.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A Markov chain is a sequence of random variables ^&#123;(0)&#125;, ^&#123;(1)&#125;,  where the distribution of ^&#123;(t+1)&#125; depends only on ^&#123;(t)&#125;, not on earlier states. A chain has a stationary distribution () if, once the chain\'s state is distributed as , all subsequent states remain distributed as .' },
    { emoji: '🔍', label: 'In Detail', text: 'In Bayesian inference, we need to compute expectations under the posterior distribution:' },
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
