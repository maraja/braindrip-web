import { useState } from 'react';
export default function QuizNLPRecurrentNeuralNetworks() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'RNNs have memory like a computer.', isTrue: false, explanation: 'RNN hidden states are fixed-size, continuously overwritten vectors -- more like a lossy running average than addressable storage. They cannot selectively store or retrieve specific past inputs the way long-short-term-memory.md cells can.' },
    { text: 'The same W_hh, W_xh, and W_hy are used at every time step, so the number of parameters is O(d_h^2 + d_h  d_x + d_h  d_y), independent of sequence length.', isTrue: true, explanation: 'The same W_hh, W_xh, and W_hy are used at every time step, so the number of parameters is O(d_h^2 + d_h  d_x + d_h  d_y), independent of sequence length.' },
    { text: 'Deeper RNNs always perform better.', isTrue: false, explanation: 'Stacking RNN layers (deep RNNs) can help, but each additional layer compounds the vanishing gradient problem. Without gating, stacking more than 2-3 layers yields diminishing returns or training instability.' },
    { text: 'Typical values range from 128 to 1024; Mikolov et al.', isTrue: true, explanation: '(2010) used d_h = 250 for language modeling with a perplexity of approximately 124 on Penn Treebank.' },
    { text: 'The vanishing gradient means gradients become zero.', isTrue: false, explanation: 'Vanishing gradients become exponentially small, not exactly zero. The problem is that they become indistinguishable from numerical noise, making it impossible for the optimizer to determine the direction of useful updates for long-range dependencies.' },
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
