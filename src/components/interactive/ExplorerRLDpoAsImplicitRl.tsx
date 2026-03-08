import { useState } from 'react';

const DETAILS = [
    { label: 'Beta parameter', detail: '= 0.1--0.5 controls the deviation from the reference policy. Lower  allows more deviation; higher  keeps the policy closer to the reference.' },
    { label: 'Training', detail: 'Standard supervised learning setup -- AdamW optimizer, learning rate 1 x 10^&#123;-6&#125; to 5 x 10^&#123;-7&#125;, 1--3 epochs over preference data.' },
    { label: 'Reference model', detail: 'Must remain frozen throughout training. The reference log-probabilities are typically precomputed and cached to save memory.' },
    { label: 'Offline limitation', detail: 'DPO trains on a fixed preference dataset. It cannot explore -- if the preference data does not cover a region of the output space, DPO cannot learn about it.' },
    { label: 'Distribution shift', detail: 'Because preferences were collected under a different policy (the SFT model), DPO faces an offline/off-policy learning challenge. As _ diverges from _&#123;SFT&#125;, the preference data becomes less informative.' },
    { label: 'Label noise sensitivity', detail: 'DPO is more sensitive to noisy preference labels than PPO because it optimizes directly on individual pairs without the smoothing effect of a reward model trained on the full dataset.' },
];

export default function ExplorerRLDpoAsImplicitRl() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          DPO as Implicit RL \u2014 Key Details Explorer
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
