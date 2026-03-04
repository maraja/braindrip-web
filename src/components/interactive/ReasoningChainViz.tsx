import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const PROBLEMS = [
  {
    question: 'A store sells apples for $2 each. If you buy 3 or more, you get 20% off the total. How much do 5 apples cost?',
    correctAnswer: '$8.00',
    system1: { answer: '$10.00', correct: false, confidence: 72 },
    system2: {
      steps: [
        { title: 'Parse the problem', detail: 'Price per apple: $2. Discount: 20% off total if buying 3+. Quantity: 5 apples.' },
        { title: 'Calculate base price', detail: '5 apples x $2/apple = $10.00 total before discount.' },
        { title: 'Check discount eligibility', detail: '5 >= 3, so the 20% discount applies to the total.' },
        { title: 'Apply discount', detail: '$10.00 x 0.20 = $2.00 discount. $10.00 - $2.00 = $8.00.' },
        { title: 'Verify', detail: 'Without discount: $10. With 20% off: $8. This is correct.' },
      ],
      answer: '$8.00', correct: true, confidence: 97,
    },
  },
  {
    question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?',
    correctAnswer: '5 minutes',
    system1: { answer: '100 minutes', correct: false, confidence: 65 },
    system2: {
      steps: [
        { title: 'Identify the pattern', detail: '5 machines make 5 widgets in 5 minutes. What is the rate per machine?' },
        { title: 'Calculate per-machine rate', detail: 'Each machine makes 1 widget in 5 minutes (5 machines / 5 widgets = 1 widget per machine).' },
        { title: 'Scale to 100 machines', detail: '100 machines, each making 1 widget in 5 minutes = 100 widgets in 5 minutes.' },
        { title: 'Verify reasoning', detail: 'The key insight: machines work in parallel, not sequentially. More machines = more widgets in the same time, not more time.' },
      ],
      answer: '5 minutes', correct: true, confidence: 95,
    },
  },
  {
    question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    correctAnswer: '$0.05',
    system1: { answer: '$0.10', correct: false, confidence: 89 },
    system2: {
      steps: [
        { title: 'Set up variables', detail: 'Let ball = x. Then bat = x + $1.00 (costs $1.00 more than ball).' },
        { title: 'Write the equation', detail: 'ball + bat = $1.10, so x + (x + $1.00) = $1.10.' },
        { title: 'Solve', detail: '2x + $1.00 = $1.10 implies 2x = $0.10, so x = $0.05.' },
        { title: 'Verify', detail: 'Ball = $0.05, Bat = $1.05. Difference = $1.00. Total = $1.10. Both conditions satisfied.' },
      ],
      answer: '$0.05', correct: true, confidence: 98,
    },
  },
];

const TRAINING = [
  { epoch: 'Base', s1: 45, s2: 62 },
  { epoch: 'CoT Tuned', s1: 48, s2: 78 },
  { epoch: 'RLVR', s1: 50, s2: 89 },
  { epoch: 'Final', s1: 52, s2: 94 },
];

export default function ReasoningChainViz() {
  const [problem, setProblem] = useState(0);
  const [mode, setMode] = useState<'system1' | 'system2'>('system1');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const p = PROBLEMS[problem];
  const result = mode === 'system1' ? p.system1 : p.system2;

  const toggleStep = (i: number) => {
    const next = new Set(expandedSteps);
    if (next.has(i)) next.delete(i); else next.add(i);
    setExpandedSteps(next);
  };

  const switchProblem = (i: number) => { setProblem(i); setMode('system1'); setExpandedSteps(new Set()); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Chain-of-Thought Reasoning
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare direct "System 1" answers with step-by-step "System 2" reasoning on tricky problems.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {PROBLEMS.map((_, i) => (
          <button key={i} onClick={() => switchProblem(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
            background: problem === i ? '#2C3E2D' : 'transparent', color: problem === i ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
          }}>Problem {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.88rem', color: '#2C3E2D', lineHeight: 1.6, fontWeight: 500 }}>{p.question}</div>
        <div style={{ fontSize: '0.75rem', color: '#8B9B8D', marginTop: '0.3rem' }}>Correct answer: <strong style={{ color: '#8BA888' }}>{p.correctAnswer}</strong></div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {(['system1', 'system2'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setExpandedSteps(new Set()); }} style={{
            padding: '0.4rem 0.85rem', borderRadius: '8px', border: mode === m ? 'none' : '1px solid #E5DFD3', cursor: 'pointer',
            background: mode === m ? (m === 'system1' ? '#D4A843' : '#8BA888') : 'transparent',
            color: mode === m ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600,
          }}>{m === 'system1' ? 'System 1 (Direct)' : 'System 2 (Reasoning)'}</button>
        ))}
      </div>

      {mode === 'system2' && (
        <div style={{ marginBottom: '1rem' }}>
          {p.system2.steps.map((s, i) => (
            <div key={i} style={{ marginBottom: '0.35rem' }}>
              <button onClick={() => toggleStep(i)} style={{
                width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '8px',
                border: '1px solid #8BA88833', background: expandedSteps.has(i) ? '#8BA88811' : '#F5F0E6',
                cursor: 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 700, color: '#8BA888', width: '18px', height: '18px', borderRadius: '50%', background: '#8BA88822', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: '0.82rem', color: '#2C3E2D', fontWeight: 600, flex: 1 }}>{s.title}</span>
                <span style={{ fontSize: '0.75rem', color: '#8B9B8D', transition: 'transform 0.2s', transform: expandedSteps.has(i) ? 'rotate(90deg)' : 'none' }}>{'>'}</span>
              </button>
              {expandedSteps.has(i) && (
                <div style={{ padding: '0.5rem 0.75rem 0.5rem 2.5rem', color: '#5A6B5C', lineHeight: 1.65, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem' }}>
                  {s.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ background: result.correct ? '#8BA88811' : '#C76B4A11', border: `1px solid ${result.correct ? '#8BA88833' : '#C76B4A33'}`, borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#5A6B5C' }}>Answer: </span>
            <strong style={{ fontSize: '0.95rem', color: result.correct ? '#8BA888' : '#C76B4A' }}>{result.answer}</strong>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: result.correct ? '#8BA88822' : '#C76B4A22', color: result.correct ? '#8BA888' : '#C76B4A', fontWeight: 700 }}>{result.correct ? 'CORRECT' : 'INCORRECT'}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', fontWeight: 700, color: result.confidence > 90 ? '#8BA888' : result.confidence > 70 ? '#D4A843' : '#C76B4A' }}>{result.confidence}%</div>
            <div style={{ fontSize: '0.65rem', color: '#8B9B8D' }}>confidence</div>
          </div>
        </div>
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Accuracy across training</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${TRAINING.length}, 1fr)`, gap: '0.4rem' }}>
        {TRAINING.map(t => (
          <div key={t.epoch} style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', height: '80px', background: '#F5F0E6', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', gap: '2px', justifyContent: 'center', padding: '0 4px' }}>
              <div style={{ width: '40%', height: `${t.s1 * 0.8}%`, background: '#D4A843', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
              <div style={{ width: '40%', height: `${t.s2 * 0.8}%`, background: '#8BA888', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
            </div>
            <div style={{ fontSize: '0.65rem', color: '#5A6B5C', marginTop: '0.25rem', fontWeight: 600 }}>{t.epoch}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.7rem', color: '#D4A843', fontWeight: 600 }}>System 1</span>
        <span style={{ fontSize: '0.7rem', color: '#8BA888', fontWeight: 600 }}>System 2</span>
      </div>
    </div>
  );
}
