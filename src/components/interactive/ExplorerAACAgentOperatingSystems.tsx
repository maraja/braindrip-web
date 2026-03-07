import { useState } from 'react';

const DETAILS = [
    { label: 'AIOS architecture', detail: 'places an \"LLM Kernel\" between agents and the LLM provider, managing context, scheduling, and memory. The kernel exposes system calls: `agent_create()`, `agent_schedule()`, `memory_read()`, `memory_write()`, `tool_call()`' },
    { label: 'Context management', detail: 'in AIOS snapshots and restores agent context windows when switching between agents, similar to how an OS saves/restores CPU registers during a context switch. This enables time-sharing of a single LLM across multiple agents' },
    { label: 'Tool conflict resolution', detail: 'uses locking mechanisms analogous to file locks: an agent acquires a lock on a resource (file, database record, API endpoint), performs its operation, and releases the lock. Deadlock detection prevents agents from waiting on each other indefinitely' },
    { label: 'Inter-agent communication', detail: 'can use message passing (agents send typed messages through an OS-managed bus), shared memory (agents read/write to a common knowledge store), or event broadcasting (an agent publishes an event that interested agents subscribe to)' },
    { label: 'Resource quotas', detail: 'limit per-agent resource consumption: maximum tokens per minute, maximum tool calls per minute, maximum memory store size. Quotas prevent a single runaway agent from consuming all system resources' },
    { label: 'Agent isolation', detail: 'ensures that one agent\'s failure does not crash other agents. Each agent runs in its own execution context with separate state, and failures are caught and handled by the OS rather than propagating to other agents' },
];

export default function ExplorerAACAgentOperatingSystems() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent Operating Systems — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of agent operating systems.
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
