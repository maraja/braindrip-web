import { useState } from 'react';
export default function QuizNLPGptForNlpTasks() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'GPT cannot do NLU tasks, only generation.', isTrue: false, explanation: 'GPT performs understanding tasks by reformulating them as generation. GPT-3 few-shot on COPA (causal reasoning) achieves 92% accuracy, and fine-tuned GPT-1 matched BERT on many GLUE tasks.' },
    { text: 'Estimated $4.6M (in 2020 cloud compute prices), ~3,640 petaflop-days.', isTrue: true, explanation: 'Estimated $4.6M (in 2020 cloud compute prices), ~3,640 petaflop-days.' },
    { text: 'Few-shot learning means the model learns from the examples.', isTrue: false, explanation: 'In-context learning does not involve gradient updates. The examples activate patterns already learned during pre-training.' },
    { text: 'GPT-3 few-shot (32 examples) on SuperGLUE: 71.8 (vs.', isTrue: true, explanation: 'fine-tuned BERT-large: 82.1, fine-tuned T5-11B: 89.3).' },
    { text: 'GPT-3 is always better than fine-tuned BERT.', isTrue: false, explanation: 'For specific tasks with sufficient labeled data, a fine-tuned BERT-large (340M parameters) often outperforms GPT-3 few-shot (175B parameters). Fine-tuned GPT-3 is typically best, but few-shot GPT-3 trades accuracy for flexibility and zero training cost.' },
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
