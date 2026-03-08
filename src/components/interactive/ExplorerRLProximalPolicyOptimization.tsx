import { useState } from 'react';

const DETAILS = [
    { label: 'Clipping parameter $\\epsilon$', detail: '2 is the near-universal default. Smaller values (0.1) are more conservative; larger values (0.3) allow faster but riskier updates.' },
    { label: 'Number of epochs $K$', detail: '3-10 per batch. More epochs extract more from each batch but risk overfitting to it. PPO for RLHF typically uses K = 1-4.' },
    { label: 'Minibatch size', detail: 'The batch is usually split into minibatches (e.g., 32-512 transitions) for stochastic optimization within each epoch.' },
    { label: 'GAE parameters', detail: '= 0.99,  = 0.95 are standard defaults.' },
    { label: 'Value function clipping', detail: 'Some implementations clip the value function update similarly to the policy, preventing large changes: V_clipped = V_&#123;old&#125; + clip(V - V_&#123;old&#125;, -, ).' },
    { label: 'Learning rate', detail: 'Typically 3 x 10^&#123;-4&#125; for Atari, 3 x 10^&#123;-4&#125; for MuJoCo, often with linear decay to zero over training. RLHF uses  1 x 10^&#123;-5&#125; to 5 x 10^&#123;-6&#125;.' },
];

export default function ExplorerRLProximalPolicyOptimization() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Proximal Policy Optimization (PPO) \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
