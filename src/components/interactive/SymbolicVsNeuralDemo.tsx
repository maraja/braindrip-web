import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const tasks = [
  {
    q: 'All cats are animals. Whiskers is a cat. Is Whiskers an animal?',
    neural: { answer: 'Yes, probably', confidence: 0.88, reasoning: 'Pattern matching from training data', correct: true, reliable: false },
    neurosymbolic: { answer: 'Yes, provably', confidence: 1.0, reasoning: 'cat(Whiskers) ∧ ∀x(cat(x)→animal(x)) ⊢ animal(Whiskers)', correct: true, reliable: true },
  },
  {
    q: 'No reptiles are mammals. Some pets are reptiles. Can some pets be non-mammals?',
    neural: { answer: 'I think so', confidence: 0.65, reasoning: 'Uncertain — complex quantifier interaction', correct: true, reliable: false },
    neurosymbolic: { answer: 'Yes, necessarily', confidence: 1.0, reasoning: '∃x(pet(x)∧reptile(x)) ∧ ∀x(reptile(x)→¬mammal(x)) ⊢ ∃x(pet(x)∧¬mammal(x))', correct: true, reliable: true },
  },
  {
    q: 'If it rains, the ground is wet. The ground is wet. Did it rain?',
    neural: { answer: 'Yes, it rained', confidence: 0.82, reasoning: 'Common association: wet ground → rain', correct: false, reliable: false },
    neurosymbolic: { answer: 'Cannot determine', confidence: 1.0, reasoning: 'Affirming the consequent fallacy: rain→wet does not imply wet→rain. Other causes possible.', correct: true, reliable: true },
  },
];

export default function SymbolicVsNeuralDemo() {
  const [taskIdx, setTaskIdx] = useState(0);
  const t = tasks[taskIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Neural vs Neurosymbolic</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare pure neural vs neurosymbolic approaches on logic tasks.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {tasks.map((_, i) => (
          <button key={i} onClick={() => setTaskIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${taskIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: taskIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: taskIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: taskIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>Task {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#2C3E2D' }}>{t.q}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          { label: 'Pure Neural', data: t.neural, color: '#C76B4A' },
          { label: 'Neurosymbolic', data: t.neurosymbolic, color: '#8BA888' },
        ].map(m => (
          <div key={m.label} style={{ padding: '0.75rem', borderRadius: '8px', border: `1px solid ${m.data.correct ? '#8BA888' : '#C76B4A'}` }}>
            <div style={{ fontSize: '0.65rem', color: m.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.35rem' }}>{m.label}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2C3E2D', marginBottom: '0.25rem' }}>{m.data.answer}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#5A6B5C', marginBottom: '0.35rem', lineHeight: 1.5 }}>{m.data.reasoning}</div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', borderRadius: '3px', background: m.data.correct ? 'rgba(139,168,136,0.15)' : 'rgba(199,107,74,0.15)', color: m.data.correct ? '#8BA888' : '#C76B4A' }}>{m.data.correct ? 'Correct' : 'Wrong'}</span>
              <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', borderRadius: '3px', background: m.data.reliable ? 'rgba(139,168,136,0.15)' : 'rgba(212,168,67,0.15)', color: m.data.reliable ? '#8BA888' : '#D4A843' }}>{m.data.reliable ? 'Provable' : 'Unreliable'}</span>
              <span style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", color: '#7A8B7C' }}>{(m.data.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
