import { useState } from 'react';
export default function QuizRLDuelingDqn() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Dueling DQN uses two separate networks.', isTrue: false, explanation: 'It is a single network with a shared backbone and two heads (streams). There is only one set of convolutional features, and the entire network is trained end-to-end with a single loss.' },
    { text: 'On Atari, dueling DQN improves median human-normalized score from ~117% (Double DQN baseline) to ~140%, with large gains on games with many "irrelevant-action" states.', isTrue: true, explanation: 'On Atari, dueling DQN improves median human-normalized score from ~117% (Double DQN baseline) to ~140%, with large gains on games with many "irrelevant-action" states.' },
    { text: 'The value stream learns V^ exactly.', isTrue: false, explanation: 'The value stream learns an approximation shaped by the mean-subtraction identifiability constraint. It is not supervised to match V^ directly -- it is trained only through the combined Q-value loss.' },
    { text: 'Mean subtraction (&#123;1&#125;&#123;&#125; A) is preferred over max subtraction ( A) because it provides smoother gradients and does not change the optimal action ranking.', isTrue: true, explanation: 'Mean subtraction (&#123;1&#125;&#123;&#125; A) is preferred over max subtraction ( A) because it provides smoother gradients and does not change the optimal action ranking.' },
    { text: 'Dueling DQN is only useful for large action spaces.', isTrue: false, explanation: 'While the benefit scales with action space size, the architecture also helps in small action spaces by providing better gradient flow to the value estimate. It improved Atari performance even with only 4--18 actions.' },
  ];
  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '1.5rem', margin: '2rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#C76B4A', fontWeight: 600 }}>&#10022;</span>
        <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '1rem', fontWeight: 600, color: '#2C3E2D' }}>Quick Check</span>
        <span style={{ fontSize: '0.7rem', color: '#8BA888', fontFamily: "'JetBrains Mono', monospace", marginLeft: 'auto' }}>
          {Object.keys(answers).length}/{questions.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {questions.map((q, i) => (
          <div key={i} style={{ background: answers[i] !== undefined ? (answers[i] === q.isTrue ? '#f0f7f0' : '#fdf0ed') : '#F0EBE1', borderRadius: '10px', padding: '0.875rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#2C3E2D', margin: 0, lineHeight: 1.5 }}>{q.text}</p>
            {answers[i] === undefined ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={() => setAnswers(a => ({ ...a, [i]: true }))} style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>True</button>
                <button onClick={() => setAnswers(a => ({ ...a, [i]: false }))} style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>False</button>
              </div>
            ) : (
              <p style={{ fontSize: '0.78rem', color: answers[i] === q.isTrue ? '#4a7c59' : '#C76B4A', marginTop: '0.375rem', marginBottom: 0, lineHeight: 1.4 }}>
                {answers[i] === q.isTrue ? '\u2713 ' : '\u2717 '}{q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
