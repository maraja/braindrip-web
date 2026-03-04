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
    name: 'Narrow Alignment', position: 0, color: '#8BA888',
    desc: 'Aligning a model to follow specific instructions for a well-defined task.',
    approaches: ['Supervised fine-tuning', 'Task-specific reward models', 'Rule-based filters'],
    challenge: 'Relatively tractable — we can define clear success criteria and evaluate easily.',
    example: 'A sentiment classifier that correctly labels positive/negative reviews.',
  },
  {
    name: 'Broad Alignment', position: 33, color: '#D4A843',
    desc: 'Aligning a general-purpose model to be helpful, harmless, and honest across many tasks.',
    approaches: ['RLHF', 'Constitutional AI', 'DPO', 'Instruction tuning'],
    challenge: 'Harder — "helpful" and "harmless" can conflict. Requires balancing multiple objectives.',
    example: 'A chatbot that helpfully answers questions while refusing harmful requests.',
  },
  {
    name: 'Scalable Alignment', position: 66, color: '#C76B4A',
    desc: 'Alignment techniques that work as models become more capable than human evaluators.',
    approaches: ['Debate', 'Recursive reward modeling', 'Weak-to-strong generalization', 'Interpretability'],
    challenge: 'Fundamentally difficult — how do you supervise something smarter than you?',
    example: 'Ensuring a superhuman coding model doesn\'t insert subtle backdoors humans can\'t detect.',
  },
  {
    name: 'Full Alignment', position: 100, color: '#2C3E2D',
    desc: 'Ensuring superintelligent AI systems pursue goals that are genuinely good for humanity.',
    approaches: ['Value learning', 'Corrigibility', 'Impact measures', 'Open research problems'],
    challenge: 'Unsolved — requires specifying human values, which we ourselves can\'t fully articulate.',
    example: 'An AGI that autonomously makes decisions aligned with long-term human flourishing.',
  },
];

export default function AlignmentSpectrumViz() {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = LEVELS[levelIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Alignment Spectrum</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>From narrow task alignment to the full alignment problem — increasing difficulty and scope.</p>
      </div>

      <div style={{ position: 'relative' as const, height: '50px', background: 'linear-gradient(to right, #8BA888, #D4A843, #C76B4A, #2C3E2D)', borderRadius: '10px', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
        {LEVELS.map((l, i) => (
          <button key={i} onClick={() => setLevelIdx(i)} style={{
            position: 'absolute' as const, left: `${l.position}%`, top: '50%', transform: 'translate(-50%, -50%)',
            width: levelIdx === i ? '22px' : '16px', height: levelIdx === i ? '22px' : '16px', borderRadius: '50%',
            background: '#FDFBF7', border: `3px solid ${l.color}`, cursor: 'pointer',
            transition: 'all 0.2s', zIndex: levelIdx === i ? 2 : 1,
          }} />
        ))}
        <div style={{ position: 'absolute' as const, bottom: '-20px', left: '0', fontSize: '0.68rem', color: '#8BA888' }}>Narrow</div>
        <div style={{ position: 'absolute' as const, bottom: '-20px', right: '0', fontSize: '0.68rem', color: '#2C3E2D' }}>Full</div>
      </div>

      <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: level.color }} />
          <span style={{ fontSize: '1rem', fontWeight: 700, color: level.color }}>{level.name}</span>
        </div>
        <div style={{ fontSize: '0.88rem', color: '#2C3E2D', lineHeight: 1.7, marginBottom: '0.75rem' }}>{level.desc}</div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1, background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.4rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Approaches</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.25rem' }}>
            {level.approaches.map((a, i) => (
              <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '5px', background: `${level.color}12`, color: level.color, fontWeight: 500 }}>{a}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: `${level.color}08`, border: `1px solid ${level.color}22`, borderRadius: '10px', padding: '0.85rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: level.color, marginBottom: '0.25rem' }}>Challenge</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.6 }}>{level.challenge}</div>
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.25rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Example</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.6, fontStyle: 'italic' }}>{level.example}</div>
      </div>
    </div>
  );
}
