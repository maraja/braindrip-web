import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01TheBenchmarkAndEvaluationLandscape() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to measure how "smart" a person is. You start with an IQ test. Everyone optimizes for IQ tests, and soon the test stops distinguishing between top performers. You introduce a harder test. People optimize for that too. Eventually, you give up on written tests entirely and ask people to evaluate each other in blind comparisons.' },
    { emoji: '⚙️', label: 'How It Works', text: 'MMLU (Massive Multitask Language Understanding), introduced by Hendrycks et al. in 2020, became the de facto standard for measuring LLM capability. It contains 15,908 multiple-choice questions across 57 academic subjects — from abstract algebra to virology.' },
    { emoji: '🔍', label: 'In Detail', text: 'Benchmarks serve a critical function in AI: they provide a shared language for comparing models. Without them, claims of improvement are unfalsifiable marketing. But benchmarks also distort the field by creating incentives to optimize for the test rather than the underlying capability.' },
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
