import { useState } from 'react';

const DETAILS = [
    { label: 'Single-agent ceiling', detail: 'In practice, 70-80% of tasks that teams initially design as multi-agent can be handled by a well-designed single agent with the right model, tools, and prompts.' },
    { label: 'Coordination overhead target', detail: 'Below 15% of total token usage. Alert at 30%.' },
    { label: 'Agent count guideline', detail: 'Most justified multi-agent systems use 2-4 agents. Systems with 5+ agents should be scrutinized for premature decomposition. Systems with 10+ agents are almost always overengineered.' },
    { label: 'Handoff latency', detail: 'Each agent-to-agent handoff adds 100-500ms plus the receiving agent\'s first LLM call. Budget 0.5-2 seconds per handoff in latency calculations.' },
    { label: 'Context reconstruction cost', detail: 'When Agent B needs to understand Agent A\'s work, expect 500-2000 tokens of context reconstruction per handoff. This is context that would be free in a single-agent system.' },
    { label: 'Failure attribution', detail: 'In multi-agent systems, 30-50% of failures are caused by coordination issues (miscommunication, wrong routing, context loss), not by individual agent capability. Track coordination failures separately.' },
];

export default function ExplorerADPMultiAgentDecisionFramework() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Multi-Agent Decision Framework — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of multi-agent decision framework.
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
