import { useState } from 'react';
export default function QuizNLPConvolutionalModelsForText() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'CNNs cannot capture any long-range dependencies.', isTrue: false, explanation: 'While a single convolutional layer is limited to its filter width, stacking layers increases the receptive field linearly (or exponentially with dilated convolutions). Deep CNNs can and do capture dependencies spanning 50+ tokens.' },
    { text: 'SST-2 binary sentiment: 88.1% accuracy.', isTrue: true, explanation: 'MR (movie reviews): 81.5%. TREC question classification: 93.6%.' },
    { text: 'CNNs are strictly inferior to RNNs for NLP.', isTrue: false, explanation: 'For sentence-level classification, CNNs are often equal or superior to RNNs while being faster to train. The RNN advantage emerges primarily for tasks requiring token-level predictions over long sequences (language modeling, machine translation without dilated convolutions).' },
    { text: '40.51 BLEU on WMT\'14 En-Fr (vs.', isTrue: true, explanation: '38.95 for GNMT with attention). Trained in 1.5 days on 8 GPUs vs.' },
    { text: 'Max-over-time pooling loses positional information.', isTrue: false, explanation: 'This is partially true -- max pooling discards exactly where a pattern was detected. For classification, position is often irrelevant ("terrible" is negative whether it appears at the beginning or end).' },
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
