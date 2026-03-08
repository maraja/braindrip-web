import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEMultiAgentEvaluationTheory() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine evaluating a basketball team. You could measure each player\'s shooting percentage, but that tells you nothing about whether the team passes well, whether players space the floor correctly, or whether the point guard and center have chemistry. A team of five average players with great coordination can beat five superstars who do not pass.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Game theory provides the mathematical foundation for multi-agent evaluation. Key metrics include:  Nash equilibrium convergence. In a multi-agent system, a Nash equilibrium is a state where no agent can improve its outcome by unilaterally changing its strategy.' },
    { emoji: '🔍', label: 'In Detail', text: 'When multiple AI agents work together (or against each other), new dimensions of performance appear that have no analog in single-agent evaluation. How efficiently do agents communicate? Do they develop useful specializations? Does the group converge on fair and stable outcomes?' },
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
