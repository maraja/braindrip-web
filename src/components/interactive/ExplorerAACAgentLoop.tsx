import { useState } from 'react';

const DETAILS = [
    { label: 'Typical loop iterations per task', detail: 'Simple tasks complete in 3-8 iterations. Moderate tasks require 10-30. Complex tasks (multi-file refactoring, debugging) may require 50-150 iterations.' },
    { label: 'Latency per iteration', detail: 'Each iteration takes 1-10 seconds depending on LLM inference time (0.5-5s) plus tool execution time (0.1-5s). A 30-iteration task takes roughly 1-5 minutes wall-clock time.' },
    { label: 'Token cost growth', detail: 'Context grows roughly linearly with iterations. At ~2,000 tokens per iteration, a 50-iteration task consumes approximately 50 * 50,000 = 2.5M total tokens (summing each turn\'s full context), costing 5-25 at typical API rates.' },
    { label: 'Parallel tool calls', detail: 'Some frameworks support executing multiple tool calls within a single iteration, reducing total loop count. For example, reading 5 files in parallel rather than sequentially cuts 5 iterations to 1.' },
    { label: 'Max step defaults', detail: 'Claude Code uses dynamic limits based on subscription tier. Cursor defaults to around 25 tool calls per interaction. LangGraph allows custom configuration.' },
    { label: 'Context window pressure', detail: 'At 128K tokens, an agent has roughly 40-80 iterations before context management becomes necessary (assuming 1,500-3,000 tokens per iteration).' },
];

export default function ExplorerAACAgentLoop() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          The Agent Loop \u2014 Key Details Explorer
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
