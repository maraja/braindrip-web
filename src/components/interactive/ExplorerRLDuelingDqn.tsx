import { useState } from 'react';

const DETAILS = [
    { label: 'Performance gains', detail: 'On Atari, dueling DQN improves median human-normalized score from ~117% (Double DQN baseline) to ~140%, with large gains on games with many \"irrelevant-action\" states.' },
    { label: 'Parameter overhead', detail: 'Minimal. Replacing one 512-to-$|\\mathcal{A}|$ output layer with two streams (512-to-1 and 512-to-$|\\mathcal{A}|$) adds roughly 512 parameters.' },
    { label: 'Mean vs. max subtraction', detail: 'Mean subtraction ($\\frac{1}{|\\mathcal{A}|}\\sum A$) is preferred over max subtraction ($\\max A$) because it provides smoother gradients and does not change the optimal action ranking.' },
    { label: 'Gradient flow to V', detail: 'The value stream receives gradient updates for every action in the minibatch. In standard DQN, the value is implicitly encoded across all action outputs, so learning that a state is universally bad requires experiencing every action in that state.' },
    { label: 'Compatibility', detail: 'The dueling architecture is a drop-in replacement. It works with all DQN training algorithms (Double DQN, PER, etc.) without modification.' },
    { label: 'Gradient clipping', detail: 'The original paper clips gradients entering the aggregation layer to have norm at most 10, preventing large advantage updates from destabilizing the value stream.' },
];

export default function ExplorerRLDuelingDqn() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Dueling DQN — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of dueling dqn.
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
