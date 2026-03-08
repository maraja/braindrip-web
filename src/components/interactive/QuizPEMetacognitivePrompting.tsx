import { useState } from 'react';
export default function QuizPEMetacognitivePrompting() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'The model truly knows what it knows.', isTrue: false, explanation: 'LLMs do not have genuine self-awareness or introspective access to their parameters. When a model reports confidence, it is generating text that is likely given the prompt and its training data, not performing actual self-evaluation.' },
    { text: '1-10 numerical scales produce more granular signals than binary (certain/uncertain); 1-5 scales are a reasonable compromise between granularity and consistency.', isTrue: true, explanation: '1-10 numerical scales produce more granular signals than binary (certain/uncertain); 1-5 scales are a reasonable compromise between granularity and consistency.' },
    { text: 'Asking for confidence eliminates hallucination.', isTrue: false, explanation: 'A model can hallucinate and simultaneously report high confidence. Metacognitive prompting reduces the rate of confident hallucination but does not eliminate it.' },
    { text: 'Asking the model to identify potential error modes before answering reduces hallucination rates by an estimated 10-20% on knowledge-intensive tasks.', isTrue: true, explanation: 'Asking the model to identify potential error modes before answering reduces hallucination rates by an estimated 10-20% on knowledge-intensive tasks.' },
    { text: 'Low confidence means the answer is wrong.', isTrue: false, explanation: 'Low confidence means the model\'s generated text suggests uncertainty, which correlates with but does not determine incorrectness. Many low-confidence answers are correct; the model may express uncertainty about a fact that it actually has correct information about.' },
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
