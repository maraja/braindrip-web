import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyCurriculumLearning() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📖', label: 'School Grades', text: 'Students do not start with calculus — they learn arithmetic first, then algebra, then calculus. Curriculum learning applies this to model training: start with simpler, shorter, or cleaner examples, then gradually introduce harder, longer, or noisier ones. The model builds foundational skills before tackling complex challenges, often converging faster and to better final performance.' },
    { emoji: '🏊', label: 'Swimming Lessons', text: 'You do not throw a beginner into the ocean. First: shallow pool, then deep pool, then lake, then ocean. Curriculum learning orders training data by difficulty. Early batches contain short sentences with simple grammar. Later batches introduce complex reasoning, rare vocabulary, and longer documents. This scaffolded approach helps the model build skills progressively rather than drowning in complexity.' },
    { emoji: '🎮', label: 'Game Levels', text: 'Video games teach skills through progressive difficulty — Level 1 introduces basic controls, Level 10 combines everything. Curriculum learning structures training the same way: easy examples first (high-quality, short, common patterns), hard examples later (noisy, long, complex reasoning). Some approaches also anneal the data quality, shifting from diverse web text to curated high-quality sources near the end of training.' },
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
