import { useState } from 'react';
export default function QuizNLPRelationExtraction() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Relation extraction and relation classification are the same.', isTrue: false, explanation: 'Relation classification assumes entity pairs are given and only assigns a label. Full relation extraction includes entity identification, pair enumeration, and classification -- a substantially harder pipeline.' },
    { text: '9 relation types + NONE; SOTA ~89--90% F1 (BERT-based); CNN baseline ~82%.', isTrue: true, explanation: '9 relation types + NONE; SOTA ~89--90% F1 (BERT-based); CNN baseline ~82%.' },
    { text: 'Distant supervision produces clean training data.', isTrue: false, explanation: 'The distant supervision assumption is frequently violated. Two entities may co-occur without the KB relation being expressed, or a different relation may hold.' },
    { text: '42 relation types, ~106k sentences; SOTA ~75% F1; more challenging due to class imbalance (~80% NONE).', isTrue: true, explanation: '42 relation types, ~106k sentences; SOTA ~75% F1; more challenging due to class imbalance (~80% NONE).' },
    { text: 'More relation types are always better.', isTrue: false, explanation: 'Fine-grained relation inventories increase ambiguity and data sparsity. The choice of relation ontology should balance coverage against annotability and downstream utility.' },
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
