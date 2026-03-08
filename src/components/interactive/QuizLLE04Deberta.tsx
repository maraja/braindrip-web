import { useState } from 'react';
export default function QuizLLE04Deberta() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'DeBERTa just adds more parameters to BERT.', isTrue: false, explanation: 'DeBERTa\'s improvements come from architectural innovation (disentangled attention, EMD), not just scale. DeBERTa-Large (390M) outperformed RoBERTa-Large (355M) — models of similar size — by a significant margin.' },
    { text: '24 layers, 16 heads, 1024 hidden, 390M parameters', isTrue: true, explanation: '24 layers, 16 heads, 1024 hidden, 390M parameters' },
    { text: 'Disentangled attention triples the computation.', isTrue: false, explanation: 'The three attention components share much of their computation (key/query projections are reused). The overhead is approximately 20-30% compared to standard attention — meaningful but not tripling.' },
    { text: '24 layers, 24 heads, 1536 hidden, 750M parameters', isTrue: true, explanation: '24 layers, 24 heads, 1536 hidden, 750M parameters' },
    { text: 'Surpassing human performance means DeBERTa understands language like humans.', isTrue: false, explanation: 'SuperGLUE measures specific types of language tasks in a controlled format. DeBERTa excels at pattern matching in these formats but lacks common sense, world knowledge, and the flexible reasoning that characterize human language understanding.' },
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
