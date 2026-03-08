import { useState } from 'react';

const DETAILS = [
    { label: 'Reflexion paper results', detail: '91% pass@1 on HumanEval (vs 80% baseline), 77% on HotpotQA (vs 57% baseline), 75% on AlfWorld (vs 22% baseline) over 3-5 attempts' },
    { label: 'Maximum useful attempts', detail: 'Performance typically plateaus after 3-5 attempts; beyond that, reflections become repetitive or contradictory' },
    { label: 'Reflection prompt template', detail: '"You are an expert analyst. The previous attempt at [task] failed. Trajectory: [trajectory]. Score: [score]. Analyze what went wrong and provide 2-3 specific, actionable suggestions for the next attempt."' },
    { label: 'Memory management', detail: 'Store only the most recent 3-5 reflections to avoid context window overflow; older reflections can be summarized' },
    { label: 'Cost of reflection', detail: 'Each reflection adds ~300-800 tokens to context; each retry costs the full execution cost. Total cost for 3 attempts is roughly 3x single attempt + reflection overhead' },
    { label: 'Evaluator quality matters', detail: 'Reflection is only as good as the evaluator\'s signal. A binary pass/fail evaluator produces less useful reflections than a detailed rubric-based evaluator' },
];

export default function ExplorerAACReflectionAndSelfCritique() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Reflection and Self-Critique \u2014 Key Details Explorer
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
