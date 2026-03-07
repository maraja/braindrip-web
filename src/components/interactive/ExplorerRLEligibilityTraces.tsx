import { useState } from 'react';

const DETAILS = [
    { label: 'Computational cost', detail: 'TD($\\lambda$) requires storing and updating a trace for every state (or state-action pair) at each step, making it $O(|\\mathcal{S}|)$ per step instead of $O(1)$ for TD(0). This motivated truncated traces and sparse implementations.' },
    { label: 'Common $\\lambda$ values', detail: '0.8-0.95 typically works best. $\\lambda = 0.9$ is a common default.' },
    { label: 'Replacing vs accumulating traces', detail: 'Replacing traces often work better in practice, especially in environments with loops or repeated state visits. Singh & Sutton (1996) showed replacing traces can be significantly faster.' },
    { label: 'In deep RL', detail: ', eligibility traces are less commonly used because experience replay (which randomly samples transitions) breaks the temporal structure that traces rely on. GAE (Generalized Advantage Estimation) is the modern equivalent, computing $\\lambda$-weighted advantages for policy gradient methods.' },
    { label: 'GAE connection', detail: 'The Generalized Advantage Estimation used in PPO and A2C is mathematically equivalent to using a $\\lambda$-return for advantage estimation: $\\hat{A}_t^{\\text{GAE}(\\gamma, \\lambda)} = \\sum_{l=0}^{\\infty} (\\gamma\\lambda)^l \\delta_{t+l}$' },
];

export default function ExplorerRLEligibilityTraces() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Eligibility Traces — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of eligibility traces.
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
