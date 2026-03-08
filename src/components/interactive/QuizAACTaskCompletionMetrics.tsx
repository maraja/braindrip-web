import { useState } from 'react';
export default function QuizAACTaskCompletionMetrics() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Binary metrics are always inferior to graded metrics.', isTrue: false, explanation: 'Binary metrics are appropriate when the task has truly binary success criteria (the file was uploaded or it was not, the email was sent or it was not). Forcing graded metrics onto binary tasks creates artificial distinctions.' },
    { text: 'For coding tasks, automated test suites serve as evaluation oracles.', isTrue: true, explanation: 'But tests can be incomplete (missing edge cases), overfitted (only testing the specific solution approach), or wrong (tests that pass for incorrect code). High-quality evaluation requires well-crafted test suites that cover diverse solution approaches.' },
    { text: 'Higher scores always mean better performance.', isTrue: false, explanation: 'Metric scores are only as good as the metric design. A high score on a poorly designed metric is meaningless.' },
    { text: 'For graded metrics using human evaluators, measure inter-annotator agreement (Cohen\'s kappa or Krippendorff\'s alpha).', isTrue: true, explanation: 'Agreement below 0.7 suggests the rubric needs refinement. Low agreement means the metric is measuring evaluator variance, not agent quality.' },
    { text: 'One metric is sufficient.', isTrue: false, explanation: 'No single metric captures all quality dimensions. A coding agent with 100% test pass rate but terrible code readability is not truly high-quality.' },
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
