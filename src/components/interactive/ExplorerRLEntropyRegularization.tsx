import { useState } from 'react';

const DETAILS = [
    { label: 'Default entropy coefficient', detail: '$\\alpha = 0.01$ for A2C/A3C/PPO with discrete actions. For continuous control, $\\alpha$ varies more ($0.001$ to $0.2$) and is often auto-tuned.' },
    { label: 'Entropy computation', detail: 'For categorical policies with $K$ actions, maximum entropy is $\\log K$. For Gaussian policies, entropy depends on $\\sigma$ and is unbounded above.' },
    { label: 'Gradient of entropy', detail: 'For a categorical policy, $\\nabla_\\theta H = -\\nabla_\\theta \\sum_a \\pi_\\theta(a|s)[\\log \\pi_\\theta(a|s) + 1]$. Most deep learning frameworks compute this automatically.' },
    { label: 'Entropy decay', detail: 'Some implementations anneal $\\alpha$ from a larger value to a smaller one during training, encouraging more exploration early and more exploitation later.' },
    { label: 'Numerical stability', detail: 'When $\\pi_\\theta(a|s) \\approx 0$, the term $\\pi \\log \\pi$ can cause numerical issues. Adding a small constant (e.g., $10^{-8}$) inside the log prevents NaN values.' },
    { label: 'Entropy regularization is not the same as epsilon-greedy', detail: 'Epsilon-greedy exploration is uniform over random actions. Entropy regularization smoothly distributes probability, favoring near-optimal actions while maintaining stochasticity.' },
];

export default function ExplorerRLEntropyRegularization() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Entropy Regularization — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of entropy regularization.
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
