import { useState } from 'react';

const DETAILS = [
    { label: 'Spawning vs. routing', detail: 'Some systems spawn new agent instances for each subtask (fresh context, full isolation). Others route to pre-configured agent types (faster startup, shared configuration). Spawning is more flexible; routing is more efficient.' },
    { label: 'Token budget allocation', detail: 'The manager should allocate token budgets to sub-agents based on subtask complexity. A simple lookup task gets a small budget; a complex analysis task gets more. This prevents sub-agents from rambling or the overall system from exceeding cost limits.' },
    { label: 'Error propagation', detail: 'When a sub-agent fails, the manager must decide: retry with adjusted instructions, assign to a different agent, skip the subtask, or escalate to the user. Robust delegation includes failure handling at the manager level.' },
    { label: 'Delegation depth limits', detail: 'Recursive delegation should have a maximum depth (typically 2-3 levels). Deeper hierarchies increase latency, cost, and the risk of goal drift (each level slightly misinterpreting the original task).' },
    { label: 'Sub-agent result format', detail: 'Specifying the expected output format for sub-agents (structured JSON, markdown template, specific sections) makes synthesis easier and reduces manager reasoning load.' },
    { label: 'Tool scoping', detail: 'Sub-agents should receive only the tools relevant to their task. A research agent does not need code execution; a coding agent does not need email tools. Reduced tool sets improve selection accuracy and reduce risk.' },
];

export default function ExplorerAACAgentDelegation() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent Delegation — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of agent delegation.
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
