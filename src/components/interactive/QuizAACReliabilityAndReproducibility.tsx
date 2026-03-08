import { useState } from 'react';
export default function QuizAACReliabilityAndReproducibility() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: '90% success rate is good enough.', isTrue: false, explanation: 'Whether 90% is acceptable depends entirely on the application, volume, and consequences of failure. For a coding assistant used 10 times a day, 90% means roughly one failure per day -- tolerable.' },
    { text: 'Always report confidence intervals with success rates.', isTrue: true, explanation: 'For n trials with k successes, use the Wilson score interval or Clopper-Pearson interval for small samples. Report 95% CIs as standard practice.' },
    { text: 'Non-determinism is always bad.', isTrue: false, explanation: 'Some non-determinism is actually beneficial. An agent that takes slightly different paths on different runs may find solutions that a fully deterministic agent would miss.' },
    { text: 'To distinguish between 80% and 90% success rates with 95% confidence, you need approximately 200 runs.', isTrue: true, explanation: 'To distinguish 95% from 99%, you need approximately 1,000 runs. Plan evaluation budgets accordingly.' },
    { text: 'A single successful test means the agent works.', isTrue: false, explanation: 'A single success on a non-deterministic system provides almost no reliability information. The agent might succeed 99% of the time or 10% of the time -- you cannot tell from one run.' },
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
