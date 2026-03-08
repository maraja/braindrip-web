import { useState } from 'react';

const DETAILS = [
    { label: 'GPT-2 memorization', detail: 'Carlini et al. (2021) extracted 604 unique memorized training sequences of 256+ tokens from GPT-2 (1.5B parameters) using 600,000 generated samples.' },
    { label: 'Memorization scaling', detail: 'Doubling model parameters increases extractable memorized content by ~1.5x (Carlini et al., 2023).' },
    { label: 'DP-SGD overhead', detail: 'DP training is 2--10x slower than non-private training due to per-example gradient clipping and noise addition. Memory overhead is ~2x because per-example gradients cannot be batched as efficiently.' },
    { label: 'Privacy-utility frontier', detail: 'For BERT fine-tuning on GLUE tasks, epsilon = 8 yields ~3% accuracy loss; epsilon = 1 yields ~10--15% accuracy loss; epsilon = 0.1 is typically impractical.' },
    { label: 'De-identification benchmarks', detail: 'The 2014 i2b2/UTHealth de-identification shared task top system achieved 92.6% strict F1 on PHI entities; modern transformer-based systems achieve 96--98%.' },
    { label: 'Federated learning communication', detail: 'A single round of federated averaging for a 110M parameter BERT model transmits ~440MB per device, making communication compression essential.' },
];

export default function ExplorerNLPPrivacyInNlp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Privacy in NLP \u2014 Key Details Explorer
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
