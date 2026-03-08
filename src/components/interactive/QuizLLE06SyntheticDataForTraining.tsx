import { useState } from 'react';
export default function QuizLLE06SyntheticDataForTraining() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Synthetic data is lower quality than human data.', isTrue: false, explanation: 'It depends entirely on the generation process. Carefully filtered synthetic data from capable models can exceed the average quality of scraped web text.' },
    { text: '175 seed tasks -&gt; 52K generated examples, 33% improvement on GPT-3', isTrue: true, explanation: '175 seed tasks -&gt; 52K generated examples, 33% improvement on GPT-3' },
    { text: 'Training on synthetic data leads to model collapse.', isTrue: false, explanation: 'Shumailov et al. (2023) showed that iteratively training on self-generated data without fresh data can degrade quality.' },
    { text: '$600 of GPT-3.5 API calls -&gt; 52K examples -&gt; fine-tuned LLaMA 7B', isTrue: true, explanation: '$600 of GPT-3.5 API calls -&gt; 52K examples -&gt; fine-tuned LLaMA 7B' },
    { text: 'Synthetic data is just copying the teacher model.', isTrue: false, explanation: 'Synthetic data generation involves the teacher model producing novel outputs (new instructions, new reasoning traces, new examples) that it was not explicitly trained on. The diversity of synthetic data often exceeds what any single training example from the teacher could provide.' },
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
