import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACLatencyAndPerformance() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two consultants. Consultant A listens to your question, thinks for 30 seconds, and gives a perfect answer. Consultant B listens, thinks for 5 minutes, researches three sources, reconsiders twice, and gives an answer that is 10% better. Which do you prefer?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Agent execution time breaks down into several components: thinking time (LLM inference for reasoning and planning), action time (tool execution, API calls, code runs), retrieval time (embedding, searching, fetching documents), waiting time (queuing for rate-limited APIs, waiting for external services), and overhead time (prompt construction,.' },
    { emoji: '🔍', label: 'In Detail', text: 'Latency in agent systems is fundamentally different from latency in traditional software. A web server\'s latency is dominated by network and database operations, typically 50-500ms.' },
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
