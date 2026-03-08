import { useState } from 'react';

const DETAILS = [
    { label: 'Anthropic\'s implementation', detail: 'The thinking parameter with budget_tokens controls the thinking budget. Thinking content is returned in a separate thinking content block. Minimum budget is 1,024 tokens; can go up to the full context window minus output tokens.' },
    { label: 'OpenAI\'s implementation', detail: 'The o1 and o3 models use hidden reasoning tokens controlled by reasoning_effort (low/medium/high). Reasoning tokens are billed but not visible to the user. The o3-mini model offers a lower-cost option with reduced reasoning capacity.' },
    { label: 'Cost implications', detail: 'Thinking tokens are billed at the same rate as output tokens. A 10,000-token thinking budget on a hard problem costs as much as 10,000 output tokens, potentially 3-10x the cost of a non-thinking response.' },
    { label: 'Math benchmark gains', detail: 'Extended thinking models (o1, Claude with extended thinking) show 10-30% improvements on AIME and AMC competition math compared to standard models.' },
    { label: 'Code benchmark gains', detail: 'SWE-bench scores improved by 15-25% with extended thinking models compared to standard prompting on the same base models.' },
    { label: 'Diminishing returns', detail: 'Like self-consistency, thinking budget exhibits diminishing returns. Doubling the budget from 5,000 to 10,000 tokens yields much less improvement than doubling from 500 to 1,000 tokens.' },
];

export default function ExplorerPEExtendedThinkingAndThinkingBudgets() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Extended Thinking and Thinking Budgets \u2014 Key Details Explorer
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
