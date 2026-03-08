import { useState } from 'react';
export default function QuizLLE06UlmfitAndTransferLearning() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'ULMFiT was the first use of pre-trained language models.', isTrue: false, explanation: 'Pre-trained word embeddings (Word2Vec, GloVe) and semi-supervised approaches existed before. ULMFiT\'s contribution was the fine-tuning methodology that made full model transfer learning work reliably for NLP.' },
    { text: '3-layer AWD-LSTM (Merity et al., 2017); 1150 hidden units, 400-dimensional embeddings', isTrue: true, explanation: '3-layer AWD-LSTM (Merity et al., 2017); 1150 hidden units, 400-dimensional embeddings' },
    { text: 'ULMFiT only works for text classification.', isTrue: false, explanation: 'The paper focused on classification, but the transfer learning techniques (discriminative LR, gradual unfreezing, STLR) are general. They\'ve been applied to sequence labeling, generation, and other tasks.' },
    { text: 'Wikitext-103 (~103M tokens from 28,595 Wikipedia articles)', isTrue: true, explanation: 'Wikitext-103 (~103M tokens from 28,595 Wikipedia articles)' },
    { text: 'Discriminative learning rates are just a heuristic.', isTrue: false, explanation: 'While the specific factor of 2.6 was found empirically, the principle is grounded in the observation (supported by visualization studies) that lower layers learn more general features and higher layers learn more task-specific features. Adjusting learning rates by layer is now standard practice.' },
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
