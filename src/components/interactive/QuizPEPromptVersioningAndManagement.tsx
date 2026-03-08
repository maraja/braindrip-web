import { useState } from 'react';
export default function QuizPEPromptVersioningAndManagement() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Prompts are too simple to need version control.', isTrue: false, explanation: 'Production prompts are often 500-5,000 tokens long, contain complex logic, and directly determine application behavior. They are as complex as many source code files and have the same (or greater) impact on user experience.' },
    { text: 'Use semantic versioning (e.g., v2.3.1) or date-based versioning (e.g., 2024-01-15-a) to clearly identify prompt versions.', isTrue: true, explanation: 'Include a hash for exact match verification.' },
    { text: 'Git is sufficient for prompt management.', isTrue: false, explanation: 'Git provides version control but lacks prompt-specific features: A/B testing, deployment management, metric association, and registry functionality. Git is a necessary foundation but not a complete solution.' },
    { text: '20-50 test cases per prompt is a practical starting point; critical applications may require 100-200+.', isTrue: true, explanation: 'Tests should cover both positive cases (correct behavior) and negative cases (constraint adherence).' },
    { text: 'You can evaluate prompt changes by reading the prompt.', isTrue: false, explanation: 'Reading a prompt change can identify obvious problems but cannot predict subtle behavioral impacts. Automated regression testing and A/B testing are necessary for reliable evaluation because prompts interact with model behavior in non-obvious ways.' },
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
