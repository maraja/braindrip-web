import { useState } from 'react';

const DETAILS = [
    { label: 'Token budget per turn', detail: 'A single agent turn typically consumes 1,000-4,000 input tokens (context) and 200-1,000 output tokens (reasoning + tool call). A full task may consume 50,000-500,000 total tokens.' },
    { label: 'Tool call latency', detail: 'Each tool execution adds 100ms-30s of latency depending on the tool (file read vs. web request vs. code execution). Total task time is dominated by the number of LLM calls multiplied by inference latency.' },
    { label: 'Context window utilization', detail: 'Modern agents operate within 128K-200K token context windows. Effective agents rarely fill the full window; they use summarization and pruning to stay within 30-60% utilization for optimal reasoning quality.' },
    { label: 'Error rates', detail: 'LLM-based agents make incorrect tool selections roughly 5-15% of the time on complex tasks, necessitating retry logic, validation, and human oversight.' },
    { label: 'Tool count sweet spot', detail: 'Empirical testing suggests 5-20 well-designed tools outperform 50+ poorly designed ones. Tool selection accuracy degrades as the number of available tools increases beyond approximately 20-30.' },
    { label: 'Multi-agent vs. single-agent', detail: 'Single-agent architectures are simpler and sufficient for most tasks. Multi-agent setups (multiple specialized agents coordinating) add complexity and are justified primarily when tasks require genuinely distinct expertise domains.' },
];

export default function ExplorerAACWhatIsAnAiAgent() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          What Is an AI Agent? \u2014 Key Details Explorer
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
