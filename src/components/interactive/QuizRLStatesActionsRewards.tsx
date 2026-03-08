import { useState } from 'react';
export default function QuizRLStatesActionsRewards() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'The state is the same as the observation.', isTrue: false, explanation: 'In a fully observable MDP, yes. In a POMDP, the observation O_t is a lossy projection of the true state S_t.' },
    { text: 'R_&#123;total&#125; = R_&#123;extrinsic&#125; +   R_&#123;intrinsic&#125;, where R_&#123;intrinsic&#125; might measure prediction error or state novelty (Pathak et al., 2017).', isTrue: true, explanation: 'R_&#123;total&#125; = R_&#123;extrinsic&#125; +   R_&#123;intrinsic&#125;, where R_&#123;intrinsic&#125; might measure prediction error or state novelty (Pathak et al., 2017).' },
    { text: 'More reward signal is always better.', isTrue: false, explanation: 'Overly engineered dense rewards can introduce bias, guiding the agent toward a suboptimal strategy that happens to collect intermediate rewards. Sometimes less is more.' },
    { text: 'Continuous action spaces are always harder.', isTrue: false, explanation: 'They eliminate the possibility of exhaustive enumeration, but algorithms like SAC achieve strong performance by leveraging gradient-based optimization through the policy. The difficulty depends on the structure of the problem, not just the space type.' },
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
