import { useState } from 'react';
export default function QuizNLPHumanEvaluationForNlp() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Human evaluation is objective and unbiased.', isTrue: false, explanation: 'Human judges bring substantial subjectivity, cultural assumptions, and cognitive biases. Agreement rates of 0.30--0.50 kappa on generation quality show that even trained annotators frequently disagree.' },
    { text: 'Annually evaluates ~150 MT systems across 15+ language pairs using Direct Assessment with ~1,000 annotators and ~500,000 individual judgments.', isTrue: true, explanation: 'Annually evaluates ~150 MT systems across 15+ language pairs using Direct Assessment with ~1,000 annotators and ~500,000 individual judgments.' },
    { text: 'Crowdsourced evaluation is as reliable as expert evaluation.', isTrue: false, explanation: 'For straightforward tasks (fluency, grammaticality), crowdworkers perform comparably to experts. But for tasks requiring domain knowledge (medical text quality, legal accuracy) or nuanced judgment (pragmatic appropriateness, cultural sensitivity), expert annotators are necessary and produce significantly higher agreement.' },
    { text: 'Professional human evaluation for a single MT system on one language pair costs 2,000--5,000.', isTrue: true, explanation: 'Crowdsourced evaluation via Amazon Mechanical Turk costs 500--1,500 for the same scope.' },
    { text: 'Human evaluation gives a single \'correct\' score.', isTrue: false, explanation: 'The same output can be rated differently depending on the evaluator\'s background, the evaluation criteria, and even the time of day. Human evaluation produces a distribution of judgments, not a point estimate.' },
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
