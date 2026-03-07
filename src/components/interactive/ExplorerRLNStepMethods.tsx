import { useState } from 'react';

const DETAILS = [
    { label: 'Optimal $n$', detail: 'Problem-dependent, but $n \\in [4, 16]$ frequently outperforms TD(0) and MC in tabular benchmarks.' },
    { label: 'Memory requirement', detail: 'Must store the last $n$ states, actions, and rewards, requiring $O(n)$ additional memory per episode.' },
    { label: 'Update delay', detail: 'Values for $S_t$ cannot be updated until time $t + n$, delaying credit assignment. This means the first $n - 1$ transitions of each episode produce no updates.' },
    { label: 'Computational cost', detail: 'Each update costs $O(n)$ to compute the $n$-step return, compared to $O(1)$ for TD(0).' },
    { label: 'Off-policy instability', detail: 'The product of $n$ importance sampling ratios $\\rho_{t:t+n-1}$ grows exponentially in variance with $n$, making off-policy $n$-step methods impractical for large $n$.' },
    { label: 'Convergence', detail: '$N$-step TD converges to $V^\\pi$ under the same conditions as TD(0), with the rate depending on $n$, $\\alpha$, and the environment structure.' },
];

export default function ExplorerRLNStepMethods() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          N-Step Methods — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of n-step methods.
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
