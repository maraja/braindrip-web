import { useState } from 'react';

const DETAILS = [
    { label: 'Minimum agents for discrimination analysis', detail: 'Kendall\'s $\\tau$ requires $K \\geq 5$ agents for a meaningful estimate. With fewer, use pairwise accuracy instead.' },
    { label: 'Item Response Theory (IRT)', detail: 'For sophisticated item analysis, fit a 2-parameter IRT model: $P(\\text{success}_{ij}) = \\frac{1}{1+e^{-a_j(\\theta_i - b_j)}}$ where $a_j$ is discrimination, $b_j$ is difficulty, and $\\theta_i$ is agent ability. Items with $a_j < 0.5$ are poor discriminators.' },
    { label: 'Test-retest reliability', detail: 'Run the same evaluation twice on the same agent. Compute Pearson\'s $r$ between the two score vectors. Target: $r \\geq 0.90$. Lower values indicate excessive evaluation noise (see `variance-decomposition.md`).' },
    { label: 'Contamination detection', detail: 'Check whether benchmark tasks appear in model training data. Use canary strings, membership inference attacks, or verbatim completion tests.' },
    { label: 'Versioned evaluation suites', detail: 'Always version your evaluation suite and log which version produced which results. This enables retrospective meta-analysis when Goodhart effects are suspected.' },
];

export default function ExplorerAAEMetaEvaluation() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Meta-Evaluation — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of meta-evaluation.
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
