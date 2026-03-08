import { useState } from 'react';
export default function QuizAACAgentBenchmarks() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'High benchmark scores mean the agent works well in production.', isTrue: false, explanation: 'Benchmarks test specific, well-defined tasks. Production tasks are diverse, messy, and often underspecified.' },
    { text: 'Agent benchmarks require reproducible environments.', isTrue: true, explanation: 'SWE-bench uses specific repository commits and test suites. WebArena uses self-hosted web applications with deterministic state reset.' },
    { text: 'Benchmarks measure all important capabilities.', isTrue: false, explanation: 'Current benchmarks focus on task completion in well-defined environments. They do not measure important real-world qualities like handling ambiguous instructions, maintaining context over long sessions, or recovering gracefully from unexpected errors.' },
    { text: 'A full SWE-bench Lite evaluation (300 tasks, multiple runs) costs $500-5,000 in API fees depending on the agent.', isTrue: true, explanation: 'WebArena requires hosting the web environments. Benchmark evaluation is a significant cost, limiting how frequently it can be run.' },
    { text: 'The best agent on one benchmark is the best overall.', isTrue: false, explanation: 'Different benchmarks measure different capabilities. An agent optimized for coding (SWE-bench) may perform poorly on web interaction (WebArena) and vice versa.' },
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
