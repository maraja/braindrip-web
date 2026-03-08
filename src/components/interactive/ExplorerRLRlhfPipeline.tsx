import { useState } from 'react';

const DETAILS = [
    { label: 'Scale of human data', detail: 'InstructGPT used ~13K demonstrations for SFT and ~33K comparisons for reward modeling -- tiny relative to pretraining data (hundreds of billions of tokens).' },
    { label: 'KL coefficient', detail: 'Typical  values range from 0.01 to 0.2. Too low leads to reward hacking; too high prevents meaningful optimization.' },
    { label: 'Four models in memory', detail: 'During PPO, four models must be loaded simultaneously: the active policy _, the reference policy _&#123;SFT&#125; (for KL computation), the reward model r_, and the value function V_.' },
    { label: 'Reward model size', detail: 'InstructGPT used a 6B reward model. Larger reward models generally produce better alignment, but with diminishing returns beyond the policy model\'s size.' },
    { label: 'Training instability', detail: 'RLHF with PPO is notoriously sensitive to hyperparameters. Learning rates of 1 x 10^&#123;-6&#125; to 5 x 10^&#123;-6&#125; are common, far lower than standard supervised training.' },
    { label: 'Reward hacking', detail: 'Without the KL penalty, models quickly learn to exploit reward model weaknesses -- generating verbose, sycophantic, or formulaic responses that score highly but are not genuinely better.' },
];

export default function ExplorerRLRlhfPipeline() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          RLHF Pipeline \u2014 Key Details Explorer
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
