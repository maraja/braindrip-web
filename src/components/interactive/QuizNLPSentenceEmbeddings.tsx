import { useState } from 'react';
export default function QuizNLPSentenceEmbeddings() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'BERT\'s [CLS] token is a good sentence embedding.', isTrue: false, explanation: 'Raw BERT [CLS] tokens produce poor sentence representations (29% Spearman on STS). BERT was trained with masked language modeling and next sentence prediction, not semantic similarity.' },
    { text: 'Common dimensions are 384 (MiniLM), 512 (USE), 768 (SBERT-base), 1024 (SBERT-large).', isTrue: true, explanation: 'Matryoshka representation learning allows truncating vectors to smaller dimensions with graceful degradation.' },
    { text: 'Averaging word vectors is always outperformed by neural encoders.', isTrue: false, explanation: 'Weighted averaging (SIF) with good word vectors is competitive with many neural approaches and is orders of magnitude faster. For low-resource scenarios or when labeled data is unavailable, SIF averaging remains a strong baseline.' },
    { text: 'all-MiniLM-L6-v2 encodes ~14,000 sentences/sec on GPU vs.', isTrue: true, explanation: '~2,000/sec for SBERT-base, with only ~3% lower STS correlation.' },
    { text: 'Sentence embeddings capture everything about a sentence.', isTrue: false, explanation: 'Fixed-length vectors inevitably lose information. Negation ("I love this" vs.' },
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
