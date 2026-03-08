import { useState } from 'react';
export default function QuizAACAgentEvaluationMethods() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Pass/fail on a test set is sufficient evaluation.', isTrue: false, explanation: 'Binary pass/fail ignores partial success, quality of the solution, efficiency, and reliability. A 70% pass rate tells you nothing about why the 30% failed or whether the 70% that passed produced high-quality solutions.' },
    { text: 'With non-deterministic agents, report confidence intervals, not just point estimates.', isTrue: true, explanation: 'A success rate of 80% with n=10 has a 95% CI of [44%, 97%]. Meaningful comparisons between agent versions require sufficient sample sizes (typically 50-100 tasks minimum).' },
    { text: 'LLM-as-judge is objective.', isTrue: false, explanation: 'LLM judges have systematic biases: they prefer longer responses (verbosity bias), prefer responses that appear first in the prompt (position bias), and may prefer responses from their own model family (self-preference bias). Careful prompt design and calibration mitigate but do not eliminate these biases.' },
    { text: 'Curate evaluation datasets with diverse task types, difficulty levels, and edge cases.', isTrue: true, explanation: 'Include tasks where the agent should refuse (safety evaluation), tasks with ambiguous instructions (alignment evaluation), and multi-step tasks with failure recovery opportunities (robustness evaluation).' },
    { text: 'More evaluation tasks are always better.', isTrue: false, explanation: 'A well-designed evaluation set of 100 diverse, representative tasks is more informative than 1000 similar tasks that test the same capability. Coverage of different task types, difficulty levels, and edge cases matters more than raw count.' },
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
