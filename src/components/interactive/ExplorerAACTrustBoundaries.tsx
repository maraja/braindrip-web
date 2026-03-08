import { useState } from 'react';

const DETAILS = [
    { label: 'Prompt architecture', detail: 'Trust levels are reflected in prompt structure. System instructions go in the system message (highest priority). User input goes in the user message. Retrieved content goes in clearly delimited sections with explicit labels like "The following is retrieved content from external sources.' },
    { label: 'Trust markers in context', detail: 'Each piece of information in the agent\'s context carries a trust-level tag. These tags are maintained through the agent\'s reasoning process, so when the agent cites a fact, the trust level of its source propagates to the citation.' },
    { label: 'Escalation on trust conflicts', detail: 'When information from different trust levels conflicts, the agent follows a clear protocol: prefer higher-trust sources, flag the conflict to the user, and never allow low-trust information to override high-trust constraints.' },
    { label: 'Trust for multi-agent systems', detail: 'When agents communicate with other agents, trust levels depend on the architecture. Agents within the same trusted deployment inherit their deployment\'s trust level. External agents are treated as low-trust sources, similar to retrieved documents.' },
    { label: 'Trust decay over time', detail: 'Information that was high-trust when first ingested (e.g., an internal policy document) may become less trustworthy over time as it becomes potentially outdated. Trust levels should incorporate a temporal dimension.' },
    { label: 'Explicit trust violations', detail: 'The agent should log and alert when it detects that low-trust content appears to be attempting to override high-trust instructions. These events are security-relevant and should trigger investigation.' },
];

export default function ExplorerAACTrustBoundaries() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Trust Boundaries \u2014 Key Details Explorer
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
