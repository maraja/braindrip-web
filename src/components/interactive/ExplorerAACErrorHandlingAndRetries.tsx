import { useState } from 'react';

const DETAILS = [
    { label: 'The `tenacity` library', detail: 'in Python provides configurable retry decorators with exponential backoff, jitter, retry conditions, and stop conditions out of the box' },
    { label: 'LLM-specific retries', detail: 'should handle both API errors (rate limits, timeouts) and semantic errors (malformed tool calls, invalid JSON output) -- the latter require re-prompting, not just re-calling' },
    { label: 'Idempotency', detail: 'is essential for safe retries: if a tool call has side effects (sending an email, creating a file), retrying after an ambiguous failure risks duplicate execution. Use idempotency keys where available.' },
    { label: 'Error budgets', detail: 'set a maximum acceptable failure rate (e.g., 1% of tasks may fail completely). When the error budget is exceeded, the system pauses to investigate rather than continuing to fail.' },
    { label: 'Timeout hierarchies', detail: 'individual tool calls might timeout at 30 seconds, individual steps at 2 minutes, and the overall task at 30 minutes. Each level has its own handling logic.' },
    { label: 'Structured error responses', detail: 'from tools should include error type, a human-readable message, and whether the error is retryable, enabling automated classification' },
];

export default function ExplorerAACErrorHandlingAndRetries() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Error Handling and Retries — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of error handling and retries.
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
