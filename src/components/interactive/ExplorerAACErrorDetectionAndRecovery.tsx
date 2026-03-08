import { useState } from 'react';

const DETAILS = [
    { label: 'Retry success rate', detail: 'Transient errors (rate limits, timeouts) resolve on retry 70-90% of the time with appropriate backoff; semantic errors resolve on rephrase-and-retry 40-60% of the time' },
    { label: 'Detection cost', detail: 'Explicit error detection is essentially free (status code check). Semantic error detection costs one additional LLM call per action (~200-500 tokens). Logical error detection via self-critique costs ~500-1000 tokens' },
    { label: 'Common failure pattern', detail: 'The agent enters a "retry loop" where it retries the same failing action with minimal variation. Mitigation: require meaningful modification between retries and enforce retry limits' },
    { label: 'Stuck detection heuristic', detail: 'If the last 3 actions produced similar observations and no progress metric improved, the agent is stuck. Trigger replanning' },
    { label: 'Error logging', detail: 'All errors should be logged with: timestamp, action attempted, error type, error message, recovery strategy applied, recovery outcome. This data is essential for improving agent reliability over time' },
    { label: 'Graceful degradation', detail: 'Design agents so that partial failure produces partial (but still useful) results rather than total failure. If 7 of 8 research queries succeed, deliver the 7 results rather than failing the entire task' },
];

export default function ExplorerAACErrorDetectionAndRecovery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Error Detection and Recovery \u2014 Key Details Explorer
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
