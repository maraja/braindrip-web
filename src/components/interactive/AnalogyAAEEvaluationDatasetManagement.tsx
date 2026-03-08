import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEEvaluationDatasetManagement() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a medical school\'s question bank for licensing exams. The questions must cover all relevant specialties in proportion to their clinical importance. They must be periodically reviewed: some become outdated as medical knowledge advances, some prove ambiguous when students consistently misinterpret them, and new questions must be added as.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Task selection requires balancing three dimensions:  Representative coverage: Tasks should reflect the actual distribution of work the agent will encounter. If 60% of real-world queries involve simple lookups and 5% involve complex multi-step reasoning, the dataset should roughly mirror this distribution -- unless you intentionally oversample hard.' },
    { emoji: '🔍', label: 'In Detail', text: 'Evaluation datasets for AI agents face identical challenges. A dataset is not a static artifact you create once; it is a living collection that requires ongoing management. The tasks must representatively cover the agent\'s intended capabilities. The ground-truth answers must be accurate and unambiguous.' },
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
