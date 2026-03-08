import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEMetaEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine using a bathroom scale that always reads 150 pounds regardless of who stands on it. The scale is useless -- not because 150 is wrong for everyone, but because it fails to discriminate. Your agent evaluation suite can suffer the same problem: if every agent scores between 70-75%, the suite is not measuring meaningful differences.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Sensitivity measures whether the evaluation can detect known performance changes. The procedure:  Create synthetic regressions: Take a known-good agent and deliberately degrade it -- drop tool calls randomly, inject errors into reasoning, reduce context window. Create versions with 5%, 10%, and 20% degradation.' },
    { emoji: '🔍', label: 'In Detail', text: 'The concept draws from a long tradition in measurement theory. Just as psychometricians validate tests by checking reliability, validity, and sensitivity, agent evaluation practitioners must verify that their benchmarks detect real performance differences, correlate with real-world outcomes, and resist gaming.' },
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
