import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFResponsibleAiAndFairness() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a hiring algorithm that screens resumes. It was trained on a decade of hiring data from a company that historically favored certain demographics. The model learns these historical patterns and perpetuates them -- not because it was programmed to discriminate, but because it learned discrimination from the data.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Bias enters ML systems at every stage:  Historical Bias: The training data reflects past societal inequities. A criminal recidivism model trained on arrest data inherits policing biases, since arrest rates correlate with enforcement patterns, not just criminal behavior. Representation Bias: Certain groups are underrepresented in the training data.' },
    { emoji: '🔍', label: 'In Detail', text: 'Responsible AI is the discipline of designing, building, and deploying ML systems that are fair, transparent, accountable, and aligned with human values. It recognizes that ML models are not neutral: they encode the biases present in their training data, the choices made by their designers, and the objectives they are optimized for.' },
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
