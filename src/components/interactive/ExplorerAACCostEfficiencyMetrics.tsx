import { useState } from 'react';

const DETAILS = [
    { label: 'Cost components', detail: 'Total cost = LLM inference cost (tokens x price per token) + tool execution cost (API calls, compute) + infrastructure cost (hosting, storage) + retrieval cost (embedding computation, vector DB queries). LLM inference typically dominates (60-90% of total cost).' },
    { label: 'Token price tracking', detail: 'Model providers change pricing frequently. Cost tracking systems should use real-time pricing or configurable price tables. Include both input and output token prices, which often differ significantly (output tokens typically cost 3-4x more than input tokens).' },
    { label: 'Cost attribution', detail: 'For multi-step agent tasks, attribute costs to each step. This reveals which steps are most expensive and where optimization effort should focus. Common finding: context-heavy steps (large prompts with retrieved documents) are often the biggest cost drivers.' },
    { label: 'Retry economics', detail: 'The expected cost with retries is: cost_per_attempt / success_probability_per_attempt (for independent attempts). If retries are not independent (the agent adapts its approach), the math is more complex. Track actual retry costs rather than relying on theoretical models.' },
    { label: 'Caching for cost reduction', detail: 'Prompt caching (reusing prefixes across calls) and result caching (storing outputs for repeated queries) can reduce costs by 30-60% on workloads with repetitive patterns. Track cache hit rates as a cost-efficiency metric.' },
    { label: 'Dollar-cost averaging', detail: 'For production systems, track the rolling average cost per task over time windows (hourly, daily, weekly). This smooths out variance from individual expensive tasks and reveals cost trends.' },
];

export default function ExplorerAACCostEfficiencyMetrics() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Cost-Efficiency Metrics \u2014 Key Details Explorer
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
