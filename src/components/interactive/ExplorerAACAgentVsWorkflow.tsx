import { useState } from 'react';

const DETAILS = [
    { label: 'Token efficiency ratio', detail: 'Workflows use 3-10x fewer tokens than agents for equivalent tasks with well-defined steps, because the LLM does not need to reason about orchestration.' },
    { label: 'Latency comparison', detail: 'A three-step workflow with parallel execution completes in the time of the slowest step (1-3 seconds). An agent taking 3 steps sequentially takes 3-10 seconds due to serial LLM calls.' },
    { label: 'Failure modes differ fundamentally', detail: 'Workflows fail predictably (step X returned error Y). Agents fail unpredictably (the LLM chose a suboptimal strategy, hallucinated a file path, or got stuck in a retry loop). Workflow failures are easier to diagnose and fix.' },
    { label: 'Workflow execution frameworks', detail: 'LangGraph (graph-based orchestration), Prefect/Airflow (data pipeline orchestration), Temporal (durable workflow execution), and custom code. Agent frameworks: Claude Agent SDK, OpenAI Assistants API, LangGraph (agent mode), CrewAI.' },
    { label: 'Testing approaches differ', detail: 'Workflows can be unit-tested step by step with mocked inputs and expected outputs. Agents require evaluation suites with diverse test cases and scoring rubrics, similar to testing a human employee.' },
    { label: 'Maintenance burden', detail: 'Workflows require maintenance when requirements change (new branches, new steps). Agents adapt to requirement changes via system prompt updates — cheaper to modify but harder to verify.' },
];

export default function ExplorerAACAgentVsWorkflow() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent vs. Workflow \u2014 Key Details Explorer
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
