import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACEventDrivenArchitectures() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a security guard who patrols the building on a fixed schedule versus one who sits at a monitoring station and responds when an alarm triggers. The patrolling guard wastes effort checking empty hallways; the monitoring guard is idle most of the time but responds instantly when something happens.' },
    { emoji: '⚙️', label: 'How It Works', text: 'An event source is anything that produces events the agent should respond to. Common sources include: HTTP webhooks (GitHub sends a webhook when a PR is opened), message queues (Kafka, RabbitMQ, SQS), file system watchers (a new CSV appears in a directory), scheduled triggers (run every Monday at 9am via cron), database change streams (a new row.' },
    { emoji: '🔍', label: 'In Detail', text: 'Traditional agent architectures are request-response: a user sends a message, the agent processes it, returns a result. Event-driven agents invert this model. The agent subscribes to event sources and reacts when events arrive. A code review agent activates when a pull request is opened.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
