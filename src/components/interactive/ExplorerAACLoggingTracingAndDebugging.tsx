import { useState } from 'react';

const DETAILS = [
    { label: 'LangSmith', detail: 'stores traces as hierarchical run trees with parent-child relationships, supports filtering by metadata, latency, token count, and error status, and enables annotation for human evaluation' },
    { label: 'OpenTelemetry (OTel) integration', detail: 'uses the `gen_ai` semantic conventions for LLM spans, capturing `gen_ai.system`, `gen_ai.request.model`, `gen_ai.usage.prompt_tokens`, and similar attributes' },
    { label: 'Trace sampling', detail: 'is necessary at scale: logging every trace for an agent handling 10,000 requests/day is expensive. Sample 100% of errors, 10% of successes, and 100% of slow requests (above a latency threshold)' },
    { label: 'PII redaction', detail: 'must be applied to traces before storage: user messages, tool outputs, and LLM responses often contain personal information that must be masked or removed for compliance' },
    { label: 'Cost attribution', detail: 'tags each trace span with its token cost, enabling per-task, per-step, and per-model cost breakdowns across the agent fleet' },
    { label: 'Correlation IDs', detail: 'link traces across services: if an agent calls an external API, the correlation ID connects the agent trace to the API\'s server-side trace, enabling end-to-end debugging' },
];

export default function ExplorerAACLoggingTracingAndDebugging() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Logging, Tracing, and Debugging — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of logging, tracing, and debugging.
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
