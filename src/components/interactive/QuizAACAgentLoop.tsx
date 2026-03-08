import { useState } from 'react';
export default function QuizAACAgentLoop() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'The agent plans all steps upfront and then executes them.', isTrue: false, explanation: 'Most agents do not create a complete plan and then execute it sequentially. They plan one or a few steps ahead, execute, observe results, and replan.' },
    { text: 'Simple tasks complete in 3-8 iterations.', isTrue: true, explanation: 'Moderate tasks require 10-30. Complex tasks (multi-file refactoring, debugging) may require 50-150 iterations.' },
    { text: 'More loop iterations always means better results.', isTrue: false, explanation: 'There is a clear point of diminishing returns. After roughly 50-100 iterations on a single task, agents tend to start looping unproductively — revisiting the same approaches, making contradictory changes, or losing coherence.' },
    { text: 'Each iteration takes 1-10 seconds depending on LLM inference time (0.5-5s) plus tool execution time (0.1-5s).', isTrue: true, explanation: 'A 30-iteration task takes roughly 1-5 minutes wall-clock time.' },
    { text: 'The loop runs until the LLM says \'I\'m done.\'', isTrue: false, explanation: 'While the LLM\'s decision to stop calling tools is one termination condition, it is not the only one and not always the most important. Max-step limits, token budgets, error thresholds, and human interrupts all serve as essential safety nets.' },
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
