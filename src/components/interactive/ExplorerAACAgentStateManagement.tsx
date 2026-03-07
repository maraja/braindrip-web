import { useState } from 'react';

const DETAILS = [
    { label: 'State growth rate', detail: 'Typical agents accumulate 1,500-3,000 tokens of state per loop iteration (assistant message + tool call + tool result). A 50-iteration task accumulates 75,000-150,000 tokens of raw state.' },
    { label: 'Summarization compression ratio', detail: 'LLM-based summarization typically achieves 5:1 to 15:1 compression. A 20,000-token history segment can be summarized to 1,500-4,000 tokens while retaining the key information.' },
    { label: 'Context window utilization thresholds', detail: 'Agent performance begins to degrade when context utilization exceeds 70-80% of the window. At 90%+, the LLM may truncate reasoning, miss instructions, or produce lower-quality output. Proactive context management should trigger at 60-70% utilization.' },
    { label: 'Memory file formats', detail: 'Claude Code uses markdown files (`.claude/CLAUDE.md`, project-level `CLAUDE.md`) for persistent state. These are loaded at session start and typically contain 200-2,000 tokens of project context, conventions, and preferences.' },
    { label: 'State serialization overhead', detail: 'Converting structured state to/from text representation adds 10-20% token overhead compared to the raw information content. JSON is more structured but more verbose than natural language summaries.' },
    { label: 'Working memory capacity', detail: 'Analogous to human working memory limits, LLMs effectively track 5-9 distinct \"items\" in their reasoning. Beyond this, accuracy on any single item degrades. This limits the complexity of plans and state that the LLM can manage without external scaffolding.' },
];

export default function ExplorerAACAgentStateManagement() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent State Management — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of agent state management.
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
