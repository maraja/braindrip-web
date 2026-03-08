import { useState } from 'react';

const DETAILS = [
    { label: 'Hierarchical limits', detail: 'Limits can be hierarchical: a per-step token limit (max 4,000 tokens per LLM call), a per-task limit (max 200,000 tokens total), and a per-user daily limit (max 2,000,000 tokens per day). Each level catches different failure modes.' },
    { label: 'Limit enforcement points', detail: 'Limits are enforced in the agent loop controller, not by the LLM itself. Before each LLM call or tool invocation, the controller checks remaining budget. If insufficient budget remains, it either forces a summary/completion step or halts execution.' },
    { label: 'Budget allocation within tasks', detail: 'Sophisticated agents allocate their budget across subtasks. A research task with a 200,000-token budget might allocate 50,000 to retrieval, 100,000 to analysis, and 50,000 to synthesis. If retrieval consumes more than its allocation, the agent must reduce analysis or synthesis.' },
    { label: 'Circuit breaker patterns', detail: 'If the agent fails N consecutive steps (e.g., 3 tool call errors in a row), a circuit breaker halts execution before the full budget is consumed. This catches fast-failing scenarios where continuing is futile.' },
    { label: 'Limit configuration', detail: 'Limits should be configurable per task type, user tier, and deployment environment. Development environments might have tighter limits (catch issues early); production environments scale limits based on task complexity and user subscription level.' },
    { label: 'Pre-flight estimation', detail: 'Before starting execution, the agent can estimate required resources based on task complexity. If the estimate exceeds available limits, the agent informs the user upfront rather than starting and failing mid-task.' },
];

export default function ExplorerAACResourceLimits() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Resource Limits \u2014 Key Details Explorer
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
