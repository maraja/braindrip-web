import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEMultipleValidSolutions() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Ask ten experienced developers to fix a bug, and you will get ten different patches. Some will fix the root cause, others will add defensive checks. Some will refactor the surrounding code, others will make minimal changes. Some will add tests, others will not. All ten patches may be correct -- they all fix the bug and pass the test suite.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Reference-based evaluation compares agent output to one or more gold-standard answers using similarity metrics. Common approaches include:  Exact match: Output must be character-for-character identical to the reference BLEU/ROUGE scores: N-gram overlap between output and reference Embedding similarity: Cosine distance in a learned embedding.' },
    { emoji: '🔍', label: 'In Detail', text: 'This is the multiple valid solutions problem. When a task has a large or ill-defined space of correct answers, evaluation methods that compare agent output to a single reference answer systematically penalize valid alternatives.' },
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
