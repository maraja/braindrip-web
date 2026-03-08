import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEWhyAgentEvaluationIsHard() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine testing a human employee. You cannot simply check their answers on a written exam -- you need to observe them handling ambiguous requests, recovering from mistakes, coordinating with colleagues, and making judgment calls under uncertainty. Now imagine that employee behaves slightly differently every time you give them the same task.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Agent evaluation must contend with challenges that do not arise -- or arise only weakly -- in simpler evaluation settings.' },
    { emoji: '🔍', label: 'In Detail', text: 'Traditional LLM evaluation is comparatively straightforward: give the model a prompt, collect the output, compare it to a reference answer. You can evaluate thousands of completions per minute with string matching or embedding similarity.' },
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
