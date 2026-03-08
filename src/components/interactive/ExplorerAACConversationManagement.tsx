import { useState } from 'react';

const DETAILS = [
    { label: 'Summarization cost', detail: 'Generating a conversation summary costs one LLM call (typically 500-1500 tokens). This is amortized across many turns: summarize every 5-10 turns, not every turn' },
    { label: 'Summary quality matters', detail: 'A lossy summary can cause the agent to lose critical details. Include key decisions, specific data points, and unresolved items. Exclude pleasantries, routine acknowledgments, and verbose tool outputs' },
    { label: 'Role-specific token budgets', detail: 'System message: 5-15% of total budget. Conversation history: 40-60%. Current exchange: 20-30%. Retrieved context: 10-20%. Reserve 15% for response generation' },
    { label: 'Message deduplication', detail: 'When the same information appears in multiple messages (user repeats request, tool returns overlapping results), deduplicate during summarization to avoid wasting tokens' },
    { label: 'Conversation checkpointing', detail: 'For long conversations, periodically save a full snapshot (all messages + state) to persistent storage. This enables recovery from context window overflow and allows the conversation to span multiple sessions' },
    { label: 'Framework implementations', detail: 'LangChain\'s ConversationSummaryBufferMemory combines a summary of old messages with a buffer of recent messages. This is the recommended default for most agent applications' },
];

export default function ExplorerAACConversationManagement() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Conversation Management \u2014 Key Details Explorer
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
