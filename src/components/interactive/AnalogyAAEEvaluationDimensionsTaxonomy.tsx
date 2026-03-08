import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEEvaluationDimensionsTaxonomy() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of evaluating an agent like evaluating a restaurant. A restaurant with incredible food but two-hour wait times, rude service, and health code violations is not a "good" restaurant -- even if the food scores 10/10. You need multiple dimensions: taste, service, ambiance, hygiene, price, wait time.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The CLASS framework (adapted from production AI system evaluation) organizes the primary dimensions:  This framework provides a useful starting point, but production agent evaluation requires additional dimensions.' },
    { emoji: '🔍', label: 'In Detail', text: 'Agent evaluation faces the same problem. An agent that resolves 70% of coding tasks but costs 8 per task, takes 15 minutes per run, and occasionally executes rm -rf / is not meaningfully comparable to one that resolves 55% of tasks at 0.50 per task in 30 seconds with no safety incidents.' },
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
