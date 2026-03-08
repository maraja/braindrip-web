import { useState } from 'react';

const DETAILS = [
    { label: 'Implicit vs explicit models', detail: 'Most LLM agents maintain implicit world models within their context window (the accumulated conversation history IS the model). Explicit models use structured data stores that are updated programmatically' },
    { label: 'Model fidelity', detail: 'LLM world models are approximate; they can lose track of state details over long conversations. Explicit state tracking (e.g., maintaining a file modification log) improves fidelity at the cost of implementation complexity' },
    { label: 'Simulation accuracy', detail: 'Mental simulation is only as accurate as the world model. For well-understood domains (file operations, API calls), accuracy is high. For poorly understood domains (complex code interactions, user preferences), accuracy degrades' },
    { label: 'Context cost', detail: 'Maintaining a world model state summary in the context window costs 200-1000 tokens per update. For long tasks, this overhead is justified by the reduction in errors and wasted actions' },
    { label: 'Stale state', detail: 'The world model can become stale if the environment changes outside the agent\'s actions (another process modifies a file, a database is updated). Periodic state refresh is necessary for long-running agents' },
    { label: 'Model scope', detail: 'The world model should represent only task-relevant state. Attempting to model the entire environment is infeasible and unnecessary. The agent should track what matters for the current task' },
];

export default function ExplorerAACWorldModels() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          World Models \u2014 Key Details Explorer
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
