import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEBenchmarkSaturationAndEvolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a high school exam that was genuinely challenging when first introduced. Over the years, students figure out the question patterns, tutors develop targeted prep materials, and average scores climb steadily. Eventually, most students score above 90%, the exam no longer distinguishes strong from weak students, and the school must redesign it.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Most benchmarks follow a four-phase lifecycle:  Phase 1 -- Introduction (months 0-6): The benchmark is published, establishing a baseline. Early submissions explore different approaches. Scores are low and the benchmark is seen as challenging.' },
    { emoji: '🔍', label: 'In Detail', text: 'SWE-bench Lite went from approximately 30% top scores to over 55% in a single year. MMLU, the once-definitive language model benchmark, was functionally saturated within 18 months of GPT-4\'s release. HumanEval, the original coding benchmark, was solved (&gt;95%) before the paper was even widely cited.' },
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
