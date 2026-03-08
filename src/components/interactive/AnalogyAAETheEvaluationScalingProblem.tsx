import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAETheEvaluationScalingProblem() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a world-class Go player reviewing the moves of an amateur. Every mistake is visible; every good move is recognized. Now consider an amateur reviewing the moves of a world-class player. The amateur cannot distinguish brilliant play from mediocre play -- the skill gap makes evaluation impossible.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The evaluation scaling problem is already observable in specific domains:  Expert-level code. Agents produce code that passes all tests and appears correct, but involves architectural patterns and optimizations that reviewers cannot fully verify.' },
    { emoji: '🔍', label: 'In Detail', text: 'For AI agents, this problem is not hypothetical. It is emerging now. Code-generation agents produce solutions that junior developers cannot fully verify. Research synthesis agents combine information across more papers than any single human has read. Planning agents consider more variables than human planners can track simultaneously.' },
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
