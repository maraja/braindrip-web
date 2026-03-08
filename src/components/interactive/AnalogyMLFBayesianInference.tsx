import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFBayesianInference() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you hear a strange noise outside at night. Your initial guess might be "it\'s a cat" based on past experience -- that is your prior. Then you look out the window and see a large shadow -- that is your evidence. You combine your prior guess with this new data to update your belief: maybe it is actually a raccoon.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The prior encodes domain knowledge or regularization assumptions. A vague prior (e.g., a very wide Gaussian) expresses minimal prior knowledge, while an informative prior (e.g., a narrow Gaussian centered on a physically meaningful value) encodes strong domain expertise.' },
    { emoji: '🔍', label: 'In Detail', text: 'Bayesian inference treats model parameters  not as fixed unknown constants (the frequentist view) but as random variables with their own probability distributions. Given observed data D, we update our beliefs about  using Bayes\' theorem:' },
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
