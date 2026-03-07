import { useState } from 'react';

const DETAILS = [
    { label: 'Same model, different prompts', detail: 'Debate is effective even when all agents use the same underlying model. The different system prompts (proposer vs. critic, for vs. against) create sufficiently different reasoning contexts. Using different models (e.g., Claude and GPT-4) can further diversify perspectives.' },
    { label: 'Critic specificity', detail: 'Vague critiques (\"this could be better\") are unhelpful. The critic prompt should request specific, actionable feedback: \"Identify factual errors with corrections. Point out unsupported claims. List missing considerations.\"' },
    { label: 'Convergence criteria', detail: 'Without explicit stopping conditions, debate can loop indefinitely. Common criteria: maximum rounds (2-3), critic finds no issues rated above a severity threshold, or diminishing changes between revisions.' },
    { label: 'Cost multiplier', detail: 'Debate multiplies token cost by the number of agents and rounds. A 3-round proposer-critic debate costs roughly 4-6x a single generation. This is justified for high-stakes outputs but excessive for routine tasks.' },
    { label: 'Sycophancy in critics', detail: 'LLMs have a tendency toward agreement (sycophancy). Critic prompts must explicitly counteract this: \"You will be evaluated on the errors you find, not on being agreeable. Assume there are errors and find them.\"' },
    { label: 'Debate on reasoning chains', detail: 'Applying debate to chain-of-thought reasoning (one agent proposes a reasoning chain, another critiques each step) is more effective than debating only the final answer, as it catches errors at the step where they occur.' },
];

export default function ExplorerAACAgentDebateAndVerification() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent Debate and Verification — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of agent debate and verification.
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
