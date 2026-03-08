import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAETheEvaluationTriangle() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of project management\'s classic "fast, good, cheap -- pick two" constraint. Agent evaluation has its own version: thoroughness, cost, and speed form a triangle where optimizing for any two inevitably compromises the third. You can run exhaustive evaluations across thousands of tasks with many repetitions -- but it will be expensive and slow.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Thoroughness encompasses three sub-dimensions: breadth (how many distinct tasks), depth (how many runs per task to account for non-determinism), and granularity (how detailed the analysis -- binary pass/fail vs. trajectory scoring vs. multi-dimensional rubric evaluation).' },
    { emoji: '🔍', label: 'In Detail', text: 'The evaluation triangle is not just a theoretical framework. It is the daily reality of every team building AI agents. A startup prototyping a new coding assistant cannot afford to run full SWE-bench Verified with 10 repetitions per task before each commit.' },
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
