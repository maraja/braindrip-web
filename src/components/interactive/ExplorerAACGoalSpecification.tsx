import { useState } from 'react';

const DETAILS = [
    { label: 'System prompt token budget', detail: 'Production agent system prompts range from 500 to 8,000 tokens. Claude Code\'s system prompt is approximately 3,000-5,000 tokens. Each additional token of system prompt is consumed on every LLM call, making it a recurring cost.' },
    { label: 'Clarification question rate', detail: 'Well-calibrated agents ask clarifying questions on roughly 10-20% of tasks — enough to catch critical ambiguities without being annoying. Agents that never clarify make assumption errors on 15-25% of ambiguous tasks. Agents that always clarify frustrate users.' },
    { label: 'Goal decomposition depth', detail: 'Simple tasks decompose into 2-5 sub-goals. Complex tasks decompose into 10-20 sub-goals. Very complex tasks (multi-day projects) may have 50+ sub-goals, requiring explicit planning and tracking.' },
    { label: 'Success criteria correlation', detail: 'Tasks with explicit, verifiable success criteria ("all tests pass") have 70-85% completion rates. Tasks with vague success criteria ("make it better") have 40-60% completion rates. The difference is entirely attributable to goal clarity.' },
    { label: 'Instruction following benchmarks', detail: 'Claude 3.5 Sonnet scores 85-92% on IFEval (instruction following evaluation). GPT-4o scores similarly. This means even the best models miss or misinterpret 8-15% of specific instructions, reinforcing the need for verification.' },
    { label: 'Prompt engineering impact', detail: 'Structured prompts (with explicit sections for context, task, constraints, and output format) improve task completion by 15-30% compared to unstructured natural language instructions.' },
];

export default function ExplorerAACGoalSpecification() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Goal Specification \u2014 Key Details Explorer
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
