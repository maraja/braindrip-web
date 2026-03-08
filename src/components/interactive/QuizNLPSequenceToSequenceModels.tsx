import { useState } from 'react';
export default function QuizNLPSequenceToSequenceModels() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'The context vector captures all the information in the source sequence.', isTrue: false, explanation: 'For short sequences (under 15 tokens), this is roughly true. For longer sequences, critical information is inevitably lost.' },
    { text: '4-layer LSTM, 1000 hidden units, 1000-dimensional word embeddings, 160K source vocabulary, 80K target vocabulary, 384M parameters total.', isTrue: true, explanation: 'Trained on 12M sentence pairs (WMT English-French) using 8 GPUs for 10 days.' },
    { text: 'Teacher forcing is cheating.', isTrue: false, explanation: 'Teacher forcing is not cheating -- it is an efficient training strategy that provides the model with the correct conditioning context. The exposure bias it introduces is a real issue, but in practice, beam search at inference time and techniques like scheduled sampling effectively mitigate it.' },
    { text: 'Reversing the source sequence improved BLEU from 30.6 to 33.3 (+2.7 points) on English-to-French, likely because it shortens the average gradient path between corresponding input-output pairs.', isTrue: true, explanation: 'Reversing the source sequence improved BLEU from 30.6 to 33.3 (+2.7 points) on English-to-French, likely because it shortens the average gradient path between corresponding input-output pairs.' },
    { text: 'Seq2seq models are obsolete.', isTrue: false, explanation: 'The encoder-decoder architecture is alive and well in Transformer-based models. T5, BART, and mBART are all seq2seq models -- they simply replace the LSTM encoder and decoder with Transformer blocks.' },
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
