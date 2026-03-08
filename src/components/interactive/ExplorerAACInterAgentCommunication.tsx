import { useState } from 'react';

const DETAILS = [
    { label: 'Message schemas', detail: 'Define explicit schemas for inter-agent messages. At minimum: sender ID, recipient ID (or topic), message type (task, result, question, escalation), timestamp, and payload. This structure enables routing, logging, and automated processing.' },
    { label: 'Context passing', detail: 'The most common communication failure is insufficient context. When Agent A delegates to Agent B, it must include not just the task but the relevant background: why this task matters, what constraints apply, what related work has been done. Err on the side of over-communicating.' },
    { label: 'Conversation memory', detail: 'In turn-based communication, the conversation history grows with each exchange. Long agent-to-agent conversations face the same context window pressures as human-to-agent conversations. Implement summarization or sliding window approaches for long exchanges.' },
    { label: 'Serialization format', detail: 'JSON is the dominant serialization format for inter-agent messages due to LLM affinity with JSON. Protocol Buffers or MessagePack offer efficiency advantages for high-throughput systems but are less LLM-friendly.' },
    { label: 'Ordering guarantees', detail: 'In event-based systems, messages may arrive out of order. If ordering matters (and it usually does), use sequence numbers or vector clocks, or serialize communication through a single message broker.' },
    { label: 'Dead letter queues', detail: 'Messages that cannot be delivered (agent crashed, unknown recipient) should be captured in a dead letter queue for debugging rather than silently dropped.' },
];

export default function ExplorerAACInterAgentCommunication() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Inter-Agent Communication \u2014 Key Details Explorer
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
