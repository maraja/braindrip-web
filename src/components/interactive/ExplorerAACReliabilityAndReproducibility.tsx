import { useState } from 'react';

const DETAILS = [
    { label: 'Confidence intervals', detail: 'Always report confidence intervals with success rates. For n trials with k successes, use the Wilson score interval or Clopper-Pearson interval for small samples. Report 95% CIs as standard practice.' },
    { label: 'Required sample sizes', detail: 'To distinguish between 80% and 90% success rates with 95% confidence, you need approximately 200 runs. To distinguish 95% from 99%, you need approximately 1,000 runs. Plan evaluation budgets accordingly.' },
    { label: 'Stratified reliability', detail: 'Report reliability stratified by task difficulty, task type, and domain. An overall 85% success rate might hide 95% on easy tasks and 60% on hard tasks. Stratified reporting reveals where reliability needs improvement.' },
    { label: 'Temperature and reliability', detail: 'Setting temperature to 0 maximizes determinism but may reduce quality on creative or open-ended tasks. Temperature 0.1-0.3 provides a good balance of consistency and diversity for most agent tasks.' },
    { label: 'Retry-adjusted reliability', detail: 'With automatic retries, effective reliability improves. If per-attempt success rate is p, success rate with up to k retries is 1 - (1-p)^k (assuming independent attempts). Two retries at 80% per-attempt success yield 96% effective reliability.' },
    { label: 'Mean time between failures (MTBF)', detail: 'For production agents, track MTBF as a reliability metric. At 95% success rate with 1,000 requests/day, MTBF is approximately 20 requests (3 minutes at consistent throughput). Present MTBF in addition to percentage rates to make failure frequency concrete.' },
];

export default function ExplorerAACReliabilityAndReproducibility() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Reliability and Reproducibility \u2014 Key Details Explorer
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
