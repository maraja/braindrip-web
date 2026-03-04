import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyBenchmarkContamination() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📝', label: 'Leaked Exam Answers', text: 'If students see the exam questions beforehand, their scores no longer measure understanding — they measure memorization. Benchmark contamination is the same problem: if the test questions (and answers) appeared in the training data, the model\'s high score doesn\'t mean it can reason — it may have memorized the answers. Detection techniques check if models reproduce benchmark examples verbatim or with suspiciously high accuracy.' },
    { emoji: '🏋️', label: 'Doping in Sports', text: 'A sprinter on steroids can break records but those records are meaningless. Benchmark contamination is "doping" for AI — inflated scores that don\'t reflect genuine capability. Detection methods include: testing on rephrased versions of benchmark questions (contaminated models fail), checking for verbatim memorization, and comparing performance on seen vs. unseen subsets of a benchmark.' },
    { emoji: '🔬', label: 'Control Group Violation', text: 'In a drug trial, if patients in the control group accidentally receive the drug, the results are invalid. Benchmark contamination is the same violation: the "test set" has leaked into "training data," destroying the validity of the evaluation. As models train on ever-larger internet scrapes, more benchmarks get inadvertently included, requiring fresh, held-out evaluation sets and contamination detection protocols.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
