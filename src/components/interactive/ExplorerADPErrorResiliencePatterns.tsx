import { useState } from 'react';

const DETAILS = [
    { label: 'Structured output modes', detail: 'reduce malformation rates from 5-15% (prompt-only) to below 0.5% (constrained decoding). Always use them when available.' },
    { label: 'Retry budgets', detail: 'should be capped at 2-3 retries per tool call with exponential backoff starting at 1 second. Beyond 3 retries, switch to fallback.' },
    { label: 'Checkpoint storage', detail: 'adds 50-200ms overhead per checkpoint write. For most agent tasks, 3-5 checkpoints are sufficient. Store in-memory for short tasks, persist to disk/database for tasks over 60 seconds.' },
    { label: 'Idempotency keys', detail: 'should be generated deterministically from the task ID and step number, not randomly, so that retries produce the same key.' },
    { label: 'Timeout defaults', detail: '5 seconds for synchronous tool calls, 30 seconds for LLM calls, 300 seconds for total task execution. Adjust based on measured P95 latencies.' },
    { label: 'Blast radius metrics', detail: 'Track the failure cascade ratio -- when one component fails, how many other components are affected? Target ratio is 1.0 (no cascade). Alert if it exceeds 1.5.' },
];

export default function ExplorerADPErrorResiliencePatterns() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Error Resilience Patterns — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of error resilience patterns.
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
