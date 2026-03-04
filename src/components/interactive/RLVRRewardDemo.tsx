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
    question: 'What is 17 x 23?',
    groundTruth: 391,
    attempts: [
      { chain: '17 x 23 = 17 x 20 + 17 x 3 = 340 + 51 = 391', answer: 391, learnedScore: 0.92 },
      { chain: '17 x 23 = 17 x 25 - 17 x 2 = 425 - 34 = 389', answer: 389, learnedScore: 0.88 },
      { chain: '17 x 23, since both are close to 20, approximately 400. Let me say 393.', answer: 393, learnedScore: 0.85 },
    ],
  },
  {
    question: 'If a train travels 240 km in 3 hours, what is its speed in km/h?',
    groundTruth: 80,
    attempts: [
      { chain: 'Speed = Distance / Time = 240 / 3 = 80 km/h', answer: 80, learnedScore: 0.95 },
      { chain: 'Distance is 240, time is 3. Speed = 240 x 3 = 720 km/h', answer: 720, learnedScore: 0.72 },
      { chain: 'A train going 240km in 3h is going fast, probably around 75 km/h.', answer: 75, learnedScore: 0.81 },
    ],
  },
  {
    question: 'What is the derivative of x^3 + 2x?',
    groundTruth: '3x^2 + 2' as any,
    attempts: [
      { chain: 'd/dx(x^3) = 3x^2, d/dx(2x) = 2, so the answer is 3x^2 + 2', answer: '3x^2 + 2' as any, learnedScore: 0.94 },
      { chain: 'The derivative brings the exponent down: x^3 becomes 3x^2 and 2x stays as 2x, giving 3x^2 + 2x', answer: '3x^2 + 2x' as any, learnedScore: 0.91 },
      { chain: 'Differentiating polynomials: 3x + 2', answer: '3x + 2' as any, learnedScore: 0.68 },
    ],
  },
];

export default function RLVRRewardDemo() {
  const [problem, setProblem] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const p = PROBLEMS[problem];
  const a = p.attempts[attempt];
  const isCorrect = String(a.answer) === String(p.groundTruth);
  const verifiedReward = isCorrect ? 1.0 : 0.0;

  const switchProblem = (i: number) => { setProblem(i); setAttempt(0); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          RLVR: Verifiable vs. Learned Rewards
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare binary verifiable rewards with learned reward models to see how Goodhart's Law affects training.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {PROBLEMS.map((_, i) => (
          <button key={i} onClick={() => switchProblem(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
            background: problem === i ? '#2C3E2D' : 'transparent', color: problem === i ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
          }}>Problem {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.25rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Problem</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', color: '#2C3E2D', fontWeight: 600 }}>{p.question}</div>
        <div style={{ fontSize: '0.75rem', color: '#8B9B8D', marginTop: '0.35rem' }}>Ground truth: <strong style={{ color: '#8BA888' }}>{String(p.groundTruth)}</strong></div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {p.attempts.map((_, i) => (
          <button key={i} onClick={() => setAttempt(i)} style={{
            padding: '0.3rem 0.65rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
            background: attempt === i ? '#2C3E2D' : 'transparent', color: attempt === i ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.75rem', fontWeight: 600,
          }}>Attempt {i + 1}</button>
        ))}
      </div>

      <div style={{ background: isCorrect ? '#8BA88808' : '#C76B4A08', border: `1px solid ${isCorrect ? '#8BA88833' : '#C76B4A33'}`, borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.35rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Reasoning chain</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.7, marginBottom: '0.5rem' }}>{a.chain}</div>
        <div style={{ fontSize: '0.82rem', color: '#2C3E2D' }}>
          Answer: <strong style={{ color: isCorrect ? '#8BA888' : '#C76B4A' }}>{String(a.answer)}</strong>
          <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.12rem 0.4rem', borderRadius: '4px', background: isCorrect ? '#8BA88822' : '#C76B4A22', color: isCorrect ? '#8BA888' : '#C76B4A', fontWeight: 700 }}>
            {isCorrect ? 'CORRECT' : 'INCORRECT'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Verifiable reward</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.5rem', fontWeight: 700, color: verifiedReward === 1 ? '#8BA888' : '#C76B4A' }}>{verifiedReward.toFixed(1)}</div>
          <div style={{ height: '8px', background: '#E5DFD3', borderRadius: '4px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${verifiedReward * 100}%`, background: verifiedReward === 1 ? '#8BA888' : '#C76B4A', borderRadius: '4px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#8B9B8D', marginTop: '0.4rem' }}>Binary: exact match only</div>
        </div>

        <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Learned reward</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.5rem', fontWeight: 700, color: a.learnedScore > 0.8 ? (isCorrect ? '#8BA888' : '#D4A843') : '#C76B4A' }}>{a.learnedScore.toFixed(2)}</div>
          <div style={{ height: '8px', background: '#E5DFD3', borderRadius: '4px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${a.learnedScore * 100}%`, background: a.learnedScore > 0.8 ? (isCorrect ? '#8BA888' : '#D4A843') : '#C76B4A', borderRadius: '4px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#8B9B8D', marginTop: '0.4rem' }}>
            {!isCorrect && a.learnedScore > 0.7 ? <span style={{ color: '#D4A843', fontWeight: 600 }}>Goodhart's Law: high score despite wrong answer</span> : 'Continuous: plausibility-based'}
          </div>
        </div>
      </div>

      {!isCorrect && a.learnedScore > 0.7 && (
        <div style={{ marginTop: '0.75rem', background: '#D4A84311', border: '1px solid #D4A84333', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
          <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>
            <strong style={{ color: '#D4A843' }}>Goodhart's Law:</strong> The learned reward model gives a high score ({a.learnedScore.toFixed(2)}) to an incorrect answer because the reasoning sounds plausible. Verifiable rewards avoid this by checking the actual answer.
          </div>
        </div>
      )}
    </div>
  );
}
