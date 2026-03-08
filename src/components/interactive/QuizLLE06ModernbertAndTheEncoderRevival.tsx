import { useState } from 'react';
export default function QuizLLE06ModernbertAndTheEncoderRevival() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'ModernBERT is just BERT with more data.', isTrue: false, explanation: 'While the 600x increase in training data is the single largest improvement, the architectural changes (RoPE, Flash Attention, GeGLU, unpadding) are each individually significant. RoPE enables the 16x context extension.' },
    { text: '22 layers, 768 hidden, 12 heads, 149M params, 8,192 context', isTrue: true, explanation: '22 layers, 768 hidden, 12 heads, 149M params, 8,192 context' },
    { text: 'ModernBERT shows encoders are better than decoders.', isTrue: false, explanation: 'ModernBERT shows encoders are better than decoders for specific tasks (embedding, retrieval, classification) at specific scales (hundreds of millions of parameters). For generation, reasoning, dialogue, and general-purpose use, decoder-only models remain superior.' },
    { text: '28 layers, 1024 hidden, 16 heads, 395M params, 8,192 context', isTrue: true, explanation: '28 layers, 1024 hidden, 16 heads, 395M params, 8,192 context' },
    { text: 'The encoder was a dead architecture that got revived.', isTrue: false, explanation: 'Encoder models never stopped being used in production. Google Search still uses BERT-based models.' },
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
