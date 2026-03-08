import { useState } from 'react';
export default function QuizLLE02RecurrentNeuralNetworksAndLstms() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'LSTMs solved the vanishing gradient problem completely.', isTrue: false, explanation: 'LSTMs significantly mitigated it, extending effective memory from ~10 to ~200+ tokens. But they did not eliminate it — very long-range dependencies (thousands of tokens) still degraded.' },
    { text: 'Elman networks (1990); effective memory of ~10-20 timesteps due to vanishing gradients', isTrue: true, explanation: 'Elman networks (1990); effective memory of ~10-20 timesteps due to vanishing gradients' },
    { text: 'RNNs are obsolete and have no modern use.', isTrue: false, explanation: 'While Transformers dominate NLP, RNN variants like state-space models (Mamba, 2023) and RWKV have seen renewed interest for their linear-time inference scaling. The core idea of recurrent state has not died — it has been reimagined.' },
    { text: 'Standard for NLP by 2015-2016; doubled parameter count but captured both forward and backward context', isTrue: true, explanation: 'Standard for NLP by 2015-2016; doubled parameter count but captured both forward and backward context' },
    { text: 'GRUs are strictly worse than LSTMs.', isTrue: false, explanation: 'Empirical evidence is mixed. GRUs often match LSTMs on shorter sequences and smaller datasets while training faster.' },
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
