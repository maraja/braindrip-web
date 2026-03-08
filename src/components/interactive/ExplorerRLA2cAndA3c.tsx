import { useState } from 'react';

const DETAILS = [
    { label: 'Number of workers', detail: '16-32 is standard. More workers provide better decorrelation but with diminishing returns and increased communication overhead.' },
    { label: 'N-step returns', detail: 'n = 5 is the canonical choice from the original A3C paper. Larger n reduces bias but increases variance.' },
    { label: 'Shared vs. separate networks', detail: 'The original A3C paper uses a shared convolutional network with separate policy and value heads. This is computationally efficient but can cause gradient interference.' },
    { label: 'Optimizer', detail: 'A3C originally used RMSProp with shared running statistics across workers. A2C commonly uses Adam with a learning rate of 2.5 x 10^&#123;-4&#125; to 7 x 10^&#123;-4&#125;.' },
    { label: 'No replay buffer', detail: 'Both A2C and A3C are on-policy. Data is used once and discarded. This is both a feature (no stale data) and a limitation (sample inefficiency).' },
    { label: 'Entropy coefficient', detail: 'c_2 = 0.01 is standard. Without entropy regularization, policies can collapse to deterministic behavior early in training, especially with many parallel workers that may all converge to the same suboptimal strategy.' },
];

export default function ExplorerRLA2cAndA3c() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          A2C and A3C \u2014 Key Details Explorer
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
