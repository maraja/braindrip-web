import { useState } from 'react';
export default function QuizCVCVisualQuestionAnswering() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'High VQA accuracy means the model understands the image.', isTrue: false, explanation: 'Models exploit strong language priors. For "What sport is being played?" the answer "tennis" is often correct without looking at the image.' },
    { text: '1.1M questions on 204K COCO images, with 10 human answers per question; balanced to reduce language bias', isTrue: true, explanation: '1.1M questions on 204K COCO images, with 10 human answers per question; balanced to reduce language bias' },
    { text: 'VQA is a solved problem.', isTrue: false, explanation: 'While headline numbers approach human performance (~82% vs ~83% on VQA v2.0), models still fail catastrophically on compositional questions, counting, spatial reasoning, and questions requiring world knowledge.' },
    { text: 'Simple baselines ~50% (2015); attention models ~70% (2018); pretrained VL models ~76% (2021); multimodal LLMs ~82% (2023); human performance ~83%', isTrue: true, explanation: 'Simple baselines ~50% (2015); attention models ~70% (2018); pretrained VL models ~76% (2021); multimodal LLMs ~82% (2023); human performance ~83%' },
    { text: 'Open-ended VQA is fundamentally different from classification VQA.', isTrue: false, explanation: 'In practice, 82% of VQA v2.0 answers come from a vocabulary of just 3,129 words. Generative models produce the same short answers; the two formulations converge on common benchmarks.' },
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
