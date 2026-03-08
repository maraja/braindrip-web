import { useState } from 'react';
export default function QuizLLE02Albert() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'ALBERT is faster than BERT because it has fewer parameters.', isTrue: false, explanation: 'This is the most common misunderstanding. ALBERT has fewer unique parameters (less memory) but the same or greater computational cost.' },
    { text: '12 layers, H=4096, 64 heads, 235M params — best performing configuration', isTrue: true, explanation: '12 layers, H=4096, 64 heads, 235M params — best performing configuration' },
    { text: 'Cross-layer parameter sharing always hurts performance.', isTrue: false, explanation: 'It does hurt compared to unique parameters per layer — but less than you might expect. ALBERT-xxlarge with shared parameters outperformed BERT-Large with unique parameters, because the parameter savings were reinvested into a much wider hidden dimension.' },
    { text: 'ALBERT-base 12M vs BERT-base 110M (9x); ALBERT-xxlarge 235M vs BERT-Large 340M (1.4x)', isTrue: true, explanation: 'ALBERT-base 12M vs BERT-base 110M (9x); ALBERT-xxlarge 235M vs BERT-Large 340M (1.4x)' },
    { text: 'ALBERT made BERT obsolete.', isTrue: false, explanation: 'ALBERT explored an interesting point in the design space but did not replace BERT or RoBERTa in practice. Its inference speed disadvantage limited production adoption.' },
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
