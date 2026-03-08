import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAECrossDomainGeneralizationMeasurement() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a chess grandmaster applying for a job as a military strategist. Chess and military strategy share abstract similarities -- planning, resource allocation, anticipating opponents -- but the grandmaster\'s chess rating tells you little about their actual strategic capability in warfare.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The standard protocol for measuring cross-domain transfer follows a train-evaluate-test paradigm:  Domain performance matrix. Evaluate the agent across multiple domains to construct a performance matrix. Each row is an agent, each column is a domain.' },
    { emoji: '🔍', label: 'In Detail', text: 'For AI agents, this question is urgent and largely unanswered. An agent that scores 85% on SWE-bench (software engineering) might score 40% on a research benchmark or 70% on a customer service benchmark.' },
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
