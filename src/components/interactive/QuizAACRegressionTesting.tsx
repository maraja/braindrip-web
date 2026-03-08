import { useState } from 'react';
export default function QuizAACRegressionTesting() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Unit tests are sufficient for agent testing.', isTrue: false, explanation: 'Unit tests verify individual components (tool implementations, prompt formatting) but miss integration issues (does the agent use the tool correctly in context?). Agent regression testing is integration testing by nature -- it tests the full agent pipeline end-to-end.' },
    { text: 'A practical regression suite contains 50-200 tasks.', isTrue: true, explanation: 'Fewer tasks miss important capabilities; more tasks increase CI run time and cost. Prioritize breadth of coverage over depth in any single capability.' },
    { text: 'You can pin the model version to prevent regressions.', isTrue: false, explanation: 'Model pinning prevents provider-induced regressions but freezes improvements and may not be available for all providers. Some providers update models in-place without version changes.' },
    { text: 'Each regression run costs money (LLM API calls).', isTrue: true, explanation: 'Budget approximately: (number of tasks) x (runs per task) x (cost per run). A 100-task suite with 3 runs each at 0.10/run costs 30 per CI run.' },
    { text: 'Regression testing is too expensive for AI agents.', isTrue: false, explanation: 'A well-designed suite of 100 tasks with 3 runs each costs $20-50 per CI run. This is far less than the cost of shipping a regression to production and debugging it after user complaints.' },
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
