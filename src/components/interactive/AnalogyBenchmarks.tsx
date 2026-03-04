import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyBenchmarks() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏋️', label: 'Standardized Fitness Test', text: 'Benchmarks are like a standardized fitness test: everyone runs the same mile, does the same push-ups, and gets scored the same way. MMLU tests general knowledge, HumanEval tests coding, GSM8K tests math reasoning. By using the same test across models, we can compare them fairly. But just like a fitness test doesn\'t capture how good a basketball player someone is, no single benchmark captures overall model quality.' },
    { emoji: '📏', label: 'Ruler Collection', text: 'You wouldn\'t measure temperature with a ruler. Different benchmarks measure different things: MMLU measures knowledge breadth, HellaSwag measures commonsense reasoning, TruthfulQA measures honesty, and MT-Bench measures conversational quality. A responsible evaluation uses a collection of rulers, each measuring a different dimension of capability, to build a complete picture of model strengths and weaknesses.' },
    { emoji: '🏆', label: 'Standardized Exams', text: 'Benchmarks are the SATs and GREs of the AI world — standardized tests that allow comparison across candidates. They have the same limitations too: they can be gamed, they don\'t capture every important skill, and high scores don\'t guarantee real-world performance. The best evaluation combines benchmarks (standardized tests) with human evaluation (interviews) and task-specific testing (job simulations).' },
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
