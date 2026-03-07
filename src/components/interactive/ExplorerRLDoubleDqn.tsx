import { useState } from 'react';

const DETAILS = [
    { label: 'Implementation cost', detail: 'Changing one line of code -- the target computation. No new networks, no new hyperparameters, no additional memory.' },
    { label: 'Atari results', detail: 'Double DQN improves median human-normalized score from ~93% (DQN) to ~117% across 49 games. Several games improve dramatically (e.g., Asterix: 6,012 to 28,188).' },
    { label: 'Overestimation reduction', detail: 'On some games, DQN\'s Q-value estimates exceed true values by 2--10x. Double DQN reduces this gap to near zero.' },
    { label: 'Compatible with other improvements', detail: 'Double DQN is orthogonal to experience replay variants, dueling architectures, and other DQN extensions. It is included as a standard component in Rainbow (`rainbow-dqn.md`).' },
    { label: 'Does not eliminate underestimation', detail: 'Double DQN can slightly *underestimate* Q-values in some cases, but moderate underestimation is far less harmful than overestimation because it does not create runaway positive feedback.' },
    { label: 'The two networks are not independent', detail: 'Unlike the original Double Q-learning proposal, the target network $\\mathbf{w}^-$ is a delayed copy of $\\mathbf{w}$, so they are correlated. Empirically, this correlation is weak enough that the bias reduction is substantial.' },
];

export default function ExplorerRLDoubleDqn() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Double DQN — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of double dqn.
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
