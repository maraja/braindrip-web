import { useState } from 'react';
export default function QuizLLE07TheBottlenecksThatMotivatedTransformers() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'The Transformer was invented to solve a single bottleneck.', isTrue: false, explanation: 'It addressed all three simultaneously. Replacing recurrence with self-attention solved the parallelization problem; direct attention between all positions solved the gradient flow problem; context-dependent representations at every position solved the compression problem.' },
    { text: 'RNNs require O(n) sequential operations for sequence length n; Transformers require O(1) (all positions processed in parallel)', isTrue: true, explanation: 'RNNs require O(n) sequential operations for sequence length n; Transformers require O(1) (all positions processed in parallel)' },
    { text: 'Attention already solved these bottlenecks.', isTrue: false, explanation: 'Attention (Bahdanau, Luong) addressed the fixed-length bottleneck between encoder and decoder but did not address sequential processing within the encoder or decoder. The key Transformer insight was applying attention everywhere — self-attention within each layer, not just cross-attention between encoder and decoder.' },
    { text: 'Empirically ~200 tokens (Khandelwal et al., 2018); Transformers scale to the full context window', isTrue: true, explanation: 'Empirically ~200 tokens (Khandelwal et al., 2018); Transformers scale to the full context window' },
    { text: 'LSTMs are fundamentally inferior to Transformers.', isTrue: false, explanation: 'LSTMs have O(n) computational complexity per sequence, while Transformer self-attention is O(n^2). For very long sequences, LSTMs are actually more computationally efficient — they just can\'t parallelize.' },
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
