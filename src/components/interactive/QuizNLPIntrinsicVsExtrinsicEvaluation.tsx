import { useState } from 'react';
export default function QuizNLPIntrinsicVsExtrinsicEvaluation() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Intrinsic evaluation is useless.', isTrue: false, explanation: 'Intrinsic metrics remain valuable for rapid development iteration, debugging, and understanding what a model has learned. Probing tasks reveal interpretable properties of representations that downstream accuracy alone cannot expose.' },
    { text: 'Yin and Shen (2018) found intrinsic benchmarks favor higher dimensions (300--500), while downstream tasks often plateau at 100--300 dimensions.', isTrue: true, explanation: 'Yin and Shen (2018) found intrinsic benchmarks favor higher dimensions (300--500), while downstream tasks often plateau at 100--300 dimensions.' },
    { text: 'Better perplexity always means better downstream performance.', isTrue: false, explanation: 'This holds roughly at large scale differences (perplexity 140 vs. 20 matters enormously), but not for small differences (perplexity 20 vs.' },
    { text: 'A random baseline scores ~45 on GLUE; BERT-base scores ~79; human performance is ~87.', isTrue: true, explanation: 'On SuperGLUE, BERT-large scores ~69 while human performance is ~90.' },
    { text: 'Extrinsic evaluation is always the right choice.', isTrue: false, explanation: 'Extrinsic evaluation requires choosing a downstream task, and results may not generalize across tasks. A component that helps sentiment classification may not help NER.' },
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
