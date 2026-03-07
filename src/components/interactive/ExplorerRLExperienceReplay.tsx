import { useState } from 'react';

const DETAILS = [
    { label: 'Buffer size', detail: 'DQN uses $N = 1{,}000{,}000$ transitions. Larger buffers retain more diverse data but consume more memory and may retain very stale transitions.' },
    { label: 'Minibatch size', detail: 'Typically $B = 32$ for DQN. Larger batches (64--256) can improve stability but increase computation per update.' },
    { label: 'Memory cost', detail: 'Storing 1M Atari transitions naively requires ~7 GB (84x84 uint8 frames). Optimization: store frames once and reconstruct stacks by index, reducing memory to ~1.5 GB.' },
    { label: 'PER hyperparameters', detail: '$\\alpha = 0.6$, $\\beta_0 = 0.4$ (annealed to 1.0), $\\epsilon = 10^{-6}$ are standard values from the PER paper.' },
    { label: 'Replay ratio', detail: 'The number of gradient updates per environment step. DQN uses a replay ratio of 1 (one gradient step per 4 environment frames). Higher replay ratios improve sample efficiency but risk overfitting to the buffer.' },
    { label: 'Warm-up', detail: 'DQN fills the buffer with 50,000 random transitions before training begins, ensuring initial batches have sufficient diversity.' },
];

export default function ExplorerRLExperienceReplay() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Experience Replay — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of experience replay.
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
