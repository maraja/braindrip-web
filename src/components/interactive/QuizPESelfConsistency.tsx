import { useState } from 'react';
export default function QuizPESelfConsistency() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Self-consistency requires different prompts for each sample.', isTrue: false, explanation: 'All samples use the identical prompt. Diversity comes solely from temperature-based sampling during generation, not from prompt variation.' },
    { text: 'GSM8K accuracy improved from 58% (single CoT) to 74.4% (40-sample self-consistency) with PaLM 540B, a 16.4 percentage point gain.', isTrue: true, explanation: 'GSM8K accuracy improved from 58% (single CoT) to 74.4% (40-sample self-consistency) with PaLM 540B, a 16.4 percentage point gain.' },
    { text: 'More samples is always worth the cost.', isTrue: false, explanation: 'The diminishing returns curve means that doubling from 5 to 10 samples might yield only a 2-3% accuracy gain while doubling cost. For most applications, 3-5 samples hit the optimal cost-accuracy trade-off.' },
    { text: '0.5-0.7 provides good diversity without excessive incoherence; temperature 0 defeats the purpose (identical outputs), temperature 1.0+ introduces too much noise.', isTrue: true, explanation: '0.5-0.7 provides good diversity without excessive incoherence; temperature 0 defeats the purpose (identical outputs), temperature 1.0+ introduces too much noise.' },
    { text: 'Self-consistency works for any task.', isTrue: false, explanation: 'It works best on tasks with discrete, verifiable answers (math, classification, multiple-choice). For open-ended generation (essay writing, creative tasks), there is no clear notion of "majority vote" and the technique does not directly apply.' },
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
