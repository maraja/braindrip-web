import { useState } from 'react';

const DETAILS = [
    { label: 'Cost overhead', detail: 'Meta-prompting adds the cost of the meta-layer call(s). For a single meta-prompt generation, this is 1x additional cost. For iterative optimization with 5-10 rounds, the total cost during optimization can be 10-50x a single call, though the optimized prompt is then reused across many executions.' },
    { label: 'Optimization convergence', detail: 'Iterative prompt optimization typically converges within 5-15 rounds on well-defined tasks, with the majority of improvement in the first 3-5 rounds.' },
    { label: 'Model asymmetry', detail: 'Using a stronger model for the meta-layer and a cheaper model for execution is cost-effective. The meta-layer runs once (or occasionally), while the execution layer runs on every user request.' },
    { label: 'Evaluation requirement', detail: 'Meta-prompting optimization requires an evaluation function (automated metrics or LLM-as-judge) to measure prompt quality. Without evaluation, the system cannot determine if generated prompts are better or worse.' },
    { label: 'Prompt diversity', detail: 'Meta-prompting at high temperature (0.7-1.0) generates more diverse prompt candidates; at low temperature (0-0.3), it generates more conservative refinements. The optimal strategy depends on whether exploration or exploitation is needed.' },
    { label: 'Generated prompt quality', detail: 'LLM-generated prompts are not always better than human-crafted ones. Meta-prompting works best when combined with human review, especially for safety-critical applications where a generated prompt might inadvertently remove important constraints.' },
];

export default function ExplorerPEMetaPrompting() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Meta-Prompting — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of meta-prompting.
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
