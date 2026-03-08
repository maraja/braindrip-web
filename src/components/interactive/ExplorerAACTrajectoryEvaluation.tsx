import { useState } from 'react';

const DETAILS = [
    { label: 'Trajectory annotation schema', detail: 'Each step is annotated with: step type (reasoning, tool_call, observation), relevance score (0-1), correctness score (0-1), necessity score (was this step needed), and a brief justification. Aggregate metrics are computed over these per-step annotations.' },
    { label: 'Automated trajectory evaluation', detail: 'LLM-based evaluators score trajectories by processing the full action log with evaluation criteria. The evaluator prompt provides the task description, the complete trajectory, and a rubric. The evaluator scores each step and provides an overall trajectory quality rating.' },
    { label: 'Reference trajectories', detail: 'For well-defined tasks, expert-created reference trajectories define the "ideal" action sequence. Agent trajectories are compared against references using edit distance (how many steps differ), order correlation (are steps in the right sequence), and coverage (did the agent hit all key steps).' },
    { label: 'Trajectory complexity normalization', detail: 'Harder tasks naturally require more steps. Efficiency metrics should be normalized by task complexity to avoid penalizing agents for taking more steps on harder tasks. Complexity can be estimated by expert annotation or by the number of sub-goals in the task.' },
    { label: 'Real-time trajectory monitoring', detail: 'In production, trajectory evaluation can run in real-time, flagging unusual patterns (excessive steps, repeated failures, unusual tool usage) for human review. This provides an early warning system for agent malfunction.' },
    { label: 'Process reward model training', detail: 'Training a model specifically to evaluate trajectory quality (a process reward model) provides faster, cheaper evaluation than using a general-purpose LLM judge. Process reward models are trained on human-annotated trajectory datasets.' },
];

export default function ExplorerAACTrajectoryEvaluation() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Trajectory Evaluation \u2014 Key Details Explorer
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
