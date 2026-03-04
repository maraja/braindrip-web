import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const problems = [
  {
    q: 'If a shirt costs $25 after a 20% discount, what was the original price?',
    standard: { answer: '$30', steps: ['25 + 20% = 30'], correct: false, tokens: 15 },
    reasoning: { answer: '$31.25', steps: ['Let original = x', '20% off means 0.8x = 25', 'x = 25 / 0.8', 'x = 31.25'], correct: true, tokens: 120 },
  },
  {
    q: 'A bat and ball cost $1.10 total. The bat costs $1 more than the ball. What does the ball cost?',
    standard: { answer: '$0.10', steps: ['1.10 - 1.00 = 0.10'], correct: false, tokens: 12 },
    reasoning: { answer: '$0.05', steps: ['Let ball = x', 'Bat = x + 1', 'x + (x+1) = 1.10', '2x = 0.10', 'x = 0.05'], correct: true, tokens: 150 },
  },
  {
    q: 'How many r\'s are in "strawberry"?',
    standard: { answer: '2', steps: ['s-t-r-a-w-b-e-r-y → 2 r\'s'], correct: false, tokens: 8 },
    reasoning: { answer: '3', steps: ['s-t-r-a-w-b-e-r-r-y', 'Position 3: r', 'Position 8: r', 'Position 9: r', 'Count: 3'], correct: true, tokens: 90 },
  },
];

export default function ReasoningVsStandardViz() {
  const [probIdx, setProbIdx] = useState(0);
  const p = problems[probIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Reasoning vs Standard Model</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how reasoning models solve tricky problems that standard models get wrong.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {problems.map((_, i) => (
          <button key={i} onClick={() => setProbIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${probIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: probIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: probIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: probIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>Problem {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#2C3E2D' }}>
        {p.q}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          { label: 'Standard Model', data: p.standard, color: '#C76B4A' },
          { label: 'Reasoning Model', data: p.reasoning, color: '#8BA888' },
        ].map(m => (
          <div key={m.label} style={{ padding: '0.75rem', borderRadius: '8px', border: `1px solid ${m.data.correct ? '#8BA888' : '#C76B4A'}`, background: m.data.correct ? 'rgba(139,168,136,0.04)' : 'rgba(199,107,74,0.04)' }}>
            <div style={{ fontSize: '0.65rem', color: m.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.4rem' }}>{m.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#5A6B5C', marginBottom: '0.4rem' }}>
              {m.data.steps.map((s, i) => <div key={i} style={{ marginBottom: '0.15rem' }}>{s}</div>)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5DFD3', paddingTop: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2C3E2D' }}>{m.data.answer}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: m.data.correct ? '#8BA888' : '#C76B4A' }}>{m.data.correct ? 'CORRECT' : 'WRONG'}</span>
            </div>
            <div style={{ fontSize: '0.6rem', color: '#7A8B7C', marginTop: '0.2rem' }}>{m.data.tokens} tokens used</div>
          </div>
        ))}
      </div>
    </div>
  );
}
