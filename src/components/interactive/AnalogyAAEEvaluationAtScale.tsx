import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEEvaluationAtScale() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider the difference between a home kitchen and a commercial bakery. A home baker can taste every batch, adjust recipes by feel, and track results in a notebook. A commercial bakery producing 10,000 loaves daily needs production lines, quality sampling, batch tracking systems, and a quality assurance team.' },
    { emoji: '⚙️', label: 'How It Works', text: '#### Distributed Execution  At scale, evaluation tasks must run in parallel across many workers. A suite of 5,000 tasks with 10 runs each requires 50,000 individual task executions. At 5 minutes per execution, serial processing takes 173 days.' },
    { emoji: '🔍', label: 'In Detail', text: 'At the early stage, one engineer runs 50 tasks on a laptop, eyeballs the results, and reports pass rates in a Slack message. This works when the evaluation suite is small, the team is small, and the stakes are low.' },
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
