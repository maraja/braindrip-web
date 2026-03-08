import { useState } from 'react';
export default function QuizLLE01Roberta() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'RoBERTa is a different architecture from BERT.', isTrue: false, explanation: 'RoBERTa uses the exact same Transformer encoder architecture as BERT. Every improvement comes from the training recipe: more data, larger batches, dynamic masking, no NSP, longer training, and byte-level BPE.' },
    { text: '12 layers, 12 heads, 768 hidden, 125M parameters', isTrue: true, explanation: '12 layers, 12 heads, 768 hidden, 125M parameters' },
    { text: 'Dynamic masking was the key improvement.', isTrue: false, explanation: 'Dynamic masking helped, but its contribution was modest (~0.1-0.3 points on GLUE). The largest gains came from more data (160GB vs 16GB) and longer training with larger batches.' },
    { text: '24 layers, 16 heads, 1024 hidden, 355M parameters', isTrue: true, explanation: '24 layers, 16 heads, 1024 hidden, 355M parameters' },
    { text: 'RoBERTa proved XLNet\'s approach was wrong.', isTrue: false, explanation: 'RoBERTa showed that BERT\'s approach was sufficient, not that XLNet\'s was wrong. Permutation language modeling has genuine theoretical advantages (no pretrain-finetune discrepancy, no independence assumption).' },
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
