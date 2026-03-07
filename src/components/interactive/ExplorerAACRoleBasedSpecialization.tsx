import { useState } from 'react';

const DETAILS = [
    { label: 'Prompt length for roles', detail: 'Effective role prompts are typically 200-500 tokens. Shorter prompts underspecify; longer prompts dilute focus. Include the most important behavioral guidance first, as LLMs weight early context more heavily.' },
    { label: 'Model selection per role', detail: 'Match model capability to role complexity. Simple roles (data formatting, basic search) can use smaller, cheaper models (GPT-4o-mini, Haiku). Complex roles (architectural decisions, nuanced analysis) benefit from larger models (GPT-4, Opus). This mixed-model strategy reduces cost by 40-60% compared to using the largest model for all roles.' },
    { label: 'Tool scoping by role', detail: 'A researcher with access to code execution tools may waste time writing scripts instead of searching. A coder with web search may spend time browsing instead of coding. Restricting tools to role-relevant ones keeps agents focused.' },
    { label: 'Role vs. agent instance', detail: 'A role is a configuration template; an agent is a running instance of that template. Multiple instances of the same role can exist (e.g., three parallel researcher agents investigating different subtopics).' },
    { label: 'Persona stability', detail: 'LLMs can \"drift\" from their assigned persona during long interactions. Reinforcing the role in each message or using periodic role-reminder injections helps maintain consistency.' },
    { label: 'Inter-role interfaces', detail: 'Define what each role produces and what each role consumes. A researcher produces \"structured findings with sources\"; a writer consumes \"research findings\" and produces \"draft document.\" Clear interfaces reduce integration friction.' },
];

export default function ExplorerAACRoleBasedSpecialization() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Role-Based Specialization — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of role-based specialization.
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
