import { useState } from 'react';

const DETAILS = [
    { label: 'LLM inference optimization', detail: 'The largest latency contributor. Optimizations include: prompt caching (reuse common prefixes, saving 50-80% of input processing time), model selection (smaller models for simpler sub-tasks), speculative decoding (use a small model to draft tokens, large model to verify), and batching (process multiple requests simultaneously for higher throughput).' },
    { label: 'Streaming architecture', detail: 'Implement server-sent events (SSE) or WebSocket connections that stream agent output progressively. Show reasoning traces as they happen, tool call results as they return, and final responses token by token. This transforms a 60-second wait into a 60-second engagement.' },
    { label: 'Async tool execution', detail: 'Tool calls that do not depend on each other should execute asynchronously in parallel. Use a tool execution pool that dispatches independent calls simultaneously and aggregates results.' },
    { label: 'Latency budgets', detail: 'Allocate time budgets to each agent phase: 5 seconds for planning, 10 seconds for retrieval, 30 seconds for execution, 5 seconds for synthesis. If a phase exceeds its budget, the agent adapts (simpler plan, fewer retrievals, early termination).' },
    { label: 'P50/P95/P99 tracking', detail: 'Average latency hides tail latency. Track percentile latencies: P50 (median), P95 (1 in 20 requests), P99 (1 in 100 requests). Tail latency often comes from retry cascades, tool timeouts, or unusually complex reasoning. P95 and P99 are what users remember.' },
    { label: 'Cold start vs warm', detail: 'First requests after agent initialization may be significantly slower (model loading, cache population, connection establishment). Track cold-start latency separately and implement warm-up strategies.' },
];

export default function ExplorerAACLatencyAndPerformance() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Latency and Performance — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of latency and performance.
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
