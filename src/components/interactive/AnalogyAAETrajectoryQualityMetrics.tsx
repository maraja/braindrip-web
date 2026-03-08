import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAETrajectoryQualityMetrics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two hikers who both reach a mountain summit. One followed the marked trail in three hours. The other wandered off-trail for nine hours, backtracked twice, crossed a dangerous ridge unnecessarily, and arrived exhausted. Both "succeeded," but their journeys reveal fundamentally different levels of competence.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Step Efficiency Ratio measures how many steps the agent actually took compared to the minimum necessary steps for the task:  A perfect SER of 1.0 means the agent took the optimal number of steps. An SER of 0.25 means the agent took 4x more steps than necessary.' },
    { emoji: '🔍', label: 'In Detail', text: 'Trajectory quality metrics are a family of quantitative measures that evaluate the specific sequence of actions an agent takes during task execution. Rather than reducing performance to a binary pass/fail or a single outcome score, these metrics decompose the execution path into analyzable dimensions: efficiency, relevance, coherence, accuracy,.' },
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
