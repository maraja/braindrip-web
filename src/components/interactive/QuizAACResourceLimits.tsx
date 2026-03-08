import { useState } from 'react';
export default function QuizAACResourceLimits() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Unlimited agents produce better results.', isTrue: false, explanation: 'Counterintuitively, unconstrained agents often produce worse results because they waste resources on unproductive paths. Research on cognitive forcing functions shows that bounded resources force more strategic behavior, similar to how chess players make better moves under time pressure up to a point.' },
    { text: 'Limits can be hierarchical: a per-step token limit (max 4,000 tokens per LLM call), a per-task limit (max 200,000 tokens total), and a per-user daily limit (max 2,000,000 tokens per day).', isTrue: true, explanation: 'Each level catches different failure modes.' },
    { text: 'If the agent hits a limit, it failed.', isTrue: false, explanation: 'Hitting a limit is not failure; it is controlled termination. The agent should return partial results, which are often useful.' },
    { text: 'Limits are enforced in the agent loop controller, not by the LLM itself.', isTrue: true, explanation: 'Before each LLM call or tool invocation, the controller checks remaining budget. If insufficient budget remains, it either forces a summary/completion step or halts execution.' },
    { text: 'Setting limits is easy.', isTrue: false, explanation: 'Calibrating limits requires empirical data. Set too tight, and agents fail on legitimate tasks, frustrating users.' },
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
