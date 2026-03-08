import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPESelfConsistency() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are lost in an unfamiliar city and you ask five different strangers for directions to the train station. Each person might suggest a slightly different route, but if four out of five point you east, you should go east. The one outlier who pointed west probably misunderstood your question or was confused.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The process begins with a standard chain-of-thought prompt (either few-shot or zero-shot). Instead of generating a single response at temperature 0 (greedy decoding), the prompt is sent N times with temperature &gt; 0 (typically 0.5-0.7). Each call produces a different reasoning trace because the sampling introduces randomness in token selection.' },
    { emoji: '🔍', label: 'In Detail', text: 'Introduced by Wang et al. (2023), self-consistency addresses a fundamental limitation of chain-of-thought prompting: any single reasoning trace is stochastic and can contain errors. A model might make an arithmetic mistake in step 3, misinterpret a condition in step 5, or simply wander off track.' },
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
