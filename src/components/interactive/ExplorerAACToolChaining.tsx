import { useState } from 'react';

const DETAILS = [
    { label: 'Context window pressure', detail: 'Each tool call\'s output consumes context tokens. A chain of 5 calls with 500-token outputs adds 2,500 tokens of intermediate state. For long chains, agents must summarize or discard earlier results to stay within limits.' },
    { label: 'Parallel vs. sequential execution', detail: 'When chain steps are independent (e.g., looking up weather in three different cities), they can be executed in parallel. The LLM can request multiple tool calls in a single turn. Dependencies must be sequential.' },
    { label: 'Intermediate state visibility', detail: 'The user typically sees only the final result, but developers need visibility into intermediate states for debugging. Logging each tool call\'s input/output is essential for understanding chain failures.' },
    { label: 'Maximum chain length', detail: 'In practice, LLM-orchestrated chains rarely exceed 5-10 steps before reliability degrades. Longer workflows should be broken into sub-chains or handled by explicit orchestration code rather than LLM reasoning.' },
    { label: 'ReAct pattern', detail: 'The most common chaining pattern is Reason-Act-Observe (ReAct): the LLM reasons about what to do next, calls a tool, observes the result, then reasons again. This loop naturally produces chains of arbitrary length.' },
    { label: 'Backtracking', detail: 'When a chain step fails or produces unexpected results, the agent ideally backtracks — trying an alternative approach rather than proceeding with bad data. Current models handle simple retries but struggle with true backtracking to much earlier steps.' },
];

export default function ExplorerAACToolChaining() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Tool Chaining — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of tool chaining.
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
