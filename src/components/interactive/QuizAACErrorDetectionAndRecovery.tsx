import { useState } from 'react';
export default function QuizAACErrorDetectionAndRecovery() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Good agents don\'t make errors.', isTrue: false, explanation: 'All agents operating in real environments encounter errors. The quality of an agent is measured not by the absence of errors but by the sophistication of its error handling.' },
    { text: 'Transient errors (rate limits, timeouts) resolve on retry 70-90% of the time with appropriate backoff; semantic errors resolve on rephrase-and-retry 40-60% of the time', isTrue: true, explanation: 'Transient errors (rate limits, timeouts) resolve on retry 70-90% of the time with appropriate backoff; semantic errors resolve on rephrase-and-retry 40-60% of the time' },
    { text: 'Retrying is always the right first response.', isTrue: false, explanation: 'Retrying only works for transient errors. Retrying a logical error or a fundamentally wrong approach wastes resources.' },
    { text: 'Explicit error detection is essentially free (status code check).', isTrue: true, explanation: 'Semantic error detection costs one additional LLM call per action (~200-500 tokens). Logical error detection via self-critique costs ~500-1000 tokens' },
    { text: 'Error handling is an edge case concern.', isTrue: false, explanation: 'In production systems, error handling code often exceeds the happy-path code in both volume and complexity. Treating it as an afterthought produces fragile systems.' },
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
