import { useState } from 'react';

const DETAILS = [
    { label: 'Agent identity', detail: 'Each agent typically has its own system prompt defining its role, capabilities, and behavior. The system prompt is the primary mechanism for differentiation — all agents may use the same underlying model.' },
    { label: 'Communication overhead', detail: 'Each inter-agent message costs tokens. A hierarchy with 3 levels and 5 workers can consume 10-20x more tokens than a single agent doing the same task. Architecture selection must consider cost.' },
    { label: 'Shared vs. isolated context', detail: 'Some architectures share context between agents (blackboard), others pass only specific outputs (pipeline). Shared context enables richer coordination but increases token usage and can introduce confusion.' },
    { label: 'Orchestration frameworks', detail: 'AutoGen (Microsoft) favors conversational multi-agent patterns. CrewAI emphasizes role-based crews. LangGraph provides graph-based orchestration. OpenAI Swarm implements lightweight agent handoffs. Each framework has architectural opinions.' },
    { label: 'Determinism', detail: 'Multi-agent systems are less deterministic than single agents. The interaction of multiple stochastic models amplifies variability. Testing and evaluation become significantly harder.' },
    { label: 'Failure modes', detail: 'Multi-agent systems introduce new failure types: infinite delegation loops, agents talking past each other, contradictory outputs from different agents, and coordination deadlocks.' },
];

export default function ExplorerAACMultiAgentArchitectures() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Multi-Agent Architectures \u2014 Key Details Explorer
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
