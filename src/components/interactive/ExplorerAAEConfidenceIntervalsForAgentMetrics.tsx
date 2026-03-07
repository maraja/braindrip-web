import { useState } from 'react';

const DETAILS = [
    { label: 'Wilson vs Wald', detail: 'Always prefer Wilson for binary metrics. The Wald interval has actual coverage as low as 85% when nominal is 95%, especially for $n < 100$ or $p > 0.9$.' },
    { label: 'Bootstrap sample count', detail: 'Use $B \\geq 10{,}000$ for publication-quality CIs. For quick iteration, $B = 2{,}000$ is acceptable.' },
    { label: 'Simultaneous CIs', detail: 'When reporting CIs for $k$ metrics simultaneously, apply the Bonferroni correction ($\\alpha\' = \\alpha/k$) or use Scheffe\'s method to maintain family-wise coverage.' },
    { label: 'Clustered data', detail: 'If runs within a task are correlated, use cluster-robust standard errors: $\\text{SE}_{\\text{cluster}} = \\text{SE}_{\\text{naive}} \\times \\sqrt{D}$ where $D = 1 + (m-1)\\hat{\\rho}$ is the design effect.' },
    { label: 'Reporting format', detail: 'Always report: metric name, point estimate, CI bounds, confidence level, sample size, and CI method. Example: \"Success rate: 72.0% [67.8%, 76.2%] (95% Wilson CI, $n = 200$).\"' },
];

export default function ExplorerAAEConfidenceIntervalsForAgentMetrics() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Confidence Intervals for Agent Metrics — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of confidence intervals for agent metrics.
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
