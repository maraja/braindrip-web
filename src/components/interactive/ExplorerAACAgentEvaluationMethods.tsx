import { useState } from 'react';

const DETAILS = [
    { label: 'Evaluation dimensions', detail: 'A complete agent evaluation covers: task success (binary), output quality (graded), efficiency (steps taken, tokens consumed), reliability (variance across runs), safety (no harmful actions), and cost (dollar cost per task).' },
    { label: 'Statistical significance', detail: 'With non-deterministic agents, report confidence intervals, not just point estimates. A success rate of 80% with n=10 has a 95% CI of [44%, 97%]. Meaningful comparisons between agent versions require sufficient sample sizes (typically 50-100 tasks minimum).' },
    { label: 'Evaluation datasets', detail: 'Curate evaluation datasets with diverse task types, difficulty levels, and edge cases. Include tasks where the agent should refuse (safety evaluation), tasks with ambiguous instructions (alignment evaluation), and multi-step tasks with failure recovery opportunities (robustness evaluation).' },
    { label: 'Contamination concerns', detail: 'If the agent or its underlying model has seen the evaluation tasks during training, performance will be inflated. Use held-out evaluation sets, regularly rotate tasks, and include novel tasks that did not exist during training.' },
    { label: 'Pairwise comparison', detail: 'When comparing two agent versions, pairwise comparison (showing both outputs to an evaluator and asking which is better) is more reliable than independent scoring. This applies to both human and LLM-as-judge evaluation.' },
    { label: 'Evaluation cost model', detail: 'Budget evaluation effort based on the stakes: quick automated checks for development iterations, thorough multi-run evaluation for release candidates, and full human evaluation for major launches.' },
];

export default function ExplorerAACAgentEvaluationMethods() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent Evaluation Methods — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of agent evaluation methods.
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
