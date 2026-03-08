import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEEvaluationBudgetOptimization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have $1,000 to spend understanding how well your agent performs. You could run 2,000 tasks once each, 200 tasks 10 times each, or 50 tasks 40 times each -- all for the same cost.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Adaptive testing allocates evaluation runs dynamically based on observed results, rather than committing to a fixed number of runs per task upfront. The basic algorithm works as follows: start by running each task once. Tasks where the agent clearly succeeds (high confidence) or clearly fails (high confidence) receive no additional runs.' },
    { emoji: '🔍', label: 'In Detail', text: 'This problem is analogous to experimental design in clinical trials, where researchers must decide how many patients to enroll, how many measurements to take per patient, and which subgroups to oversample.' },
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
