import { useState } from 'react';

const DETAILS = [
    { label: 'Trace schema for agents', detail: 'A well-designed trace includes: request_id, user_id, session_id, timestamp, total_duration, total_tokens, total_cost, and a tree of spans. Each span records: span_type (llm_call, tool_call, retrieval, guardrail), input, output, duration, tokens (for LLM spans), status (success/error), and metadata.' },
    { label: 'Sampling strategies', detail: 'High-volume systems cannot store traces for every request. Head-based sampling (decide at request start) stores a percentage (1-10%) of all traces. Tail-based sampling (decide after completion) stores all traces for failed, slow, expensive, or anomalous requests. Tail-based sampling is more useful for debugging but requires buffering complete traces before the sampling decision.' },
    { label: 'LLM-specific metrics', detail: 'Beyond standard application metrics, agent systems track: tokens per request (prompt + completion), model selection distribution (which models are used), cache hit rate (for prompt caching), and reasoning-to-action ratio (thinking tokens vs tool call tokens).' },
    { label: 'Correlation with user outcomes', detail: 'The most valuable monitoring links agent behavior to user outcomes. Correlating trace data with user satisfaction scores, task completion signals, and follow-up queries reveals which agent behaviors predict good or bad outcomes.' },
    { label: 'Retention policies', detail: 'Traces and detailed logs are expensive to store. Typical retention: full traces for 7-30 days, aggregated metrics for 1-2 years, safety-relevant events (guardrail triggers, HITL decisions) for regulatory retention periods (often 5-7 years).' },
    { label: 'Real-time streaming', detail: 'For live debugging and demonstration purposes, real-time trace streaming shows the agent\'s behavior as it happens, similar to watching a live log but structured as a trace tree.' },
];

export default function ExplorerAACMonitoringAndObservability() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Monitoring and Observability — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of monitoring and observability.
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
