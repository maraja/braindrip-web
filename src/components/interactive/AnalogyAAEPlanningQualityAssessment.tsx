import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEPlanningQualityAssessment() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of an architect reviewing blueprints before construction starts. A good blueprint accounts for structural loads, plumbing routes, electrical wiring, emergency exits, and local building codes. A poor blueprint might look elegant but omit the stairwell or specify materials that don\'t exist.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Plan Completeness measures whether the plan covers all necessary steps to achieve the goal:  A complete plan addresses every required subgoal. An incomplete plan omits steps that will eventually need to happen. Completeness is evaluated against a reference decomposition of the task into required subgoals, typically created by domain experts.' },
    { emoji: '🔍', label: 'In Detail', text: 'Planning quality assessment is the evaluation of an agent\'s generated plans prior to (or independent of) execution. Many modern agents produce explicit plans, whether as natural language outlines, structured task decompositions, or sequences of intended actions.' },
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
