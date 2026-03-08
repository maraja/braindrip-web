import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAgentDebateAndVerification() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider the peer review system in academic publishing. A researcher submits a paper, then independent reviewers — who did not write it and have no incentive to agree — evaluate the methodology, challenge the conclusions, and identify weaknesses.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest debate pattern:  Proposer agent generates an initial answer, plan, or code solution. Critic agent receives the proposer\'s output (and optionally the original task) and generates a detailed critique — identifying errors, weaknesses, missing elements, and potential improvements.' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent debate applies this same principle to AI outputs. Instead of trusting a single agent\'s answer, the system routes the output through one or more critic agents whose job is to find problems.' },
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
