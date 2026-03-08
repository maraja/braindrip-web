import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEStratifiedEvaluationDesign() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine grading a student by averaging their scores across all subjects. A student scoring 95% in art and 30% in math gets a "passing" 62.5%. The average conceals a critical deficit. Agent evaluation faces exactly this problem: an aggregate "74% on SWE-bench" might mean 95% on easy fixes and 12% on complex refactors.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Effective stratification requires dimensions that are both meaningful and estimable. Common stratification dimensions for agent evaluation:  Task Difficulty: Easy / Medium / Hard (based on human solve rates or expert annotation) Objective proxy: number of required steps, tool calls, or reasoning depth  Domain: Code generation / Web navigation /.' },
    { emoji: '🔍', label: 'In Detail', text: 'Stratified evaluation design divides the task pool into meaningful subgroups (strata) and evaluates performance within each stratum separately. The strata reflect dimensions that matter for deployment decisions: task difficulty, domain, task type, or edge case categories.' },
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
