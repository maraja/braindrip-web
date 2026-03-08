import { useState } from 'react';

const DETAILS = [
    { label: 'Temperature 0 reproducibility rate', detail: 'With temperature 0 and identical prompts, single LLM calls reproduce the same output roughly 85-95% of the time (varying by provider and model). This drops to 30-60% for full agent task runs of 20+ steps.' },
    { label: 'Seed parameter support', detail: 'OpenAI supports a seed parameter in API calls (introduced late 2023). Anthropic does not expose an explicit seed parameter but uses temperature 0 for maximum consistency. Google\'s Gemini supports temperature 0 but not explicit seeding.' },
    { label: 'Best-of-N effectiveness', detail: 'Running an agent 3 times and selecting the best result (by automated evaluation) improves task completion rates by 10-20% compared to single runs, at 3x the cost. Running 5 times improves by 15-25% at 5x cost.' },
    { label: 'Divergence detection', detail: 'Tools like diff applied to agent logs across runs can identify the first point of divergence. Typically, divergence occurs within the first 5-10 turns for a given task.' },
    { label: 'Latent non-determinism', detail: 'Even when outputs appear identical, internal logits may differ. A model might assign 0.6 probability to a token in one run and 0.59 in another — same output, but a slight change in the prompt could flip the selection.' },
    { label: 'Evaluation metrics for stochastic systems', detail: 'Pass@k (task solved in at least 1 of k attempts) is the standard metric for evaluating stochastic agents. Claude Code\'s SWE-bench results, for example, report the pass@1 rate (single attempt).' },
];

export default function ExplorerAACDeterminismVsStochasticity() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Determinism vs. Stochasticity \u2014 Key Details Explorer
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
