import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACSourceVerification() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a journalist working on an investigative piece. They never publish a claim based on a single source. They cross-reference with independent sources, check for consistency, evaluate source credibility, and note when sources disagree.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The agent retrieves information from multiple independent sources for the same claim. If three different documents state that a company\'s revenue was 5.2 billion, confidence is high. If one says 5.2B and another says $4.8B, the agent has detected a discrepancy requiring investigation.' },
    { emoji: '🔍', label: 'In Detail', text: 'When an agent retrieves information from external sources -- documents, databases, web pages, APIs -- it inherits all the reliability problems of those sources. Documents may be outdated, contain errors, reflect biases, or even be deliberately manipulated (as in indirect prompt injection).' },
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
