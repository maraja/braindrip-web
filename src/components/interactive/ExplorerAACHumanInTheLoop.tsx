import { useState } from 'react';

const DETAILS = [
    { label: 'Approval latency', detail: 'Synchronous approval (the agent waits for the human) is simplest but blocks the agent. For long-running tasks, asynchronous approval (the agent queues the action and continues other work) prevents idle time. Timeout policies define what happens if the human does not respond (typically: the action is not taken).' },
    { label: 'Approval context richness', detail: 'The approval request should include not just the proposed action but the full reasoning chain: what the user asked for, what the agent has done so far, why it chose this action, and what alternatives it considered. Richer context leads to better approval decisions.' },
    { label: 'Batch approval', detail: 'When an agent needs to perform many similar actions (e.g., sending 50 personalized emails), individual approval for each is impractical. Batch approval shows a summary (\"Send 50 emails to customers in segment X with template Y\") and a few representative examples for spot-checking.' },
    { label: 'Audit logging', detail: 'Every approval decision (approved, rejected, modified, timed out) is logged with timestamp, approver identity, and any modifications. This creates a complete audit trail for compliance and for training the progressive autonomy system.' },
    { label: 'Rejection feedback', detail: 'When a human rejects an action, the reason for rejection is captured and fed back to the agent. This in-context feedback helps the agent avoid similar proposals in the current session and, over time, improves the agent\'s judgment about what is acceptable.' },
    { label: 'Multi-level approval', detail: 'Critical actions may require approval from multiple humans (e.g., both a technical reviewer and a business owner). The approval workflow supports sequential or parallel multi-approver patterns.' },
];

export default function ExplorerAACHumanInTheLoop() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Human-in-the-Loop — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of human-in-the-loop.
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
