import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEMultiDimensionalDebateEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how a hiring panel works. One interviewer focuses on technical skills, another on communication, a third on cultural fit. After individual assessments, they deliberate -- and the discussion often reveals insights none of them reached alone.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The debate evaluation system consists of:  Dimension Advocates: Separate LLM judge instances, each prompted with a specific evaluative dimension and its associated rubric. Common dimensions include:    - Correctness Advocate: evaluates factual accuracy and task completion    - Efficiency Advocate: evaluates resource usage, step count, and.' },
    { emoji: '🔍', label: 'In Detail', text: 'Multi-dimensional debate evaluation applies this panel model to automated agent evaluation. Instead of a single LLM judge scoring all aspects of quality, multiple specialized judge agents each assess a specific dimension (correctness, efficiency, safety, style) and then engage in structured argumentation.' },
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
