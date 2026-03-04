import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const LEVELS = [
  {
    name: 'Easy Tasks', capability: 20, color: '#8BA888',
    desc: 'Tasks where humans can easily verify model outputs.',
    examples: ['Factual Q&A', 'Simple math', 'Sentiment analysis'],
    strategy: 'Direct Human Oversight',
    strategyDesc: 'Humans directly evaluate outputs. RLHF works well here because annotators can judge quality reliably.',
    difficulty: 'Low — humans can verify correctness at a glance.',
  },
  {
    name: 'Hard Tasks', capability: 50, color: '#D4A843',
    desc: 'Tasks where verification requires significant expertise or effort.',
    examples: ['Complex code review', 'Legal document analysis', 'Scientific paper review'],
    strategy: 'Expert + Assisted Oversight',
    strategyDesc: 'Domain experts evaluate outputs, potentially aided by other AI systems that highlight concerns or decompose the task.',
    difficulty: 'Medium — requires expertise, takes time, and experts can still miss subtle errors.',
  },
  {
    name: 'Superhuman Tasks', capability: 80, color: '#C76B4A',
    desc: 'Tasks where the model\'s output exceeds what any individual human can fully evaluate.',
    examples: ['Novel theorem proofs', 'Optimal protein folding', 'Subtle code backdoors'],
    strategy: 'Scalable Oversight Techniques',
    strategyDesc: 'Requires novel approaches: AI debate (models argue opposing sides), recursive reward modeling, or interpretability tools that let us understand model reasoning.',
    difficulty: 'Extreme — this is an open research problem. We cannot directly verify superhuman outputs.',
  },
  {
    name: 'Superintelligent Tasks', capability: 100, color: '#2C3E2D',
    desc: 'Tasks far beyond human comprehension where even understanding the output is challenging.',
    examples: ['Long-horizon strategic planning', 'Cross-domain optimization', 'Novel scientific discovery'],
    strategy: 'Unsolved Research',
    strategyDesc: 'No proven techniques exist. Proposed approaches include formal verification, corrigibility constraints, and ensuring models remain transparent and controllable.',
    difficulty: 'Fundamental — may require solving the alignment problem itself.',
  },
];

export default function OversightScalabilityViz() {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = LEVELS[levelIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Oversight Scalability</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>As model capability increases, oversight becomes exponentially harder.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {LEVELS.map((l, i) => (
          <button key={i} onClick={() => setLevelIdx(i)} style={{
            flex: 1, padding: '0.5rem 0.25rem', borderRadius: '8px', border: `2px solid ${levelIdx === i ? l.color : '#E5DFD3'}`,
            background: levelIdx === i ? `${l.color}10` : 'transparent', cursor: 'pointer', textAlign: 'center' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.72rem', fontWeight: 600,
            color: levelIdx === i ? l.color : '#5A6B5C',
          }}>{l.name}</button>
        ))}
      </div>

      <div style={{ position: 'relative' as const, height: '30px', background: 'linear-gradient(to right, #8BA888, #D4A843, #C76B4A, #2C3E2D)', borderRadius: '8px', marginBottom: '1.25rem' }}>
        <div style={{ position: 'absolute' as const, left: `${level.capability}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '18px', height: '18px', borderRadius: '50%', background: '#FDFBF7', border: `3px solid ${level.color}`, transition: 'left 0.3s' }} />
      </div>

      <div style={{ fontSize: '0.88rem', color: '#2C3E2D', lineHeight: 1.7, marginBottom: '0.75rem' }}>{level.desc}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.25rem', marginBottom: '0.75rem' }}>
        {level.examples.map((ex, i) => (
          <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '5px', background: `${level.color}12`, color: level.color, fontWeight: 500 }}>{ex}</span>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem', marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: 700, color: level.color, fontSize: '0.88rem', marginBottom: '0.3rem' }}>{level.strategy}</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{level.strategyDesc}</div>
      </div>

      <div style={{ padding: '0.5rem 0.75rem', background: `${level.color}08`, borderRadius: '8px', border: `1px solid ${level.color}22` }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: level.color }}>Difficulty: </span>
        <span style={{ fontSize: '0.82rem', color: '#2C3E2D' }}>{level.difficulty}</span>
      </div>
    </div>
  );
}
