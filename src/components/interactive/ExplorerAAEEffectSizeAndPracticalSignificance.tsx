import { useState } from 'react';

const DETAILS = [
    { label: 'Always report both', detail: 'p-values and effect sizes serve complementary functions. A significant result with a tiny effect size is noteworthy for different reasons than a significant result with a large effect size.' },
    { label: 'Effect size CI', detail: 'Report confidence intervals for effect sizes, not just point estimates. For Cohen\'s $h$: $\\text{SE}(h) \\approx \\sqrt{1/n_1 + 1/n_2}$.' },
    { label: 'Equivalence testing (TOST)', detail: 'To actively demonstrate that two agents are equivalent (not just that you failed to detect a difference), use two one-sided tests. Reject $H_0: |\\Delta p| \\geq \\delta$ if both one-sided tests are significant.' },
    { label: 'Non-inferiority margins', detail: 'In many settings, the new agent need not be better -- just not worse by more than $\\delta$. Non-inferiority testing uses $H_0: p_{\\text{new}} \\leq p_{\\text{old}} - \\delta$ and is more appropriate for regression testing than superiority testing.' },
    { label: 'Domain-specific thresholds', detail: 'A 2% improvement on safety metrics may be critically important; a 2% improvement on a convenience metric may be irrelevant. Practical significance thresholds should be metric-specific.' },
];

export default function ExplorerAAEEffectSizeAndPracticalSignificance() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Effect Size and Practical Significance — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of effect size and practical significance.
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
