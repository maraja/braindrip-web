import { useState } from 'react';

const DETAILS = [
    { label: 'Guardrail latency', detail: 'Each guardrail layer adds processing time. Input guards typically add 50-200ms (classifier inference). Output guards add 100-500ms (LLM-based evaluation is slowest). Action guards add 10-50ms (rule-based checks). Total guardrail overhead should be monitored and optimized to stay within latency budgets.' },
    { label: 'False positive rates', detail: 'Overly aggressive guardrails block legitimate requests (false positives). A false positive rate above 2-3% significantly degrades user experience. Guard sensitivity must be calibrated against a test set of both benign and adversarial inputs.' },
    { label: 'Guardrail bypass', detail: 'Determined attackers probe for guardrail weaknesses. Regular red-teaming and adversarial testing identify bypasses. Guardrails should be updated in response to new attack techniques, similar to antivirus signature updates.' },
    { label: 'Async vs sync execution', detail: 'Input and action guards must run synchronously (blocking execution until cleared). Output guards can sometimes run asynchronously (streaming the response while checking in parallel, with the ability to truncate if a violation is detected mid-stream).' },
    { label: 'Custom validators', detail: 'Application-specific guardrails (e.g., \"never recommend competitor products,\" \"always include safety disclaimers for medical information\") are implemented as custom validators that plug into the guardrail framework.' },
    { label: 'Guardrail observability', detail: 'All guardrail decisions (pass, block, warn) should be logged with the trigger reason. Dashboards showing block rates, trigger reasons, and trends help identify emerging issues and calibrate sensitivity.' },
];

export default function ExplorerAACAgentGuardrails() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent Guardrails — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of agent guardrails.
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
