import { useState } from 'react';

const DETAILS = [
    { label: 'Instruction delimiter hardening', detail: 'Use unique, non-guessable delimiters between system instructions, user input, and retrieved content. Random tokens or hashed delimiters are harder for attackers to guess and close/reopen than standard XML tags or markdown formatting.' },
    { label: 'Dual-LLM architecture', detail: 'Use a separate, restricted LLM instance (the \"quarantine\" model) to process untrusted content. This model extracts relevant facts and returns structured data to the main agent, never passing raw untrusted text through. The quarantine model has no tool access and cannot take actions.' },
    { label: 'Canary tokens', detail: 'Include hidden canary values in system prompts. If these values appear in the agent\'s output, it indicates the system prompt has been leaked through injection, triggering an immediate alert and session termination.' },
    { label: 'Injection classifier accuracy', detail: 'State-of-the-art injection classifiers achieve 90-95% detection on known attack patterns but 60-80% on novel attacks. This gap is why classifiers must be one layer among many, not the sole defense.' },
    { label: 'Spotlighting', detail: 'A technique where retrieved content is transformed to reduce its instruction-following potential -- for example, by adding random characters between words, converting to a representation that preserves meaning but breaks instruction patterns, or encoding content in a format the model reads as data rather than instructions.' },
    { label: 'Behavioral invariant checks', detail: 'After the agent proposes an action, verify that the action is consistent with the original user request and the agent\'s defined capabilities. An agent asked \"summarize this document\" should not propose \"send email to external-address@domain.com.\"' },
];

export default function ExplorerAACPromptInjectionDefense() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Prompt Injection Defense — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of prompt injection defense.
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
