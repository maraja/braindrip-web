import { useState } from 'react';
export default function QuizAACMetacognition() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'LLMs cannot be metacognitive because they don\'t truly understand their knowledge.', isTrue: false, explanation: 'While LLMs do not have introspective access to their weights, they can approximate metacognition through prompting. The practical effect (better-calibrated outputs, appropriate help-seeking) is what matters, not the mechanism.' },
    { text: 'Compare the agent\'s stated confidence (e.g., "I\'m 80% sure") with actual accuracy.', isTrue: true, explanation: 'Well-calibrated agents are right 80% of the time when they say 80%. LLMs tend to be overconfident; explicit calibration prompting helps' },
    { text: 'Saying \'I don\'t know\' makes the agent less useful.', isTrue: false, explanation: 'The opposite is true. An agent that says "I don\'t know" when appropriate is more useful because every positive response can be trusted.' },
    { text: 'The percentage of questions where the agent declines to answer or defers to a human.', isTrue: true, explanation: 'Too low suggests insufficient metacognition; too high suggests excessive caution. Optimal rates depend on the domain (medical: high abstention; general knowledge: lower)' },
    { text: 'Confidence scores from LLMs are reliable.', isTrue: false, explanation: 'They are not, at least not without calibration. Raw LLM confidence tends to be overconfident.' },
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
